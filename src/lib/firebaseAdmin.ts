import * as admin from 'firebase-admin';

let initialized = false;

// This function ensures that Firebase is initialized only once.
export function getFirebaseAdmin() {
  if (!initialized) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
      if (!serviceAccount.project_id) {
          throw new Error('Firebase service account key not found or invalid in environment variables.');
      }
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      initialized = true;
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
      throw new Error('Failed to initialize Firebase Admin SDK. Check server logs and environment variables.');
    }
  }

  return {
    db: admin.firestore(),
    auth: admin.auth(),
    admin,
  };
}
