
import * as admin from 'firebase-admin';
// You must download this file from your Firebase project settings.
import serviceAccount from '../../serviceAccountKey.json';

// The email of the user you want to make an admin.
const ADMIN_EMAIL = 'gagansharma.gs107@gmail.com';

// Initialize the Firebase Admin SDK.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setAdminClaim() {
  try {
    const user = await admin.auth().getUserByEmail(ADMIN_EMAIL);
    if (user.customClaims && (user.customClaims as any).admin === true) {
      console.log(`User ${ADMIN_EMAIL} is already an admin.`);
      return;
    }

    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`Successfully set admin claim for ${ADMIN_EMAIL}`);
    
  } catch (error: any) {
    console.error(`Error setting admin claim: ${error.message}`);
  }
}

setAdminClaim().then(() => process.exit());
