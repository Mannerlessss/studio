
'use server';
/**
 * @fileOverview A server-side flow to securely delete a user from Firebase.
 *
 * This flow handles the deletion of a user from both Firebase Authentication
 * and their corresponding document in the Firestore database. This is a
 * privileged operation that requires the Firebase Admin SDK.
 */
import { z } from 'zod';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export async function deleteUser(uid: string): Promise<{ success: boolean; message: string; }> {
    const { auth, db } = getFirebaseAdmin();
    
    if (!uid) {
        throw new Error('User UID is required.');
    }
    
    try {
        // Delete from Firebase Authentication
        await auth.deleteUser(uid);

        // Delete from Firestore database
        const userDocRef = db.collection('users').doc(uid);
        
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
                const userDocRef = db.collection('users').doc(uid);
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
