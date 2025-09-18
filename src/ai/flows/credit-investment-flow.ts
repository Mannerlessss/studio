'use server';
/**
 * @fileOverview A server-side flow to securely credit an investment to a user.
 */
import { z } from 'zod';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';
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
        const { db: adminDb } = getFirebaseAdmin();

        await adminDb.runTransaction(async (transaction) => {
            const userDocRef = adminDb.collection('users').doc(userId);
            
            // --- ALL READS MUST HAPPEN BEFORE WRITES ---
            const userDocInTransaction = await transaction.get(userDocRef);
            if (!userDocInTransaction.exists) {
                throw new Error(`User with ID ${userId} not found.`);
            }
            const userInTransaction = userDocInTransaction.data()!;
            
            let referrerDoc: admin.firestore.DocumentSnapshot | null = null;
            let referrerDocRef: admin.firestore.DocumentReference | null = null;
            let referredUserDocRefToUpdate: admin.firestore.DocumentReference | null = null;

            if (!userInTransaction.hasInvested && userInTransaction.referredBy && amount >= 100) {
                referrerDocRef = adminDb.collection('users').doc(userInTransaction.referredBy);
                referrerDoc = await transaction.get(referrerDocRef);

                const referrerReferralsRef = adminDb.collection('users').doc(userInTransaction.referredBy).collection('referrals');
                const q = referrerReferralsRef.where("userId", "==", userId);
                const referredUserQuerySnapshot = await transaction.get(q);
                if (!referredUserQuerySnapshot.empty) {
                    referredUserDocRefToUpdate = referredUserQuerySnapshot.docs[0].ref;
                }
            }
            // --- END OF READS ---

            // --- ALL WRITES START HERE ---
            const now = admin.firestore.FieldValue.serverTimestamp();
            
            const newInvestmentRef = adminDb.collection(`users/${userId}/investments`).doc();
            const dailyReturnRate = userInTransaction.membership === 'Pro' ? 0.20 : 0.10;
            transaction.set(newInvestmentRef, {
                planAmount: amount,
                dailyReturn: amount * dailyReturnRate,
                startDate: now,
                lastUpdate: now,
                durationDays: 30,
                daysProcessed: 0,
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
            if (!userInTransaction.hasInvested) {
                userUpdates.hasInvested = true;
                if (userInTransaction.referredBy) {
                    userUpdates.commissionParent = userInTransaction.referredBy;
                }
            }
            
            if (referrerDoc?.exists()) {
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

                const referrerBonusTransactionRef = adminDb.collection(`users/${userInTransaction.referredBy}/transactions`).doc();
                transaction.set(referrerBonusTransactionRef, {
                    type: 'referral', amount: bonusAmount, description: `Referral bonus from ${userInTransaction.name}`, status: 'Completed', date: now,
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

                        const milestoneTransactionRef = adminDb.collection(`users/${userInTransaction.referredBy}/transactions`).doc();
                        transaction.set(milestoneTransactionRef, {
                            type: 'bonus', amount: rewardAmount, description: `Milestone Bonus: ${milestone} referrals`, status: 'Completed', date: now,
                        });
                    }
                }
                
                transaction.update(referrerDocRef, referrerUpdates);
                
                if (referredUserDocRefToUpdate) {
                    transaction.update(referredUserDocRefToUpdate, { hasInvested: true });
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
