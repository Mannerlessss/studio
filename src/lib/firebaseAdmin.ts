'use server';
import * as admin from 'firebase-admin';
import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

let app: admin.app.App;

const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
let serviceAccount;
if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
} else {
    console.warn("serviceAccountKey.json not found. Admin SDK will not be initialized.");
}

if (!getApps().length && serviceAccount) {
    app = initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
} else {
    app = getApp();
}

export async function getAdminDb() {
    if (!app) throw new Error("Admin SDK not initialized");
    return getFirestore(app);
}

export async function getAdminAuth() {
    if (!app) throw new Error("Admin SDK not initialized");
    return getAuth(app);
}
