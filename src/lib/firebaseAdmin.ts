import * as admin from 'firebase-admin';

// This function ensures that Firebase is initialized only once.
export function getFirebaseAdmin() {
  if (admin.apps.length === 0) {
    try {
      // In a deployed environment (like Vercel/Netlify), we expect credentials
      // to be in an environment variable.
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
      } else {
        // In a local development environment (like Firebase Studio), we can
        // fall back to the GOOGLE_APPLICATION_CREDENTIALS environment variable
        // which points to the serviceAccountKey.json file.
         admin.initializeApp();
      }
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
      // We re-throw the error to make it clear that initialization failed.
      throw new Error('Failed to initialize Firebase Admin SDK. Check server logs for details.');
    }
  }

  return {
    db: admin.firestore(),
    auth: admin.auth(),
    admin,
  };
}
