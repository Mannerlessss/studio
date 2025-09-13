
'use server';
/**
 * @fileOverview A server-side flow to securely redeem an offer code.
 *
 * This flow handles the entire logic for redeeming an offer code, including
 * validation, checking for previous use, and atomically updating the user's
 * balance and the offer's usage count in a single, secure transaction.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK.
// This will automatically use service account credentials if the file is present
// or use application default credentials in a deployed environment.
admin.initializeApp();

const db = admin.firestore();

export const RedeemOfferCodeInputSchema = z.object({
  code: z.string().describe('The offer code to redeem.'),
  userId: z.string().describe('The UID of the user redeeming the code.'),
});
export type RedeemOfferCodeInput = z.infer<typeof RedeemOfferCodeInputSchema>;

export const RedeemOfferCodeOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  rewardAmount: z.number().optional(),
});
export type RedeemOfferCodeOutput = z.infer<
  typeof RedeemOfferCodeOutputSchema
>;

export async function redeemOfferCode(
  input: RedeemOfferCodeInput
): Promise<RedeemOfferCodeOutput> {
  return redeemOfferCodeFlow(input);
}

export const redeemOfferCodeFlow = ai.defineFlow(
  {
    name: 'redeemOfferCodeFlow',
    inputSchema: RedeemOfferCodeInputSchema,
    outputSchema: RedeemOfferCodeOutputSchema,
  },
  async ({ userId, code }) => {
    if (!userId || !code) {
      throw new Error('User ID and offer code are required.');
    }

    let rewardAmount = 0;

    try {
      await db.runTransaction(async (transaction) => {
        const offerQuery = db
          .collection('offers')
          .where('code', '==', code.toUpperCase());
        const offerSnapshot = await transaction.get(offerQuery);

        if (offerSnapshot.empty) {
          throw new Error('Invalid offer code.');
        }

        const offerDoc = offerSnapshot.docs[0];
        const offerData = offerDoc.data();
        const offerRef = offerDoc.ref;
        rewardAmount = offerData.rewardAmount;

        const userRef = db.collection('users').doc(userId);
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists) {
          throw new Error('User document not found.');
        }

        const userData = userDoc.data()!;

        if (userData.redeemedOfferCodes?.includes(code.toUpperCase())) {
          throw new Error('You have already redeemed this offer code.');
        }

        if (
          offerData.expiresAt &&
          offerData.expiresAt.toMillis() < Date.now()
        ) {
          throw new Error('This offer code has expired.');
        }

        if (
          offerData.maxUsers &&
          offerData.usageCount >= offerData.maxUsers
        ) {
          throw new Error(
            'This offer code has reached its maximum usage limit.'
          );
        }

        // All checks passed, perform the updates
        transaction.update(userRef, {
          totalBalance: admin.firestore.FieldValue.increment(rewardAmount),
          totalBonusEarnings: admin.firestore.FieldValue.increment(rewardAmount),
          totalEarnings: admin.firestore.FieldValue.increment(rewardAmount),
          redeemedOfferCodes: admin.firestore.FieldValue.arrayUnion(
            code.toUpperCase()
          ),
        });

        transaction.update(offerRef, {
          usageCount: admin.firestore.FieldValue.increment(1),
        });

        const userTransactionRef = userRef.collection('transactions').doc();
        transaction.set(userTransactionRef, {
          type: 'bonus',
          amount: rewardAmount,
          description: `Redeemed offer code: ${code.toUpperCase()}`,
          status: 'Completed',
          date: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      return {
        success: true,
        message: `You have successfully received ${rewardAmount} Rs.`,
        rewardAmount,
      };
    } catch (error: any) {
      // Re-throw the error to be caught by the client-side caller
      throw new Error(error.message);
    }
  }
);
