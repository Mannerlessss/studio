'use server';
/**
 * @fileOverview A server-side flow to securely fetch all user data for the admin panel.
 */
import { z } from 'zod';
import { adminDb } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';
import { Timestamp } from 'firebase-admin/firestore';

const UserForAdminSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    hasInvested: z.boolean().optional(),
    totalBalance: z.number(),
    totalInvestmentEarnings: z.number(),
    totalBonusEarnings: z.number(),
    totalReferralEarnings: z.number(),
    totalInvested: z.number(),
    claimedMilestones: z.array(z.number()).optional(),
    investedReferralCount: z.number(),
    referredBy: z.string().optional(),
    createdAt: z.any().optional(),
});

export type UserForAdmin = z.infer<typeof UserForAdminSchema>;

const GetAllUsersOutputSchema = z.array(UserForAdminSchema);

const getAllUsersFlow = ai.defineFlow(
  {
    name: 'getAllUsersFlow',
    inputSchema: z.void(),
    outputSchema: GetAllUsersOutputSchema,
  },
  async () => {
    const usersSnapshot = await adminDb.collection('users').get();
    const usersData: UserForAdmin[] = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : null;

        return {
            id: doc.id,
            name: data.name || 'N/A',
            email: data.email || 'N/A',
            hasInvested: data.hasInvested || false,
            totalBalance: data.totalBalance || 0,
            totalInvestmentEarnings: data.totalInvestmentEarnings || 0,
            totalBonusEarnings: data.totalBonusEarnings || 0,
            totalReferralEarnings: data.totalReferralEarnings || 0,
            totalInvested: data.totalInvested || 0,
            investedReferralCount: data.investedReferralCount || 0,
            referredBy: data.referredBy,
            claimedMilestones: data.claimedMilestones,
            createdAt: createdAt,
        };
    });
    return usersData;
  }
);

export async function getAllUsers(): Promise<UserForAdmin[]> {
    return await getAllUsersFlow();
}
