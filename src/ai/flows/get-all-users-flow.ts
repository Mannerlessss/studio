'use server';
/**
 * @fileOverview A server-side flow to securely fetch all user data for the admin panel.
 */
import { z } from 'zod';
import { db } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';
import { collection, getDocs, Timestamp } from 'firebase/firestore';

const UserForAdminSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    membership: z.enum(['Basic', 'Pro']),
    hasInvested: z.boolean().optional(),
    totalBalance: z.number(),
    totalInvestmentEarnings: z.number(),
    totalBonusEarnings: z.number(),
    totalReferralEarnings: z.number(),
    totalInvested: z.number(),
    claimedMilestones: z.array(z.number()).optional(),
    investedReferralCount: z.number(),
    referredBy: z.string().optional(),
    createdAt: z.any().optional(), // Allow any for Timestamp
});

export type UserForAdmin = z.infer<typeof UserForAdminSchema>;

const GetAllUsersOutputSchema = z.array(UserForAdminSchema);
export type GetAllUsersOutput = z.infer<typeof GetAllUsersOutputSchema>;

export const getAllUsersFlow = ai.defineFlow(
  {
    name: 'getAllUsersFlow',
    inputSchema: z.void(),
    outputSchema: GetAllUsersOutputSchema,
  },
  async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const usersData: UserForAdmin[] = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name || 'N/A',
            email: data.email || 'N/A',
            membership: data.membership || 'Basic',
            hasInvested: data.hasInvested || false,
            totalBalance: data.totalBalance || 0,
            totalInvestmentEarnings: data.totalInvestmentEarnings || 0,
            totalBonusEarnings: data.totalBonusEarnings || 0,
            totalReferralEarnings: data.totalReferralEarnings || 0,
            totalInvested: data.totalInvested || 0,
            investedReferralCount: data.investedReferralCount || 0,
            referredBy: data.referredBy,
            claimedMilestones: data.claimedMilestones,
            createdAt: data.createdAt, // Keep as is, will be serialized
        };
    });
    return usersData;
  }
);

export async function getAllUsers(): Promise<GetAllUsersOutput> {
    return getAllUsersFlow();
}
