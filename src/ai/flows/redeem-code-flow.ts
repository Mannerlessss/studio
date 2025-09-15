'use server';
/**
 * @fileOverview A server-side flow to securely redeem a referral code.
 *
 * This flow handles the complex logic of validating a referral code,
 * applying a bonus to the new user, and updating the referrer's records.
 * This is a privileged operation that requires the Firebase Admin SDK.
 */
import { z } from 'zod';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

const RedeemCodeInputSchema = z.object({
    userId: z.string().describe('The UID of the user redeeming the code.'),
    userName: z.string().describe('The name of the user redeeming the code.'),
    userEmail: z.string().describe('The email of the user redeeming the code.'),
    code: z.string().describe('The referral code being redeemed.'),
});
export type RedeemCodeInput = z.infer<typeof RedeemCodeInputSchema>;

const RedeemCodeOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
export type RedeemCodeOutput = z.infer<typeof RedeemCodeOutputSchema>;


export async function redeemCode(input: RedeemCodeInput): Promise<RedeemCodeOutput> {
    const { userId, userName, userEmail, code } = input;
    const { db, admin } = getFirebaseAdmin();

    const userRef = db.collection('users').doc(userId);

    try {
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                throw new Error('User does not exist.');
            }

            const userData = userDoc.data();
            if (userData?.usedReferralCode) {
                throw new Error('A referral code has already been used for this account.');
            }

            // Find the referrer by their code
            const usersRef = db.collection('users');
            const referrerQuery = usersRef.where('referralCode', '==', code.toUpperCase()).limit(1);
            const referrerSnapshot = await transaction.get(referrerQuery);
            

            if (referrerSnapshot.empty) {
                throw new Error('Invalid referral code.');
            }

            const referrerDoc = referrerSnapshot.docs[0];
            if (referrerDoc.id === userId) {
                throw new Error('You cannot use your own referral code.');
            }
            
            const welcomeBonus = 75;

            // 1. Update the user who redeemed the code
            transaction.update(userRef, {
                usedReferralCode: code.toUpperCase(),
                referredBy: referrerDoc.id,
                totalBalance: admin.firestore.FieldValue.increment(welcomeBonus),
                totalBonusEarnings: admin.firestore.FieldValue.increment(welcomeBonus),
                totalEarnings: admin.firestore.FieldValue.increment(welcomeBonus),
            });

            // 2. Create a transaction record for the bonus
            const userTransactionRef = db.collection('users').doc(userId).collection('transactions').doc();
            transaction.set(userTransactionRef, {
                type: 'bonus',
                amount: welcomeBonus,
                description: `Referral code redeemed`,
                status: 'Completed',
                date: admin.firestore.FieldValue.serverTimestamp(),
            });

            // 3. Add the new user to the referrer's `referrals` subcollection
            const newReferralRef = db.collection('users').doc(referrerDoc.id).collection('referrals').doc();
            transaction.set(newReferralRef, {
                userId: userId,
                name: userName,
                email: userEmail,
                hasInvested: false,
                joinedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        });

        return {
            success: true,
            message: 'Code redeemed successfully! You received a 75 Rs. bonus.',
        };
    } catch (error: any) {
        console.error('Redeem code transaction failed: ', error);
        throw new Error(error.message || 'An unknown error occurred during redemption.');
    }
}
