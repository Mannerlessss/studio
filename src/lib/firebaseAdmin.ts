import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// This function ensures that Firebase is initialized only once.
export function getFirebaseAdmin() {
  if (admin.apps.length === 0) {
    try {
      const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
      
      if (!fs.existsSync(serviceAccountPath)) {
        // This log is for server-side debugging. It will appear in your terminal.
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.error('!!! serviceAccountKey.json not found.                          !!!');
        console.error('!!! Please download it from your Firebase project settings and !!!');
        console.error('!!! place it in the root directory of your project.            !!!');
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        throw new Error('serviceAccountKey.json not found. This is required for server-side operations.');
      }
      
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
      // Re-throw with a more generic message for the client, but keep logs for server.
      throw new Error('Failed to initialize Firebase Admin SDK. Check server logs for details.');
    }
  }

  return {
    db: admin.firestore(),
    auth: admin.auth(),
    admin,
  };
}
