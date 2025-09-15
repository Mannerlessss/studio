import * as admin from 'firebase-admin';

// This function ensures that Firebase is initialized only once.
export function getFirebaseAdmin() {
  if (admin.apps.length === 0) {
    try {
      // The SDK will automatically pick up credentials from the environment.
      // In a deployed environment (like Vercel, Firebase Hosting), this is handled by setting environment variables.
      // In a local environment, it will look for the GOOGLE_APPLICATION_CREDENTIALS
      // environment variable, which can be pointed to the serviceAccountKey.json file.
      // The .env file we created handles this for local development.
      admin.initializeApp();
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
