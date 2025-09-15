import * as admin from 'firebase-admin';

// This function ensures that Firebase is initialized only once.
export function getFirebaseAdmin() {
  if (admin.apps.length === 0) {
    try {
      // The SDK will automatically pick up credentials from the environment.
      // In a deployed environment, this is handled automatically.
      // In a local environment, it will look for the GOOGLE_APPLICATION_CREDENTIALS
      // environment variable.
      admin.initializeApp();
    } catch (error: any) {
      console.error('Firebase admin initialization error', error);
      // We re-throw a clearer error to make it obvious that initialization failed.
      throw new Error('Failed to initialize Firebase Admin SDK. Ensure GOOGLE_APPLICATION_CREDENTIALS is set for local development or that the production environment has the correct service account credentials.');
    }
  }

  return {
    db: admin.firestore(),
    auth: admin.auth(),
    admin,
  };
}
