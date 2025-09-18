'use server';
/**
 * @fileOverview A server-side flow to securely upgrade a user to the Pro membership.
 */
import { z } from 'zod';
import { adminDb } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';

const UpgradeUserToProInputSchema = z.object({
  userId: z.string().describe('The UID of the user to upgrade.'),
});

const UpgradeUserToProOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

const upgradeUserToProFlow = ai.defineFlow({
    name: 'upgradeUserToProFlow',
    inputSchema: UpgradeUserToProInputSchema,
    outputSchema: UpgradeUserToProOutputSchema,
}, async ({ userId }) => {
    if (!userId) {
        throw new Error('User ID is required.');
    }
    try {
        const userDocRef = adminDb.collection('users').doc(userId);
        
        await userDocRef.update({ membership: 'Pro' });

        return {
            success: true,
            message: 'User has been successfully upgraded to Pro.',
        };
    } catch (error: any) {
        console.error(`Failed to upgrade user ${userId} to Pro:`, error);
        throw new Error(error.message || 'An unknown server error occurred during the upgrade.');
    }
});


export async function upgradeUserToPro(userId: string): Promise<{success: boolean, message: string}> {
    return upgradeUserToProFlow({ userId });
}
