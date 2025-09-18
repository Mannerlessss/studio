import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

let initialized = false;

// This function ensures that Firebase is initialized only once.
export function getFirebaseAdmin() {
  if (!initialized) {
    try {
      const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
      if (!fs.existsSync(serviceAccountPath)) {
        throw new Error('serviceAccountKey.json not found in the project root. Please download it from your Firebase project settings.');
      }
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      initialized = true;
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
      throw new Error('Failed to initialize Firebase Admin SDK. Check server logs and the serviceAccountKey.json file.');
    }
  }

  return {
    db: admin.firestore(),
    auth: admin.auth(),
    admin,
  };
}
