'use server';
/**
 * @fileOverview Server-side flows for managing offer codes.
 */
import { z } from 'zod';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

const CreateOfferInputSchema = z.object({
    code: z.string().min(1),
    rewardAmount: z.number().positive(),
    maxUsers: z.number().positive().optional(),
    expiresAt: z.string().optional(),
});
export type CreateOfferInput = z.infer<typeof CreateOfferInputSchema>;

const OfferOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    id: z.string().optional(),
});

const OfferSchema = z.object({
  id: z.string(),
  code: z.string(),
  rewardAmount: z.number(),
  maxUsers: z.number().nullish(),
  expiresAt: z.any().nullish(),
  usageCount: z.number(),
  createdAt: z.any(),
});
export type Offer = z.infer<typeof OfferSchema>;

const GetAllOffersOutputSchema = z.array(OfferSchema);


const getAllOffersFlow = ai.defineFlow({
    name: 'getAllOffersFlow',
    inputSchema: z.void(),
    outputSchema: GetAllOffersOutputSchema,
}, async () => {
    const adminDb = await getAdminDb();
    const offersSnapshot = await adminDb.collection('offers').get();
    const offersData: Offer[] = offersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            code: data.code,
            rewardAmount: data.rewardAmount,
            maxUsers: data.maxUsers || null,
            expiresAt: (data.expiresAt as Timestamp)?.toDate().toISOString() || null,
            usageCount: data.usageCount,
            createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || null,
        };
    });
    return offersData;
});

const createOfferFlow = ai.defineFlow({
    name: 'createOfferFlow',
    inputSchema: CreateOfferInputSchema,
    outputSchema: OfferOutputSchema,
}, async (input) => {
    const adminDb = await getAdminDb();
    const newOfferData: any = {
        code: input.code.toUpperCase(),
        rewardAmount: input.rewardAmount,
        usageCount: 0,
        createdAt: FieldValue.serverTimestamp(),
    };

    if (input.maxUsers) newOfferData.maxUsers = input.maxUsers;
    if (input.expiresAt) newOfferData.expiresAt = Timestamp.fromDate(new Date(input.expiresAt));

    const docRef = await adminDb.collection('offers').add(newOfferData);
    
    return {
        success: true,
        message: `Offer code "${input.code.toUpperCase()}" created successfully.`,
        id: docRef.id,
    };
});

const deleteOfferFlow = ai.defineFlow({
    name: 'deleteOfferFlow',
    inputSchema: z.string(),
    outputSchema: OfferOutputSchema,
}, async (offerId) => {
    if (!offerId) throw new Error('Offer ID is required.');
    const adminDb = await getAdminDb();
    await adminDb.collection('offers').doc(offerId).delete();
    return { success: true, message: 'Offer code deleted successfully.' };
});

export async function getAllOffers(): Promise<Offer[]> {
    return getAllOffersFlow();
}

export async function createOffer(input: CreateOfferInput): Promise<{success: boolean, message: string, id?: string}> {
    return createOfferFlow(input);
}

export async function deleteOffer(offerId: string): Promise<{success: boolean, message: string}> {
    return deleteOfferFlow(offerId);
}
