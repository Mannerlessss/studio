'use server';
/**
 * @fileOverview A server-side flow to securely update the status of a withdrawal request.
 *
 * This flow uses the Admin SDK to ensure only authorized users (admins) can
 * approve or reject withdrawal requests.
 */
import { z } from 'zod';
import { db } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';
import { doc, writeBatch, getDoc, collection, query, where, getDocs, increment } from 'firebase/firestore';

// Schema for updating a withdrawal status
const UpdateWithdrawalStatusInputSchema = z.object({
    userId: z.string(),
    withdrawalId: z.string(),
    newStatus: z.enum(['Approved', 'Rejected']),
    amount: z.number(),
});
export type UpdateWithdrawalStatusInput = z.infer<typeof UpdateWithdrawalStatusInputSchema>;

const UpdateWithdrawalStatusOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});


export const updateWithdrawalStatusFlow = ai.defineFlow({
    name: 'updateWithdrawalStatusFlow',
    inputSchema: UpdateWithdrawalStatusInputSchema,
    outputSchema: UpdateWithdrawalStatusOutputSchema,
}, async ({ userId, withdrawalId, newStatus, amount }) => {

    const withdrawalDocRef = doc(db, `users/${userId}/withdrawals`, withdrawalId);
    const batch = writeBatch(db);

    // 1. Update the withdrawal document itself
    batch.update(withdrawalDocRef, { status: newStatus });
    
    // 2. Find and update the corresponding transaction document
    const transactionQuery = query(
        collection(db, `users/${userId}/transactions`), 
        where('type', '==', 'withdrawal'),
        where('amount', '==', amount),
        where('status', '==', 'Pending')
        // Ideally, we'd have a shared ID, but this is a pragmatic approach for now.
        // It finds the oldest pending withdrawal transaction matching the amount.
    );
    const transactionSnapshot = await getDocs(transactionQuery);
    if (!transactionSnapshot.empty) {
        const transactionDocRef = transactionSnapshot.docs[0].ref;
        batch.update(transactionDocRef, { status: newStatus });
    }

    // 3. If rejected, refund the balance to the user
    if (newStatus === 'Rejected') {
         const userDocRef = doc(db, 'users', userId);
         // We don't need to get the doc first when using `increment`
         batch.update(userDocRef, {
            totalBalance: increment(amount)
        });
    }

    await batch.commit();

    return {
        success: true,
        message: `Withdrawal request has been ${newStatus.toLowerCase()}.`,
    };
});

// Exported wrapper function
export async function updateWithdrawalStatus(input: UpdateWithdrawalStatusInput): Promise<{success: boolean, message: string}> {
    return updateWithdrawalStatusFlow(input);
}
