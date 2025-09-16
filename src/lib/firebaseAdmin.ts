import admin from 'firebase-admin';

let adminDb: admin.firestore.Firestore;
let adminAuth: admin.auth.Auth;

// This function ensures that Firebase is initialized only once.
function initializeFirebaseAdmin() {
  if (admin.apps.length === 0) {
    try {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
      console.error('Firebase Admin SDK initialization error:', error);
      // In a serverless environment, you might not want to throw an error,
      // but log it. Here, we re-throw to make it clear initialization failed.
      throw new Error(`Failed to initialize Firebase Admin SDK. Check server logs. Error: ${error.message}`);
    }
  }
}

// Call initialization
initializeFirebaseAdmin();

adminDb = admin.firestore();
adminAuth = admin.auth();

export { adminDb, adminAuth };
