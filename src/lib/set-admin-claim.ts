
'use server';
import 'dotenv/config';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { firebase } from '@genkit-ai/firebase';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

// Correctly read the service account key using fs
const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

genkit({
  plugins: [
    googleAI(),
    firebase(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export const setAdminClaimFlow = genkit.defineFlow(
  {
    name: 'setAdminClaimFlow',
    inputSchema: z.string(),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
  async (email) => {
    try {
      if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }

      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
      
      return {
        success: true,
        message: `Successfully set admin claim for ${email}.`,
      };
    } catch (error: any) {
      console.error('Error setting custom claim:', error);
      return {
        success: false,
        message: `Failed to set admin claim: ${error.message}`,
      };
    }
  }
);

// This is the main function that will be executed when the script is run.
async function setAdmin() {
  const adminEmail = 'gagansharma.gs107@gmail.com';
  console.log(`Attempting to set admin claim for: ${adminEmail}`);
  const result = await setAdminClaimFlow(adminEmail);
  console.log(result.message);
  // Exit the process so the script terminates.
  process.exit(0);
}

// Check if the script is being run directly.
if (require.main === module) {
  setAdmin();
}
