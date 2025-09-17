'use server';
/**
 * @fileOverview A server-side flow to securely fetch all withdrawal requests for the admin panel.
 */
import { z } from 'zod';
import { adminDb } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';
import { Timestamp } from 'firebase-admin/firestore';

const WithdrawalDetailsSchema = z.object({
  upiId: z.string().optional(),
  accountHolder: z.string().optional(),
  accountNumber: z.string().optional(),
  ifsc: z.string().optional(),
});

const WithdrawalRequestSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  amount: z.number(),
  method: z.enum(['UPI', 'Bank Transfer']),
  details: WithdrawalDetailsSchema,
  date: z.string(), // Send as ISO string
  status: z.enum(['Pending', 'Approved', 'Rejected']),
});

export type WithdrawalRequest = z.infer<typeof WithdrawalRequestSchema>;

const GetAllWithdrawalsOutputSchema = z.array(WithdrawalRequestSchema);

const getAllWithdrawalsFlow = ai.defineFlow(
  {
    name: 'getAllWithdrawalsFlow',
    inputSchema: z.void(),
    outputSchema: GetAllWithdrawalsOutputSchema,
  },
  async () => {
    const withdrawalsSnapshot = await adminDb.collectionGroup('withdrawals').get();
    
    const requests: WithdrawalRequest[] = [];
    withdrawalsSnapshot.forEach(docSnap => {
        const data = docSnap.data();
        const date = data.date instanceof Timestamp ? data.date.toDate().toISOString() : new Date().toISOString();

        requests.push({ 
            id: docSnap.id,
            userId: docSnap.ref.parent.parent!.id,
            userName: data.userName || 'N/A',
            amount: data.amount || 0,
            method: data.method || 'UPI',
            details: data.details || {},
            date: date,
            status: data.status || 'Pending',
        });
    });
    
    return requests;
  }
);

export async function getAllWithdrawals(): Promise<WithdrawalRequest[]> {
    return getAllWithdrawalsFlow();
}
