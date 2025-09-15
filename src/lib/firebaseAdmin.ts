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
      throw new Error('Failed to initialize Firebase Admin SDK. Check server logs for details.');
    }
  }
  return admin;
}

const adminInstance = getFirebaseAdmin();
export const db = adminInstance.firestore();
export const auth = adminInstance.auth();
export const adminSDK = adminInstance;
