'use server';
/**
 * @fileOverview A server-side flow to securely fetch admin dashboard statistics.
 */
import { z } from 'zod';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';
import { Timestamp } from 'firebase-admin/firestore';

const GetAdminDashboardStatsOutputSchema = z.object({
    totalUsers: z.number(),
    pendingWithdrawals: z.number(),
    activeOffers: z.number(),
    totalInvestments: z.number(),
});
export type GetAdminDashboardStatsOutput = z.infer<typeof GetAdminDashboardStatsOutputSchema>;

const getAdminDashboardStatsFlow = ai.defineFlow(
  {
    name: 'getAdminDashboardStatsFlow',
    inputSchema: z.void(),
    outputSchema: GetAdminDashboardStatsOutputSchema,
  },
  async () => {
    const adminDb = await getAdminDb();
    const usersSnapshot = await adminDb.collection('users').get();
    const totalUsers = usersSnapshot.size;

    const withdrawalsSnapshot = await adminDb.collectionGroup('withdrawals').where('status', '==', 'Pending').get();
    const pendingWithdrawals = withdrawalsSnapshot.size;

    const offersSnapshot = await adminDb.collection('offers').get();
    const activeOffers = offersSnapshot.docs.filter(doc => {
        const offer = doc.data();
        const now = new Date();
        const isExpiredByDate = offer.expiresAt && (offer.expiresAt as Timestamp).toDate() < now;
        const isExpiredByUsage = offer.maxUsers && offer.usageCount >= offer.maxUsers;
        return !isExpiredByDate && !isExpiredByUsage;
    }).length;

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

export async function getAdminDashboardStats(): Promise<GetAdminDashboardStatsOutput> {
    return getAdminDashboardStatsFlow();
}
