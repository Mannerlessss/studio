'use server';
/**
 * @fileOverview A server-side flow to securely redeem a referral code.
 *
 * This flow handles the complex logic of validating a referral code
 * and linking the new user to their referrer.
 * This is a privileged operation that requires the Firebase Admin SDK.
 */
import { z } from 'zod';
import { db, adminSDK } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';

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


export const redeemCodeFlow = ai.defineFlow({
    name: 'redeemCodeFlow',
    inputSchema: RedeemCodeInputSchema,
    outputSchema: RedeemCodeOutputSchema,
}, async ({ userId, userName, userEmail, code }) => {
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
            
            // 1. Update the user who redeemed the code to link them to the referrer
            transaction.update(userRef, {
                usedReferralCode: code.toUpperCase(),
                referredBy: referrerDoc.id,
            });

            // 2. Add the new user to the referrer's `referrals` subcollection
            const newReferralRef = db.collection('users').doc(referrerDoc.id).collection('referrals').doc();
            transaction.set(newReferralRef, {
                userId: userId,
                name: userName,
                email: userEmail,
                hasInvested: false,
                joinedAt: adminSDK.firestore.FieldValue.serverTimestamp(),
            });
        });

        return {
            success: true,
            message: 'Code redeemed successfully! Your welcome bonus will be applied on your first investment.',
        };
    } catch (error: any) {
        console.error('Redeem code transaction failed: ', error);
        throw new Error(error.message || 'An unknown error occurred during redemption.');
    }
});

export async function redeemCode(input: RedeemCodeInput): Promise<RedeemCodeOutput> {
    return redeemCodeFlow(input);
}
