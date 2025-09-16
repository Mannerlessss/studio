'use server';
import 'dotenv/config';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// --- Configuration ---
// The path to your service account key JSON file
const SERVICE_ACCOUNT_PATH = path.resolve(process.cwd(), 'serviceAccountKey.json');
// The path to your data file
const DATA_TO_IMPORT_PATH = path.resolve(process.cwd(), 'import-data.json');


// --- Helper Function to Initialize Firebase Admin ---
function initializeFirebaseAdmin() {
    if (admin.apps.length > 0) {
        return;
    }
    try {
        if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
            console.error(`❌ Error: Service account key not found at ${SERVICE_ACCOUNT_PATH}`);
            console.log('Please download it from your Firebase project settings and place it in the root directory.');
            process.exit(1);
        }
        const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('✅ Firebase Admin SDK initialized.');
    } catch (error: any) {
        console.error('❌ Firebase Admin SDK initialization error:', error.message);
        process.exit(1);
    }
}

// --- Main Import Function ---
async function importData() {
    console.log('--- Starting Data Import ---');
    
    initializeFirebaseAdmin();
    const db = admin.firestore();
    const auth = admin.auth();

    // 1. Read the data file
    if (!fs.existsSync(DATA_TO_IMPORT_PATH)) {
        console.error(`❌ Error: Data file not found at ${DATA_TO_IMPORT_PATH}`);
        console.log('Please make sure the `import-data.json` file exists in your project root.');
        process.exit(1);
    }
    const dataToImport = JSON.parse(fs.readFileSync(DATA_TO_import_PATH, 'utf8'));
    console.log(`Found ${dataToImport.length} records to import.`);

    let successCount = 0;
    let failureCount = 0;

    // 2. Loop through each record and import
    for (const record of dataToImport) {
        try {
            console.log(`\nProcessing user: ${record.email}`);
            
            // A. Create Firebase Auth user
            const userRecord = await auth.createUser({
                email: record.email,
                password: record.password, // Ensure your JSON has a secure, temporary password
                displayName: record.name,
                emailVerified: true,
            });
            const uid = userRecord.uid;
            console.log(`- Auth account created with UID: ${uid}`);

            // B. Create Firestore user document
            const userDocRef = db.collection('users').doc(uid);
            await userDocRef.set({
                uid: uid,
                name: record.name,
                email: record.email,
                phone: record.phone || '',
                membership: 'Basic',
                referralCode: `${record.name.split(' ')[0].toUpperCase().substring(0, 5)}${(Math.random() * 9000 + 1000).toFixed(0)}`,
                totalBalance: record.totalBalance || 0,
                totalInvested: record.totalInvested || 0,
                totalEarnings: record.totalEarnings || 0,
                totalReferralEarnings: record.totalReferralEarnings || 0,
                totalBonusEarnings: record.totalBonusEarnings || 0,
                totalInvestmentEarnings: record.totalInvestmentEarnings || 0,
                hasInvested: (record.totalInvested || 0) > 0,
                hasCollectedSignupBonus: true, // Assume previous users don't get a new bonus
                investedReferralCount: 0, // This would require more complex logic to link referrals
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                lastLogin: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log(`- Firestore document created for ${record.email}.`);
            
            successCount++;
        } catch (error: any) {
            console.error(`- ❌ Failed to import user ${record.email}:`, error.message);
            failureCount++;
        }
    }

    // 3. Final Report
    console.log('\n--- Import Complete ---');
    console.log(`✅ Successfully imported: ${successCount} users.`);
    console.log(`❌ Failed to import: ${failureCount} users.`);
}


// This allows the script to be run directly from the command line
if (require.main === module) {
  importData().finally(() => process.exit(0));
}
