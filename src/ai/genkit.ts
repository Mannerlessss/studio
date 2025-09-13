/**
 * @fileOverview This file is the main entry point for Genkit configuration.
 *
 * It is used to initialize and configure the Genkit AI framework with various plugins.
 * The `ai` object exported from this file is a global singleton that should be used
 * for all Genkit-related operations, such as defining flows, prompts, and tools.
 */
import { genkit } from 'genkit';
import { firebase } from '@genkit-ai/firebase/v1';
import { googleAI } from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI and Firebase plugins.
// The `firebase()` plugin provides integration with Firebase services, which is
// essential for server-side operations like the referral code redemption flow.
// The `googleAI()` plugin configures Genkit to use Google's generative AI models.
export const ai = genkit({
  plugins: [
    googleAI(),
    firebase(),
  ],
});
