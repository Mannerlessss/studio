import admin from 'firebase-admin';
import serviceAccount from '../../serviceAccountKey.json';

let adminDb: admin.firestore.Firestore;
let adminAuth: admin.auth.Auth;

if (admin.apps.length === 0) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error);
    throw new Error(`Failed to initialize Firebase Admin SDK. Check server logs. Error: ${error.message}`);
  }
}

adminDb = admin.firestore();
adminAuth = admin.auth();

export { adminDb, adminAuth };
