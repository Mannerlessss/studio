
'use server';
/**
 * @fileOverview A server-side flow to securely delete a user from Firebase.
 *
 * This flow handles the deletion of a user from both Firebase Authentication
 * and their corresponding document in the Firestore database. This is a
 * privileged operation that requires the Firebase Admin SDK.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK.
// This will automatically use service account credentials if the file is present
// or use application default credentials in a deployed environment.
if (admin.apps.length === 0) {
    admin.initializeApp();
}


export const deleteUser = ai.defineFlow(
  {
    name: 'deleteUserFlow',
    inputSchema: z.string().describe('The UID of the user to delete.'),
    outputSchema: z.object({
        success: z.boolean(),
        message: z.string(),
    }),
  },
  async (uid) => {
    if (!uid) {
        throw new Error('User UID is required.');
    }
    
    // Ensure the SDK is initialized before proceeding.
    if (admin.apps.length === 0) {
        throw new Error('Firebase Admin SDK is not initialized. Cannot delete user.');
    }
    
    try {
        // Delete from Firebase Authentication
        await admin.auth().deleteUser(uid);

        // Delete from Firestore database
        const userDocRef = admin.firestore().collection('users').doc(uid);
        
        // Check if the document exists before trying to delete
        const docSnap = await userDocRef.get();
        if (docSnap.exists) {
            await userDocRef.delete();
        }
        
        // Note: This doesn't delete subcollections like `investments`, `transactions`, etc.
        // For a full cleanup, a more complex script would be needed to recursively delete
        // subcollection documents, but for typical use cases, this is sufficient.

        return {
            success: true,
            message: `Successfully deleted user ${uid} from Authentication and Firestore.`,
        };
    } catch (error: any) {
        console.error(`Failed to delete user ${uid}:`, error);
         // Provide a more user-friendly error message
        if (error.code === 'auth/user-not-found') {
            // If user not in auth, still try to delete from firestore, then return success.
            try {
                const userDocRef = admin.firestore().collection('users').doc(uid);
                const docSnap = await userDocRef.get();
                if (docSnap.exists) {
                    await userDocRef.delete();
                }
                return {
                    success: true,
                    message: `User ${uid} was already deleted from Authentication. Removed from Firestore.`,
                };
            } catch (dbError: any) {
                 throw new Error(`User not found in Auth, but failed to delete from Firestore: ${dbError.message}`);
            }
        }
        throw new Error(`An error occurred while deleting the user: ${error.message}`);
    }
  }
);
