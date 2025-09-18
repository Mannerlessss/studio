'use server';
/**
 * @fileOverview A server-side flow to securely fetch public-facing application statistics.
 */
import { z } from 'zod';
import { adminDb } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';

const PublicStatsSchema = z.object({
    totalUsers: z.number(),
    totalInvestments: z.number(),
    totalWithdrawals: z.number(),
    totalBonuses: z.number(),
});
export type PublicStats = z.infer<typeof PublicStatsSchema>;

const getPublicStatsFlow = ai.defineFlow(
  {
    name: 'getPublicStatsFlow',
    inputSchema: z.void(),
    outputSchema: PublicStatsSchema,
  },
  async () => {
    // 1. Total Users
    const usersSnapshot = await adminDb.collection('users').get();
    const totalUsers = usersSnapshot.size;

    // 2. Total Investments & Bonuses
    let totalInvestments = 0;
    let totalBonuses = 0;
    usersSnapshot.forEach(doc => {
        const data = doc.data();
        totalInvestments += data.totalInvested || 0;
        totalBonuses += (data.totalBonusEarnings || 0) + (data.totalReferralEarnings || 0);
    });

    // 3. Total Approved Withdrawals
    const withdrawalsSnapshot = await adminDb.collectionGroup('withdrawals').where('status', '==', 'Approved').get();
    let totalWithdrawals = 0;
    withdrawalsSnapshot.forEach(doc => {
        totalWithdrawals += doc.data().amount || 0;
    });

    return {
        totalUsers,
        totalInvestments,
        totalWithdrawals,
        totalBonuses,
    };
  }
);

export async function getPublicStats(): Promise<PublicStats> {
    return getPublicStatsFlow();
}
