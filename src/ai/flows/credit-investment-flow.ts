'use server';
/**
 * @fileOverview A server-side flow to securely credit an investment to a user.
 *
 * This flow handles creating investment documents, updating user totals,
 * and processing referral bonuses for the first investment.
 */
import { z } from 'zod';
import { db, adminSDK } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';
import { doc, getDoc, collection, writeBatch, serverTimestamp, query, where, getDocs, increment, Timestamp } from 'firebase/firestore';

const CreditInvestmentInputSchema = z.object({
  userId: z.string(),
  amount: z.number(),
});
export type CreditInvestmentInput = z.infer<typeof CreditInvestmentInputSchema>;

const CreditInvestmentOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

const milestones: { [key: number]: number } = {
  5: 250, 10: 500, 20: 1000, 30: 1500, 40: 2000, 50: 2500,
};

export const creditInvestmentFlow = ai.defineFlow(
  {
    name: 'creditInvestmentFlow',
    inputSchema: CreditInvestmentInputSchema,
    outputSchema: CreditInvestmentOutputSchema,
  },
  async ({ userId, amount }) => {
    const userDocRef = doc(db, 'users', userId);
    const batch = writeBatch(db);
    const now = adminSDK.firestore.FieldValue.serverTimestamp();

    try {
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            throw new Error(`User with ID ${userId} not found.`);
        }
        const user = userDoc.data();

        // 1. Create a new document in the `investments` subcollection
        const newInvestmentRef = doc(collection(db, `users/${userId}/investments`));
        const dailyReturnRate = user.membership === 'Pro' ? 0.13 : 0.10;
        batch.set(newInvestmentRef, {
            planAmount: amount,
            dailyReturn: amount * dailyReturnRate,
            startDate: now,
            lastUpdate: now,
            durationDays: 30,
            earnings: 0,
            status: 'active',
        });

        // 2. Create a transaction record
        const transactionRef = doc(collection(db, `users/${userId}/transactions`));
        batch.set(transactionRef, {
            type: 'investment',
            amount,
            description: `Invested in Plan ${amount}`,
            status: 'Completed',
            date: now,
        });
        
        // 3. Update the user's main document
        const userUpdates: any = {
            totalInvested: increment(amount),
        };
        if (!user.hasInvested) {
            userUpdates.hasInvested = true;
            if (user.referredBy) {
                userUpdates.commissionParent = user.referredBy;
            }
        }
        batch.update(userDocRef, userUpdates);

        // 4. Handle Referral Logic (if it's the user's first investment >= 100)
        if (!user.hasInvested && user.referredBy && amount >= 100) {
            const referrerDocRef = doc(db, 'users', user.referredBy);
            const referrerDoc = await getDoc(referrerDocRef);

            if (referrerDoc.exists()) {
                const referrerData = referrerDoc.data();
                const bonusAmount = 75; // Standard referral bonus

                batch.update(userDocRef, {
                    totalBalance: increment(bonusAmount),
                    totalBonusEarnings: increment(bonusAmount),
                    totalEarnings: increment(bonusAmount),
                });
                const userBonusTransactionRef = doc(collection(db, `users/${userId}/transactions`));
                batch.set(userBonusTransactionRef, {
                    type: 'bonus', amount: bonusAmount, description: `Welcome referral bonus!`, status: 'Completed', date: now,
                });

                const newReferralCount = (referrerData.investedReferralCount || 0) + 1;
                batch.update(referrerDocRef, {
                    totalBalance: increment(bonusAmount),
                    totalReferralEarnings: increment(bonusAmount),
                    totalEarnings: increment(bonusAmount),
                    investedReferralCount: increment(1),
                });
                const referrerBonusTransactionRef = doc(collection(db, `users/${user.referredBy}/transactions`));
                 batch.set(referrerBonusTransactionRef, {
                    type: 'referral', amount: bonusAmount, description: `Referral bonus from ${user.name}`, status: 'Completed', date: now,
                });
                
                const claimedMilestones = referrerData.claimedMilestones || [];
                for (const milestone in milestones) {
                    const milestoneNum = Number(milestone);
                    if (newReferralCount >= milestoneNum && !claimedMilestones.includes(milestoneNum)) {
                        const rewardAmount = milestones[milestoneNum];
                         batch.update(referrerDocRef, {
                            totalBalance: increment(rewardAmount),
                            totalReferralEarnings: increment(rewardAmount),
                            totalEarnings: increment(rewardAmount),
                            claimedMilestones: [...claimedMilestones, milestoneNum]
                        });

                         const milestoneTransactionRef = doc(collection(db, `users/${user.referredBy}/transactions`));
                         batch.set(milestoneTransactionRef, {
                            type: 'bonus', amount: rewardAmount, description: `Milestone Bonus: ${milestone} referrals`, status: 'Completed', date: now,
                        });
                    }
                }
                
                const referrerReferralsRef = collection(db, 'users', user.referredBy, 'referrals');
                const q = query(referrerReferralsRef, where("userId", "==", userId));
                const referredUserDocs = await getDocs(q);
                
                if (referredUserDocs.empty) {
                    const newReferralSubDocRef = doc(referrerReferralsRef);
                    batch.set(newReferralSubDocRef, {
                        userId: userId,
                        name: user.name,
                        email: user.email,
                        hasInvested: true,
                        joinedAt: user.createdAt || now
                    });
                } else {
                    const referredUserDocRef = referredUserDocs.docs[0].ref;
                    batch.update(referredUserDocRef, { hasInvested: true });
                }
            }
        }
        
        await batch.commit();
        
        return {
            success: true,
            message: `Investment of ${amount} Rs. credited successfully for ${user.name}.`,
        };
    } catch (error: any) {
        console.error('Credit Investment Flow failed:', error);
        throw new Error(error.message || 'An unknown server error occurred.');
    }
  }
);


export async function creditInvestment(input: CreditInvestmentInput): Promise<{success: boolean, message: string}> {
    return await creditInvestmentFlow(input);
}
