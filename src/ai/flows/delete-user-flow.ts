'use server';
/**
 * @fileOverview A server-side flow to securely delete a user from Firebase.
 *
 * This flow handles the deletion of a user from both Firebase Authentication
 * and their corresponding document in the Firestore database. This is a
 * privileged operation that requires the Firebase Admin SDK.
 */
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export async function deleteUser(uid: string): Promise<{ success: boolean; message: string; }> {
    if (!uid) {
        throw new Error('User UID is required.');
    }
    
    try {
        const { auth: adminAuth, db: adminDb } = getFirebaseAdmin();

        await adminAuth.deleteUser(uid);

        const userDocRef = adminDb.collection('users').doc(uid);
        
        const docSnap = await userDocRef.get();
        if (docSnap.exists) {
            await userDocRef.delete();
        }
        
        return {
            success: true,
            message: `Successfully deleted user ${uid} from Authentication and Firestore.`,
        };
    } catch (error: any) {
        console.error(`Failed to delete user ${uid}:`, error);
        if (error.code === 'auth/user-not-found') {
            try {
                const { db: adminDb } = getFirebaseAdmin();
                const userDocRef = adminDb.collection('users').doc(uid);
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
