
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // The SDK will automatically pick up credentials from the environment.
      // In a local environment, it will look for the GOOGLE_APPLICATION_CREDENTIALS
      // environment variable pointing to the serviceAccountKey.json file.
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth, admin };
