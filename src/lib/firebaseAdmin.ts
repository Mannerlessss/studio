import * as admin from 'firebase-admin';

// This function ensures that Firebase is initialized only once.
export function getFirebaseAdmin() {
  if (admin.apps.length === 0) {
    try {
      // The SDK will automatically pick up credentials from the environment.
      // For local development, it looks for the GOOGLE_APPLICATION_CREDENTIALS
      // environment variable pointing to serviceAccountKey.json.
      // In a deployed environment, this is handled automatically.
      admin.initializeApp();
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
      // We re-throw the error to make it clear that initialization failed.
      throw new Error('Failed to initialize Firebase Admin SDK. Ensure GOOGLE_APPLICATION_CREDENTIALS is set for local development or that the production environment has the correct service account credentials.');
    }
  }

  return {
    db: admin.firestore(),
    auth: admin.auth(),
    admin,
  };
}
