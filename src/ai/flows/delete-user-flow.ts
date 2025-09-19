'use server';
/**
 * @fileOverview A server-side flow to securely delete a user from Firebase.
 *
 * This flow handles the deletion of a user from both Firebase Authentication
 * and their corresponding document in the Firestore database. This is a
 * privileged operation that requires the Firebase Admin SDK.
 */
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export async function deleteUser(uid: string): Promise<{ success: boolean; message: string; }> {
    if (!uid) {
        throw new Error('User UID is required.');
    }
    
    try {
        // Attempt to delete from Firebase Authentication first
        await adminAuth.deleteUser(uid);
    } catch (error: any) {
        console.error(`Auth deletion error for user ${uid}:`, error.message);
        // If user is not found in Auth, we still want to proceed to delete from Firestore.
        if (error.code !== 'auth/user-not-found') {
            throw new Error(`An error occurred while deleting the user from Authentication: ${error.message}`);
        }
        console.log(`User ${uid} not found in Authentication. Proceeding with Firestore cleanup.`);
    }

    try {
        // Always attempt to delete from Firestore database
        const userDocRef = adminDb.collection('users').doc(uid);
        const docSnap = await userDocRef.get();
        
        if (docSnap.exists) {
            // Note: This does not delete subcollections. A Cloud Function trigger
            // would be needed for a full recursive delete.
            await userDocRef.delete();
            return {
                success: true,
                message: `Successfully deleted user ${uid} from Authentication and Firestore.`,
            };
        } else {
             return {
                success: true,
                message: `User ${uid} was removed from Authentication. No Firestore document was found.`,
            };
        }
    } catch (error: any) {
         console.error(`Firestore deletion failed for user ${uid}:`, error);
         throw new Error(`Failed to delete user document from Firestore: ${error.message}`);
    }
}
