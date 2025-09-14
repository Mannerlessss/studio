// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "upi-boost-vault-f64fw",
  "appId": "1:1017948596718:web:b25de6f4ed5d179b5046ff",
  "storageBucket": "upi-boost-vault-f64fw.firebasestorage.app",
  "apiKey": "AIzaSyDLhmKP9BeoHGn_zz8UaVURix83lPfWSds",
  "authDomain": "upi-boost-vault-f64fw.firebaseapp.com",
  "measurementId": "G-C3ZQDSL5FM",
  "messagingSenderId": "1017948596718"
};

// Singleton pattern to initialize Firebase app
const getAppInstance = (): FirebaseApp => {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
};

const app: FirebaseApp = getAppInstance();
const auth: Auth = getAuth(app);

// Singleton pattern to initialize Firestore instance
let dbInstance: Firestore | null = null;
const getDb = (): Firestore => {
    if (!dbInstance) {
        dbInstance = getFirestore(app);
        // The check for process.env.NODE_ENV is often not perfectly reliable in some frontend bundlers,
        // but it's a common practice. A more robust solution might use a specific env variable like `USE_EMULATOR`.
        if (process.env.NODE_ENV === 'development') {
            try {
                connectFirestoreEmulator(dbInstance, 'localhost', 8080);
                console.log("Firestore Emulator connected.");
            } catch (e) {
                // This can happen on hot reloads if the emulator is already connected.
                // It's generally safe to ignore this error in a development environment.
                console.warn("Could not connect to Firestore emulator. This is often normal on hot-reloads.", e);
            }
        }
    }
    return dbInstance;
}

const db: Firestore = getDb();

export { app, auth, db };
