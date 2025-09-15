import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// This function ensures that Firebase is initialized only once.
export function getFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return {
      db: admin.firestore(),
      auth: admin.auth(),
      admin,
    };
  }

  const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      'Failed to initialize Firebase Admin SDK. serviceAccountKey.json not found in the project root. Please download it from your Firebase project settings and place it in the root directory.'
    );
  }

  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    throw new Error(
      `Failed to initialize Firebase Admin SDK from serviceAccountKey.json: ${error.message}`
    );
  }

  return {
    db: admin.firestore(),
    auth: admin.auth(),
    admin,
  };
}
