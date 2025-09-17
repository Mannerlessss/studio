'use server';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let adminDb: admin.firestore.Firestore;
let adminAuth: admin.auth.Auth;

// This function should only be called in a server environment.
function initializeFirebaseAdmin() {
  if (admin.apps.length === 0) {
    try {
      const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
      if (!fs.existsSync(serviceAccountPath)) {
        console.warn("serviceAccountKey.json not found. This is expected in client-side rendering. Server-side functions will fail if it's not present on the server.");
        return;
      }
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
      console.error('Firebase Admin SDK initialization error:', error);
      // Don't throw here, as it can break client-side builds. Log and let server functions fail.
    }
  }
}

initializeFirebaseAdmin();

adminDb = admin.firestore();
adminAuth = admin.auth();

export { adminDb, adminAuth };
