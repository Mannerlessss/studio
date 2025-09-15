'use server';
/**
 * @fileOverview A server-side flow to securely fetch admin dashboard statistics.
 *
 * This flow queries various collections to compute stats, which clients cannot
 * do directly due to security rules.
 */
import { z } from 'zod';
import { db } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';
import { collection, collectionGroup, getDocs, query, where, Timestamp } from 'firebase/firestore';

const GetAdminDashboardStatsOutputSchema = z.object({
    totalUsers: z.number(),
    pendingWithdrawals: z.number(),
    activeOffers: z.number(),
    totalInvestments: z.number(),
});
export type GetAdminDashboardStatsOutput = z.infer<typeof GetAdminDashboardStatsOutputSchema>;

export const getAdminDashboardStatsFlow = ai.defineFlow(
  {
    name: 'getAdminDashboardStatsFlow',
    inputSchema: z.void(),
    outputSchema: GetAdminDashboardStatsOutputSchema,
  },
  async () => {
    // Total Users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const totalUsers = usersSnapshot.size;

    // Pending Withdrawals
    const withdrawalsQuery = query(collectionGroup(db, 'withdrawals'), where('status', '==', 'Pending'));
    const withdrawalsSnapshot = await getDocs(withdrawalsQuery);
    const pendingWithdrawals = withdrawalsSnapshot.size;

    // Active Offer Codes
    const offersSnapshot = await getDocs(collection(db, 'offers'));
    const activeOffers = offersSnapshot.docs.filter(doc => {
        const offer = doc.data();
        const now = new Date();
        const isExpiredByDate = offer.expiresAt && (offer.expiresAt as Timestamp).toDate() < now;
        const isExpiredByUsage = offer.maxUsers && offer.usageCount >= offer.maxUsers;
        return !isExpiredByDate && !isExpiredByUsage;
    }).length;

    // Total Investments
    let totalInvestments = 0;
    usersSnapshot.forEach(doc => {
        totalInvestments += doc.data().totalInvested || 0;
    });

    return {
        totalUsers,
        pendingWithdrawals,
        activeOffers,
        totalInvestments,
    };
  }
);

// Exported wrapper function
export async function getAdminDashboardStats(): Promise<GetAdminDashboardStatsOutput> {
    return getAdminDashboardStatsFlow();
}
