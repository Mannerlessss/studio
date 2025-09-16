'use server';
import admin from 'firebase-admin';

// This interface is not exhaustive, but covers the essentials for initialization.
interface ServiceAccount {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

let adminDb: admin.firestore.Firestore;
let adminAuth: admin.auth.Auth;

/**
 * Initializes the Firebase Admin SDK if not already initialized.
 * This is a server-only module.
 */
function initializeAdmin() {
  if (admin.apps.length > 0) {
    return;
  }

  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
      throw new Error('Firebase Admin SDK: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
    }

    const serviceAccount: ServiceAccount = JSON.parse(serviceAccountKey);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error);
    // Re-throw to make it clear that initialization failed.
    throw new Error(`Failed to initialize Firebase Admin SDK. Check server logs. Error: ${error.message}`);
  }
}

// Initialize the SDK.
initializeAdmin();

// Export the initialized services.
adminDb = admin.firestore();
adminAuth = admin.auth();

export { adminDb, adminAuth };
