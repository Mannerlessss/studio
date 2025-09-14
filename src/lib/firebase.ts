// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

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

// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

// Use a function to ensure Firestore is initialized only once
let dbInstance: Firestore | null = null;
const getDb = (): Firestore => {
    if (!dbInstance) {
        dbInstance = getFirestore(app);
    }
    return dbInstance;
}

const db: Firestore = getDb();

export { app, auth, db };
