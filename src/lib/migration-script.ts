
'use server';
import 'dotenv/config';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { getFirebaseAdmin } from './firebaseAdmin';

// --- CONFIGURATION ---
// 1. Place your exported `users.json` file in the root of your project.
// 2. Set a temporary password for all migrated users. They should be prompted to change this.
const TEMP_PASSWORD = 'password123';
// ---------------------

interface OldUser {
    name: string;
    email: string;
    phone: string;
    // Add other fields from your JSON structure
    current_balance: number;
    investments: { amount: number; start_date: string; earnings_so_far: number}[];
    joined_date: string;
    referred_by_email?: string;
}

async function migrateUsers() {
  console.log('--- Starting User Migration ---');

  try {
    const { db, auth } = getFirebaseAdmin();
    
    // Load the JSON file
    const jsonPath = path.resolve(process.cwd(), 'users.json');
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ Error: users.json not found in the project root.');
      console.log('Please place your exported user data in a file named users.json in the root directory.');
      process.exit(1);
    }
    const usersToMigrate: OldUser[] = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Found ${usersToMigrate.length} users to migrate.`);
    
    // Create a map of email to future UID for referral linking
    const emailToUidMap = new Map<string, string>();

    for (const oldUser of usersToMigrate) {
      console.log(`\nProcessing user: ${oldUser.email}`);
      
      // 1. Create user in Firebase Auth
      let userRecord;
      try {
        userRecord = await auth.createUser({
          email: oldUser.email,
          emailVerified: true,
          password: TEMP_PASSWORD,
          displayName: oldUser.name,
          disabled: false,
        });
        console.log(`  Auth user created. UID: ${userRecord.uid}`);
        emailToUidMap.set(oldUser.email, userRecord.uid);
      } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
          console.log(`  Auth user with email ${oldUser.email} already exists. Fetching...`);
          userRecord = await auth.getUserByEmail(oldUser.email);
          emailToUidMap.set(oldUser.email, userRecord.uid);
        } else {
          throw error; // Rethrow other errors
        }
      }
      
      // 2. Prepare Firestore Document
      const userDocRef = db.collection('users').doc(userRecord.uid);
      const referralCode = `${oldUser.name.split(' ')[0].toUpperCase().substring(0, 5)}${(Math.random() * 9000 + 1000).toFixed(0)}`;
      
      const newUserDocData: any = {
        uid: userRecord.uid,
        name: oldUser.name,
        email: oldUser.email,
        phone: oldUser.phone,
        membership: 'Basic', // Default to Basic, can be updated later
        totalBalance: oldUser.current_balance,
        totalInvested: oldUser.investments.reduce((sum, inv) => sum + inv.amount, 0),
        totalInvestmentEarnings: oldUser.investments.reduce((sum, inv) => sum + inv.earnings_so_far, 0),
        totalReferralEarnings: 0,
        totalBonusEarnings: 0,
        totalEarnings: oldUser.investments.reduce((sum, inv) => sum + inv.earnings_so_far, 0),
        hasInvested: oldUser.investments.length > 0,
        hasCollectedSignupBonus: true,
        investedReferralCount: 0,
        referralCode: referralCode,
        createdAt: admin.firestore.Timestamp.fromDate(new Date(oldUser.joined_date)),
        lastLogin: admin.firestore.Timestamp.now(),
        claimedMilestones: [],
        redeemedOfferCodes: [],
      };

      // 3. Set Firestore document within a batch
      const batch = db.batch();
      batch.set(userDocRef, newUserDocData);

      // 4. Prepare investment subcollection
      for (const investment of oldUser.investments) {
        const investmentRef = userDocRef.collection('investments').doc();
        batch.set(investmentRef, {
          planAmount: investment.amount,
          dailyReturn: investment.amount * 0.10, // Assuming 10% for Basic
          startDate: admin.firestore.Timestamp.fromDate(new Date(investment.start_date)),
          lastUpdate: admin.firestore.Timestamp.now(),
          durationDays: 30,
          earnings: investment.earnings_so_far,
          status: 'active'
        });
      }
      
      await batch.commit();
      console.log(`  Firestore data and investments created for ${oldUser.email}.`);
    }

    // Second pass: Link referrals
    console.log("\n--- Linking Referrals ---");
    for (const oldUser of usersToMigrate) {
        if (oldUser.referred_by_email) {
            const referrerUid = emailToUidMap.get(oldUser.referred_by_email);
            const userUid = emailToUidMap.get(oldUser.email);
            if (referrerUid && userUid) {
                console.log(`Linking ${oldUser.email} to referrer ${oldUser.referred_by_email}`);
                const userDocRef = db.collection('users').doc(userUid);
                await userDocRef.update({
                    referredBy: referrerUid,
                    commissionParent: referrerUid, // Assuming they have invested
                    usedReferralCode: (await db.collection('users').doc(referrerUid).get()).data()?.referralCode || 'MIGRATED'
                });
            }
        }
    }

    console.log('\n--- Migration Complete ---');
    console.log('All users have been migrated.');
    console.log(`IMPORTANT: Please advise your users to log in with their email and the temporary password: "${TEMP_PASSWORD}", and then use the "Forgot Password" feature to set a new one.`);

  } catch (error: any) {
    console.error('\n❌ An error occurred during migration:', error.message);
  } finally {
    process.exit(0);
  }
}

if (require.main === module) {
  migrateUsers();
}
