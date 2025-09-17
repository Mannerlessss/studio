'use server';
/**
 * @fileOverview A server-side flow to securely credit an investment to a user.
 */
import { z } from 'zod';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';
import * as admin from 'firebase-admin';

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

const creditInvestmentFlow = ai.defineFlow(
  {
    name: 'creditInvestmentFlow',
    inputSchema: CreditInvestmentInputSchema,
    outputSchema: CreditInvestmentOutputSchema,
  },
  async ({ userId, amount }) => {
    
    try {
        const adminDb = await getAdminDb();
        const userDocRef = adminDb.collection('users').doc(userId);
        
        await adminDb.runTransaction(async (transaction) => {
            // --- ALL READS MUST HAPPEN BEFORE WRITES ---
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists) {
                throw new Error(`User with ID ${userId} not found.`);
            }
            const user = userDoc.data()!;
            
            let referrerDoc: admin.firestore.DocumentSnapshot | null = null;
            let referrerDocRef: admin.firestore.DocumentReference | null = null;
            
            // If it's the user's first investment, we might need referrer data. Read it now.
            if (!user.hasInvested && user.referredBy && amount >= 100) {
                referrerDocRef = adminDb.collection('users').doc(user.referredBy);
                referrerDoc = await transaction.get(referrerDocRef);
            }
            // --- END OF READS ---

            const now = admin.firestore.FieldValue.serverTimestamp();

            // --- ALL WRITES START HERE ---
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

            const transactionRef = adminDb.collection(`users/${userId}/transactions`).doc();
            transaction.set(transactionRef, {
                type: 'investment', amount, description: `Invested in Plan ${amount}`, status: 'Completed', date: now,
            });
            
            const userUpdates: { [key: string]: any } = {
                totalInvested: admin.firestore.FieldValue.increment(amount),
            };
            if (!user.hasInvested) {
                userUpdates.hasInvested = true;
                if (user.referredBy) {
                    userUpdates.commissionParent = user.referredBy;
                }
            }
            
            // Give welcome bonus to the new investor if they were referred on their first investment
            if (referrerDoc?.exists) {
                 const bonusAmount = 75;
                 userUpdates.totalBalance = admin.firestore.FieldValue.increment(bonusAmount);
                 userUpdates.totalBonusEarnings = admin.firestore.FieldValue.increment(bonusAmount);
                 userUpdates.totalEarnings = admin.firestore.FieldValue.increment(bonusAmount);
                 
                 const userBonusTransactionRef = adminDb.collection(`users/${userId}/transactions`).doc();
                 transaction.set(userBonusTransactionRef, {
                    type: 'bonus', amount: bonusAmount, description: `Welcome referral bonus!`, status: 'Completed', date: now,
                });
            }

            transaction.update(userDocRef, userUpdates);

            // Handle referral logic if a valid referrer was read earlier
            if (referrerDocRef && referrerDoc && referrerDoc.exists) {
                const referrerData = referrerDoc.data()!;
                const bonusAmount = 75;

                const newReferralCount = (referrerData.investedReferralCount || 0) + 1;
                
                const referrerUpdates: { [key: string]: any } = {
                    totalBalance: admin.firestore.FieldValue.increment(bonusAmount),
                    totalReferralEarnings: admin.firestore.FieldValue.increment(bonusAmount),
                    totalEarnings: admin.firestore.FieldValue.increment(bonusAmount),
                    investedReferralCount: admin.firestore.FieldValue.increment(1),
                };

                const referrerBonusTransactionRef = adminDb.collection(`users/${user.referredBy}/transactions`).doc();
                transaction.set(referrerBonusTransactionRef, {
                    type: 'referral', amount: bonusAmount, description: `Referral bonus from ${user.name}`, status: 'Completed', date: now,
                });
                
                const claimedMilestones = referrerData.claimedMilestones || [];
                for (const milestone in milestones) {
                    const milestoneNum = Number(milestone);
                    if (newReferralCount >= milestoneNum && !claimedMilestones.includes(milestoneNum)) {
                        const rewardAmount = milestones[milestoneNum];
                        referrerUpdates.totalBalance = admin.firestore.FieldValue.increment(rewardAmount);
                        referrerUpdates.totalReferralEarnings = admin.firestore.FieldValue.increment(rewardAmount);
                        referrerUpdates.totalEarnings = admin.firestore.FieldValue.increment(rewardAmount);
                        referrerUpdates.claimedMilestones = admin.firestore.FieldValue.arrayUnion(milestoneNum);

                        const milestoneTransactionRef = adminDb.collection(`users/${user.referredBy}/transactions`).doc();
                        transaction.set(milestoneTransactionRef, {
                            type: 'bonus', amount: rewardAmount, description: `Milestone Bonus: ${milestone} referrals`, status: 'Completed', date: now,
                        });
                    }
                }
                
                transaction.update(referrerDocRef, referrerUpdates);
                
                // Finally, update the referral subcollection document
                const referrerReferralsRef = adminDb.collection('users').doc(user.referredBy).collection('referrals');
                const q = referrerReferralsRef.where("userId", "==", userId);
                const referredUserQuerySnapshot = await q.get(); // This is a read OUTSIDE the transaction, but it's safe to find the doc to update.
                
                if (referredUserQuerySnapshot.empty) {
                    // This should ideally not happen if the referral was recorded at signup, but as a fallback:
                    const newSubDoc = referrerReferralsRef.doc();
                    transaction.set(newSubDoc, { hasInvested: true }, { merge: true });
                } else {
                    const referredUserDocRef = referredUserQuerySnapshot.docs[0].ref;
                    transaction.update(referredUserDocRef, { hasInvested: true });
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
    return creditInvestmentFlow(input);
}
