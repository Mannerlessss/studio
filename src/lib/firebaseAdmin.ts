import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// This function ensures that Firebase is initialized only once.
export function getFirebaseAdmin() {
  if (admin.apps.length === 0) {
    const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');

    if (fs.existsSync(serviceAccountPath)) {
      try {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } catch (error: any) {
        console.error('Firebase admin initialization error from file:', error.stack);
        throw new Error('Failed to initialize Firebase Admin SDK from serviceAccountKey.json. Check file integrity and permissions.');
      }
    } else {
        // This block will run in a deployed environment (like Google Cloud Run)
        // where the credentials should be automatically available.
         try {
            console.log("serviceAccountKey.json not found. Attempting to initialize with default credentials...");
            admin.initializeApp();
        } catch (error: any) {
             console.error('Default Firebase admin initialization error:', error.stack);
             throw new Error('Failed to initialize Firebase Admin SDK. Ensure serviceAccountKey.json is in the root directory for local development, or that the environment is configured with the correct service account credentials for deployment.');
        }
    }
  }

  return {
    db: admin.firestore(),
    auth: admin.auth(),
    admin,
  };
}
