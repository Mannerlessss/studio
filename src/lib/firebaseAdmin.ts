'use server';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let adminDb: admin.firestore.Firestore;
let adminAuth: admin.auth.Auth;

function initializeFirebaseAdmin() {
  if (admin.apps.length === 0) {
    try {
      const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
      if (!fs.existsSync(serviceAccountPath)) {
        throw new Error("serviceAccountKey.json not found. Please add it to the root directory of your project.");
      }
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
      console.error('Firebase Admin SDK initialization error:', error);
      throw new Error(`Failed to initialize Firebase Admin SDK. Check server logs. Error: ${error.message}`);
    }
  }
}

initializeFirebaseAdmin();

adminDb = admin.firestore();
adminAuth = admin.auth();

export { adminDb, adminAuth };
