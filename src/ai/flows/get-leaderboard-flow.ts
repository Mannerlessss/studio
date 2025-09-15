'use server';
/**
 * @fileOverview A server-side flow to securely fetch the referral leaderboard.
 *
 * This flow queries the entire users collection to find the top referrers,
 * an operation that clients cannot do directly due to security rules.
 */
import { z } from 'zod';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';
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
    const { db } = getFirebaseAdmin();
    const usersRef = db.collection('users');
    const q = query(usersRef, orderBy('investedReferralCount', 'desc'), limit(5));
    const querySnapshot = await getDocs(q);
    
    const topUsers = querySnapshot.docs
        .map(doc => doc.data() as LeaderboardUser)
        .filter(user => user.investedReferralCount > 0);

    return topUsers;
  }
);


// Exported wrapper function
export async function getLeaderboard(): Promise<GetLeaderboardOutput> {
    return getLeaderboardFlow();
}

// Helper functions from firestore, manually added as they are not available in this context
function query(collectionRef: any, ...constraints: any[]) {
    let q = collectionRef;
    constraints.forEach(c => {
        q = q[c.type](...c.args);
    });
    return q;
}

function orderBy(fieldPath: string, directionStr: 'asc' | 'desc' = 'asc') {
    return { type: 'orderBy', args: [fieldPath, directionStr] };
}

function limit(num: number) {
    return { type: 'limit', args: [num] };
}

async function getDocs(query: any) {
    return await query.get();
}
