
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// This is a singleton pattern to ensure Firebase Admin is initialized only once.
if (!admin.apps.length) {
  try {
    const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    
    if (!fs.existsSync(serviceAccountPath)) {
        throw new Error("serviceAccountKey.json not found at project root. Please ensure the file exists.");
    }
    
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error);
    // We re-throw the error to make it clear that initialization failed.
    throw new Error(`Failed to initialize Firebase Admin SDK. Check server logs for details. Error: ${error.message}`);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export { admin };
