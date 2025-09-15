'use server';
/**
 * @fileOverview A server-side flow to securely fetch the referral leaderboard.
 */
import { z } from 'zod';
import { adminDb } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';

const LeaderboardUserSchema = z.object({
    name: z.string(),
    investedReferralCount: z.number(),
});

export type LeaderboardUser = z.infer<typeof LeaderboardUserSchema>;

const GetLeaderboardOutputSchema = z.array(LeaderboardUserSchema);
export type GetLeaderboardOutput = z.infer<typeof GetLeaderboardOutputSchema>;


export const getLeaderboardFlow = ai.defineFlow(
  {
    name: 'getLeaderboardFlow',
    inputSchema: z.void(),
    outputSchema: GetLeaderboardOutputSchema,
  },
  async () => {
    const usersRef = adminDb.collection('users');
    const q = usersRef.orderBy('investedReferralCount', 'desc').limit(5);
    const querySnapshot = await q.get();
    
    const topUsers: LeaderboardUser[] = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            name: data.name || 'Anonymous',
            investedReferralCount: data.investedReferralCount || 0
          }
        })
        .filter(user => user.investedReferralCount > 0);

    return topUsers;
  }
);


// Exported wrapper function
export async function getLeaderboard(): Promise<LeaderboardUser[]> {
    return getLeaderboardFlow();
}
