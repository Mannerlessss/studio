'use server';
/**
 * @fileOverview A server-side flow to securely credit an investment to a user.
 */
import { z } from 'zod';
import { adminDb } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

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
    
    try {
        const userDocRef = adminDb.collection('users').doc(userId);
        
        await adminDb.runTransaction(async (transaction) => {
            // --- ALL READS MUST COME BEFORE WRITES ---

            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists) {
                throw new Error(`User with ID ${userId} not found.`);
            }
            const user = userDoc.data()!;
            
            let referrerDoc: admin.firestore.DocumentSnapshot | null = null;
            let referredUserQuerySnapshot: admin.firestore.QuerySnapshot | null = null;
            let referrerDocRef: admin.firestore.DocumentReference | null = null;

            // If a referral is involved, read all necessary documents first.
            if (!user.hasInvested && user.referredBy && amount >= 100) {
                referrerDocRef = adminDb.collection('users').doc(user.referredBy);
                referrerDoc = await transaction.get(referrerDocRef);

                if (referrerDoc.exists) {
                    const referrerReferralsRef = adminDb.collection('users').doc(user.referredBy).collection('referrals');
                    const q = referrerReferralsRef.where("userId", "==", userId);
                    referredUserQuerySnapshot = await transaction.get(q);
                }
            }
            
            // --- ALL WRITES AFTER THIS POINT ---
            const now = FieldValue.serverTimestamp();

            // 1. Create a new document in the `investments` subcollection
            const newInvestmentRef = adminDb.collection(`users/${userId}/investments`).doc();
            const dailyReturnRate = user.membership === 'Pro' ? 0.13 : 0.10;
            transaction.set(newInvestmentRef, {
                planAmount: amount,
                dailyReturn: amount * dailyReturnRate,
                startDate: now,
                lastUpdate: now,
                durationDays: 30,
                earnings: 0,
                status: 'active',
            });

            // 2. Create a transaction record
            const transactionRef = adminDb.collection(`users/${userId}/transactions`).doc();
            transaction.set(transactionRef, {
                type: 'investment', amount, description: `Invested in Plan ${amount}`, status: 'Completed', date: now,
            });
            
            // 3. Update the user's main document
            const userUpdates: { [key: string]: any } = {
                totalInvested: FieldValue.increment(amount),
            };
            if (!user.hasInvested) {
                userUpdates.hasInvested = true;
                if (user.referredBy) {
                    userUpdates.commissionParent = user.referredBy;
                }
            }
            transaction.update(userDocRef, userUpdates);

            // 4. Handle Referral Logic (if it's the user's first investment >= 100)
            if (referrerDoc && referrerDoc.exists && referrerDocRef) {
                const referrerData = referrerDoc.data()!;
                const bonusAmount = 75;

                transaction.update(userDocRef, {
                    totalBalance: FieldValue.increment(bonusAmount),
                    totalBonusEarnings: FieldValue.increment(bonusAmount),
                    totalEarnings: FieldValue.increment(bonusAmount),
                });
                const userBonusTransactionRef = adminDb.collection(`users/${userId}/transactions`).doc();
                transaction.set(userBonusTransactionRef, {
                    type: 'bonus', amount: bonusAmount, description: `Welcome referral bonus!`, status: 'Completed', date: now,
                });

                const newReferralCount = (referrerData.investedReferralCount || 0) + 1;
                transaction.update(referrerDocRef, {
                    totalBalance: FieldValue.increment(bonusAmount),
                    totalReferralEarnings: FieldValue.increment(bonusAmount),
                    totalEarnings: FieldValue.increment(bonusAmount),
                    investedReferralCount: FieldValue.increment(1),
                });
                const referrerBonusTransactionRef = adminDb.collection(`users/${user.referredBy}/transactions`).doc();
                transaction.set(referrerBonusTransactionRef, {
                    type: 'referral', amount: bonusAmount, description: `Referral bonus from ${user.name}`, status: 'Completed', date: now,
                });
                
                const claimedMilestones = referrerData.claimedMilestones || [];
                for (const milestone in milestones) {
                    const milestoneNum = Number(milestone);
                    if (newReferralCount >= milestoneNum && !claimedMilestones.includes(milestoneNum)) {
                        const rewardAmount = milestones[milestoneNum];
                        transaction.update(referrerDocRef, {
                            totalBalance: FieldValue.increment(rewardAmount),
                            totalReferralEarnings: FieldValue.increment(rewardAmount),
                            totalEarnings: FieldValue.increment(rewardAmount),
                            claimedMilestones: FieldValue.arrayUnion(milestoneNum)
                        });
                        const milestoneTransactionRef = adminDb.collection(`users/${user.referredBy}/transactions`).doc();
                        transaction.set(milestoneTransactionRef, {
                            type: 'bonus', amount: rewardAmount, description: `Milestone Bonus: ${milestone} referrals`, status: 'Completed', date: now,
                        });
                    }
                }
                
                if (referredUserQuerySnapshot) {
                    if (referredUserQuerySnapshot.empty) {
                        const referrerReferralsRef = adminDb.collection('users').doc(user.referredBy).collection('referrals');
                        transaction.set(referrerReferralsRef.doc(), {
                            userId, name: user.name, email: user.email, hasInvested: true, joinedAt: user.createdAt || now,
                        });
                    } else {
                        transaction.update(referredUserQuerySnapshot.docs[0].ref, { hasInvested: true });
                    }
                }
            }
        });
        
        return { success: true, message: `Investment of ${amount} Rs. credited successfully.` };
    } catch (error: any) {
        console.error('Credit Investment Flow failed:', error);
        throw new Error(error.message || 'An unknown server error occurred.');
    }
  }
);


export async function creditInvestment(input: CreditInvestmentInput): Promise<{success: boolean, message: string}> {
    return await creditInvestmentFlow(input);
}
