'use server';
/**
 * @fileOverview Server-side flows for managing offer codes.
 *
 * This includes creating, deleting, and fetching offer codes using the Admin SDK
 * to ensure proper permissions.
 */
import { z } from 'zod';
import { db, adminSDK } from '@/lib/firebaseAdmin';
import { ai } from '@/ai/genkit';
import { collection, addDoc, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';

// Schema for creating an offer
const CreateOfferInputSchema = z.object({
    code: z.string().min(1),
    rewardAmount: z.number().positive(),
    maxUsers: z.number().positive().optional(),
    expiresAt: z.string().optional(), // ISO date string
});
export type CreateOfferInput = z.infer<typeof CreateOfferInputSchema>;

// Schema for the output of offer operations
const OfferOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    id: z.string().optional(),
});

// Schema for a single offer object when fetched
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


// Flow to get all offers
export const getAllOffersFlow = ai.defineFlow({
    name: 'getAllOffersFlow',
    inputSchema: z.void(),
    outputSchema: GetAllOffersOutputSchema,
}, async () => {
    const offersSnapshot = await getDocs(collection(db, 'offers'));
    const offersData: Offer[] = offersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            expiresAt: (data.expiresAt as Timestamp)?.toDate().toISOString() || null,
            createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || null,
        } as Offer;
    });
    return offersData;
});

// Flow to create a new offer
export const createOfferFlow = ai.defineFlow({
    name: 'createOfferFlow',
    inputSchema: CreateOfferInputSchema,
    outputSchema: OfferOutputSchema,
}, async (input) => {

    const newOfferData: any = {
        code: input.code.toUpperCase(),
        rewardAmount: input.rewardAmount,
        usageCount: 0,
        createdAt: adminSDK.firestore.FieldValue.serverTimestamp(),
    };

    if (input.maxUsers) {
        newOfferData.maxUsers = input.maxUsers;
    }
    if (input.expiresAt) {
        newOfferData.expiresAt = Timestamp.fromDate(new Date(input.expiresAt));
    }

    const docRef = await addDoc(collection(db, 'offers'), newOfferData);
    
    return {
        success: true,
        message: `Offer code "${input.code.toUpperCase()}" created successfully.`,
        id: docRef.id,
    };
});

// Flow to delete an offer
export const deleteOfferFlow = ai.defineFlow({
    name: 'deleteOfferFlow',
    inputSchema: z.string(), // Expects offer ID
    outputSchema: OfferOutputSchema,
}, async (offerId) => {
    if (!offerId) {
        throw new Error('Offer ID is required.');
    }
    await deleteDoc(doc(db, 'offers', offerId));
    return {
        success: true,
        message: 'Offer code deleted successfully.',
    };
});


// Exported wrapper functions
export async function getAllOffers(): Promise<Offer[]> {
    return getAllOffersFlow();
}

export async function createOffer(input: CreateOfferInput): Promise<{success: boolean, message: string, id?: string}> {
    return createOfferFlow(input);
}

export async function deleteOffer(offerId: string): Promise<{success: boolean, message: string}> {
    return deleteOfferFlow(offerId);
}
