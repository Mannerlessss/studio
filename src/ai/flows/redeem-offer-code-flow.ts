'use server';
/**
 * @fileOverview A server-side flow to securely redeem an offer code.
 */
import { z } from 'zod';
import { adminDb } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

const RedeemOfferCodeInputSchema = z.object({
    userId: z.string().describe('The UID of the user redeeming the code.'),
    code: z.string().describe('The offer code being redeemed.'),
});
export type RedeemOfferCodeInput = z.infer<typeof RedeemOfferCodeInputSchema>;

const RedeemOfferCodeOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

const redeemOfferCodeFlow = ai.defineFlow({
    name: 'redeemOfferCodeFlow',
    inputSchema: RedeemOfferCodeInputSchema,
    outputSchema: RedeemOfferCodeOutputSchema,
}, async ({ userId, code }) => {
    const userRef = adminDb.collection('users').doc(userId);
    const offersRef = adminDb.collection('offers');

    try {
        const result = await adminDb.runTransaction(async (transaction) => {
            // 1. Get the offer document
            const offerQuery = offersRef.where('code', '==', code.toUpperCase()).limit(1);
            const offerSnapshot = await transaction.get(offerQuery);
            
            if (offerSnapshot.empty) {
                throw new Error('Invalid offer code.');
            }
            const offerDoc = offerSnapshot.docs[0];
            const offerData = offerDoc.data();
            
            // 2. Validate the offer
            if (offerData.expiresAt && (offerData.expiresAt as Timestamp).toMillis() < Date.now()) {
                throw new Error('This offer code has expired.');
            }
            if (offerData.maxUsers && offerData.usageCount >= offerData.maxUsers) {
                throw new Error('This offer code has reached its maximum usage limit.');
            }

            // 3. Get the user document and check if they've already redeemed this code
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                throw new Error('User does not exist.');
            }
            const userData = userDoc.data();
            if (userData?.redeemedOfferCodes?.includes(offerDoc.id)) {
                throw new Error('You have already redeemed this offer code.');
            }

            // 4. All checks passed, perform the updates
            // Update user's balance and add offer ID to their redeemed list
            transaction.update(userRef, {
                totalBalance: FieldValue.increment(offerData.rewardAmount),
                totalBonusEarnings: FieldValue.increment(offerData.rewardAmount),
                totalEarnings: FieldValue.increment(offerData.rewardAmount),
                redeemedOfferCodes: FieldValue.arrayUnion(offerDoc.id),
            });

            // Increment usage count for the offer
            transaction.update(offerDoc.ref, {
                usageCount: FieldValue.increment(1),
            });
            
            // Create a transaction record for the user
            const userTransactionRef = userRef.collection('transactions').doc();
            transaction.set(userTransactionRef, {
                type: 'bonus',
                amount: offerData.rewardAmount,
                description: `Redeemed offer code: ${offerData.code}`,
                status: 'Completed',
                date: FieldValue.serverTimestamp(),
            });

            return { rewardAmount: offerData.rewardAmount };
        });

        return {
            success: true,
            message: `Successfully redeemed code! ${result.rewardAmount} Rs. has been added to your balance.`,
        };

    } catch (error: any) {
        console.error('Redeem offer code transaction failed: ', error);
        throw new Error(error.message || 'An unknown error occurred during redemption.');
    }
});

export async function redeemOfferCode(input: RedeemOfferCodeInput): Promise<RedeemOfferCodeOutput> {
    return redeemOfferCodeFlow(input);
}
