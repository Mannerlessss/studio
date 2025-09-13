
'use server';
import 'dotenv/config';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// This script should be run from the root of the project

async function clearTestUsers() {
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

    console.log('--- Starting User Cleanup ---');
    console.log(`Admin account to preserve: ${adminEmail}`);

    const firestore = admin.firestore();
    const auth = admin.auth();

    // 1. Get all users from Firestore
    console.log('\nFetching users from Firestore...');
    const firestoreUsersSnapshot = await firestore.collection('users').get();
    const firestoreUsers = firestoreUsersSnapshot.docs;
    console.log(`Found ${firestoreUsers.length} user documents in Firestore.`);

    let deletedFirestoreCount = 0;
    for (const userDoc of firestoreUsers) {
        const userData = userDoc.data();
        if (userData.email !== adminEmail) {
            console.log(`- Deleting Firestore doc for ${userData.email} (ID: ${userDoc.id})`);
            await userDoc.ref.delete();
            deletedFirestoreCount++;
        }
    }
    console.log(`✅ Deleted ${deletedFirestoreCount} Firestore user documents.`);

    // 2. Get all users from Firebase Auth
    console.log('\nFetching users from Firebase Authentication...');
    const listUsersResult = await auth.listUsers(1000); // Batches of 1000
    const authUsers = listUsersResult.users;
    console.log(`Found ${authUsers.length} users in Firebase Authentication.`);
    
    let deletedAuthCount = 0;
    for (const userRecord of authUsers) {
        if (userRecord.email !== adminEmail) {
            console.log(`- Deleting Auth account for ${userRecord.email} (UID: ${userRecord.uid})`);
            await auth.deleteUser(userRecord.uid);
            deletedAuthCount++;
        }
    }
    console.log(`✅ Deleted ${deletedAuthCount} Firebase Authentication accounts.`);

    console.log('\n--- Cleanup Complete ---');
    console.log('All test users have been removed from Firestore and Authentication.');


  } catch (error: any) {
    console.error('\n❌ An error occurred during cleanup:', error.message);
  } finally {
    process.exit(0);
  }
}

// This allows the script to be run directly from the command line
if (require.main === module) {
  clearTestUsers();
}
