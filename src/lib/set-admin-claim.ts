
'use server';
import 'dotenv/config';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// This script should be run from the root of the project

async function setAdminClaim() {
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!adminEmail) {
    console.error('❌ Error: ADMIN_EMAIL not found in your .env file.');
    console.log('Please create a .env file in the root of your project and add ADMIN_EMAIL=your-admin-email@example.com');
    process.exit(1);
  }

  try {
    const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    if (!fs.existsSync(serviceAccountPath)) {
        console.error('❌ Error: serviceAccountKey.json not found in the root of your project.');
        console.log('Please download it from your Firebase project settings and place it in the root directory.');
        process.exit(1);
    }
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    console.log(`⏳ Looking up user by email: ${adminEmail}...`);
    const user = await admin.auth().getUserByEmail(adminEmail);
    
    if (user.customClaims && (user.customClaims as any).admin === true) {
        console.log(`✅ User ${adminEmail} (UID: ${user.uid}) is already an admin.`);
        return;
    }

    console.log(`Found user. UID: ${user.uid}. Setting admin claim...`);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    console.log(`✅ Success! Admin claim has been set for ${adminEmail}.`);
    console.log('It may take a few minutes to propagate. Please log out and log back in to see the changes.');

  } catch (error: any) {
    console.error('❌ Error setting custom admin claim:', error.message);
    if (error.code === 'auth/user-not-found') {
        console.error(`No user found with the email: ${adminEmail}. Please make sure the user exists in Firebase Authentication.`);
    }
  } finally {
    process.exit(0);
  }
}

// This allows the script to be run directly from the command line
if (require.main === module) {
  setAdminClaim();
}
