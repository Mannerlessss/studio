
'use server';
/**
 * @fileOverview A flow for creating a new user in Firebase from the admin panel.
 *
 * - createUser - A function to handle user creation.
 * - CreateUserInput - The input type for the createUser function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin SDK at the top level
if (admin.apps.length === 0) {
  try {
    const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin SDK initialized successfully using serviceAccountKey.json.");
    } else {
        // This case is for environments where service account is set via env vars (e.g., Google Cloud)
        admin.initializeApp();
        console.log("Firebase Admin SDK initialized using default credentials (e.g., environment variables).");
    }
  } catch(error) {
    console.error("Failed to initialize Firebase Admin SDK at the top level:", error);
    // In a server environment, you might want to re-throw or handle this more gracefully
    // For now, we'll let the flow fail with a clear message.
  }
}


// Define Zod schemas for input validation
const CreateUserInputSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  referralCode: z.string().optional(),
});
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

const CreateUserOutputSchema = z.object({
  uid: z.string(),
  email: z.string(),
  message: z.string(),
});
export type CreateUserOutput = z.infer<typeof CreateUserOutputSchema>;


// Define the main exported function that calls the flow
export async function createUser(input: CreateUserInput): Promise<CreateUserOutput> {
  return createUserFlow(input);
}

// Define the Genkit flow
const createUserFlow = ai.defineFlow(
  {
    name: 'createUserFlow',
    inputSchema: CreateUserInputSchema,
    outputSchema: CreateUserOutputSchema,
  },
  async (input) => {
    // A robust check to ensure Firebase Admin is initialized before proceeding.
    if (admin.apps.length === 0) {
      console.error("FATAL: Firebase Admin SDK is not initialized. The flow cannot continue.");
      throw new Error("The Firebase Admin SDK failed to initialize. Check server logs for details. This is an unrecoverable error.");
    }

    const { name, email, phone, password, referralCode: providedCode } = input;
    const auth = admin.auth();
    const firestore = admin.firestore();

    // Step 1: Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      phoneNumber: phone,
    });

    // Step 2: Create user document in Firestore
    const referralCode = `${name.split(' ')[0].toUpperCase().substring(0, 5)}${(Math.random() * 9000 + 1000).toFixed(0)}`;
    const userDocRef = firestore.collection('users').doc(userRecord.uid);
    
    const newUserDocData: any = {
      uid: userRecord.uid,
      name,
      email,
      phone,
      membership: 'Basic',
      rank: 'Bronze',
      totalBalance: 0,
      totalInvested: 0,
      totalEarnings: 0,
      totalReferralEarnings: 0,
      totalBonusEarnings: 0,
      totalInvestmentEarnings: 0,
      hasInvested: false,
      hasCollectedSignupBonus: false,
      investedReferralCount: 0,
      referralCode: referralCode,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      claimedMilestones: [],
      redeemedOfferCodes: [],
    };
    
    if (providedCode) {
        const q = firestore.collection('users').where('referralCode', '==', providedCode.toUpperCase());
        const querySnapshot = await q.get();
        if (!querySnapshot.empty) {
            const referrerDoc = querySnapshot.docs[0];
            newUserDocData.usedReferralCode = providedCode.toUpperCase();
            newUserDocData.referredBy = referrerDoc.id;
        }
    }
    
    await userDocRef.set(newUserDocData);

     // Step 3: If referral code was used, add to referrer's subcollection
    if (newUserDocData.referredBy) {
        const referrerId = newUserDocData.referredBy;
         if (referrerId !== userRecord.uid) {
            const referrerSubCollectionRef = firestore.collection(`users/${referrerId}/referrals`);
            await referrerSubCollectionRef.add({
                userId: userRecord.uid,
                name: name,
                email: email,
                hasInvested: false,
                joinedAt: admin.firestore.Timestamp.now(),
            });
        }
    }


    return {
      uid: userRecord.uid,
      email: userRecord.email!,
      message: `Successfully created user ${name} with UID ${userRecord.uid}.`,
    };
  }
);
