
'use server';
/**
 * @fileOverview A flow for redeeming referral codes.
 *
 * - redeemReferral - A function that handles the referral code redemption process.
 * - RedeemReferralInput - The input type for the redeemReferral function.
 * - RedeemReferralOutput - The return type for the redeemReferral function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFirestore } from 'firebase-admin/firestore';
import { FieldValue } from 'firebase-admin/firestore';

// Genkit's firebase plugin initializes the app, so we just need to get the instance.
const db = getFirestore();

export const RedeemReferralInputSchema = z.object({
  code: z.string().describe('The referral code being redeemed.'),
  userId: z.string().describe('The UID of the user redeeming the code.'),
  userName: z.string().describe('The name of the user redeeming the code.'),
  userEmail: z.string().describe('The email of the user redeeming the code.'),
});
export type RedeemReferralInput = z.infer<typeof RedeemReferralInputSchema>;

export const RedeemReferralOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type RedeemReferralOutput = z.infer<typeof RedeemReferralOutputSchema>;

export async function redeemReferral(
  input: RedeemReferralInput
): Promise<RedeemReferralOutput> {
  return redeemReferralFlow(input);
}

const redeemReferralFlow = ai.defineFlow(
  {
    name: 'redeemReferralFlow',
    inputSchema: RedeemReferralInputSchema,
    outputSchema: RedeemReferralOutputSchema,
  },
  async (input) => {
    const { code, userId, userName, userEmail } = input;
    const formattedCode = code.trim().toUpperCase();

    try {
      const result = await db.runTransaction(async (transaction) => {
        // 1. Check if the redeeming user has already used a code
        const currentUserRef = db.collection('users').doc(userId);
        const currentUserDoc = await transaction.get(currentUserRef);
        if (!currentUserDoc.exists) {
            throw new Error('Your user profile could not be found.');
        }
        const currentUserData = currentUserDoc.data()!;
        if (currentUserData.usedReferralCode) {
            throw new Error('You have already redeemed a referral code.');
        }

        // 2. Find the referrer by their code
        const usersRef = db.collection('users');
        const referrerQuery = usersRef.where('referralCode', '==', formattedCode).limit(1);
        const referrerSnapshot = await transaction.get(referrerQuery);

        if (referrerSnapshot.empty) {
          throw new Error('This referral code is not valid.');
        }

        const referrerDoc = referrerSnapshot.docs[0];
        const referrerId = referrerDoc.id;
        
        // 3. Prevent self-referral
        if (referrerId === userId) {
            throw new Error("You cannot use your own referral code.");
        }

        // 4. Update both user documents
        // Update the current user
        transaction.update(currentUserRef, {
          usedReferralCode: formattedCode,
          referredBy: referrerId,
        });

        // Update the referrer
        const referrerRef = db.collection('users').doc(referrerId);
        transaction.update(referrerRef, {
            referrals: FieldValue.arrayUnion({
                userId: userId,
                name: userName,
                email: userEmail,
                hasInvested: false,
                date: new Date(),
            })
        });
        
        return `Successfully redeemed code from ${referrerDoc.data().name}!`;
      });

      return { success: true, message: result };
    } catch (error: any) {
      return { success: false, message: error.message || 'An unexpected error occurred.' };
    }
  }
);
