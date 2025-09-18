import * as admin from 'firebase-admin';

// This function ensures that Firebase is initialized only once.
export function getFirebaseAdmin() {
  if (admin.apps.length === 0) {
    try {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY!
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
      throw new Error('Failed to initialize Firebase Admin SDK. Check that FIREBASE_SERVICE_ACCOUNT_KEY environment variable is set correctly.');
    }
  }

  return {
    db: admin.firestore(),
    auth: admin.auth(),
    admin,
  };
}
