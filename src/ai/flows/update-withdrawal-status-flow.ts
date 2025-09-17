'use server';
/**
 * @fileOverview A server-side flow to securely update the status of a withdrawal request.
 */
import { z } from 'zod';
import { adminDb } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';
import { FieldValue } from 'firebase-admin/firestore';

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


const updateWithdrawalStatusFlow = ai.defineFlow({
    name: 'updateWithdrawalStatusFlow',
    inputSchema: UpdateWithdrawalStatusInputSchema,
    outputSchema: UpdateWithdrawalStatusOutputSchema,
}, async ({ userId, withdrawalId, newStatus, amount }) => {
    try {
        const withdrawalDocRef = adminDb.doc(`users/${userId}/withdrawals/${withdrawalId}`);
        const batch = adminDb.batch();

        batch.update(withdrawalDocRef, { status: newStatus });
        
        // Find and update the corresponding transaction document
        const transactionQuery = adminDb.collection(`users/${userId}/transactions`) 
            .where('type', '==', 'withdrawal')
            .where('amount', '==', amount)
            .where('status', '==', 'Pending')
            .limit(1); // Find the first match
            
        const transactionSnapshot = await transactionQuery.get();
        if (!transactionSnapshot.empty) {
            const transactionDocRef = transactionSnapshot.docs[0].ref;
            batch.update(transactionDocRef, { status: newStatus });
        }

        if (newStatus === 'Rejected') {
            const userDocRef = adminDb.doc(`users/${userId}`);
            batch.update(userDocRef, {
                totalBalance: FieldValue.increment(amount)
            });
        }

        await batch.commit();

        return {
            success: true,
            message: `Withdrawal request has been ${newStatus.toLowerCase()}.`,
        };
    } catch(e: any) {
        console.error("Failed to update withdrawal status", e);
        throw new Error(`Server failed to update status: ${e.message}`);
    }
});

// Exported wrapper function
export async function updateWithdrawalStatus(input: UpdateWithdrawalStatusInput): Promise<{success: boolean, message: string}> {
    return updateWithdrawalStatusFlow(input);
}
