import * as admin from 'firebase-admin';
import serviceAccount from '../../serviceAccountKey.json';

// This function ensures that Firebase is initialized only once (singleton pattern).
function getFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
      // We re-throw the error to make it clear that initialization failed.
      throw new Error(`Failed to initialize Firebase Admin SDK. Check server logs for details. Error: ${error.message}`);
    }
  }
  return admin;
}

const adminInstance = getFirebaseAdmin();

/**
 * The initialized Firebase Admin Firestore instance.
 */
export const db = adminInstance.firestore();

/**
 * The initialized Firebase Admin Auth instance.
 */
export const auth = adminInstance.auth();

/**
 * The raw Firebase Admin SDK instance.
 * Use this for types or functionalities not covered by the `db` and `auth` exports.
 * @example
 * import { adminSDK } from '@/lib/firebaseAdmin';
 * const serverTimestamp = adminSDK.firestore.FieldValue.serverTimestamp();
 */
export const adminSDK = adminInstance;
