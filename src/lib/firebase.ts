
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLhmKP9BeoHGn_zz8UaVURix83lPfWSds",
  authDomain: "upi-boost-vault-f64fw.firebaseapp.com",
  projectId: "upi-boost-vault-f64fw",
  storageBucket: "upi-boost-vault-f64fw.appspot.com",
  messagingSenderId: "1017948596718",
  appId: "1:1017948596718:web:b25de6f4ed5d179b5046ff",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Enable Firestore persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      console.warn('Firestore persistence failed: multiple tabs open.');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      console.warn('Firestore persistence not available in this browser.');
    }
  });


export { app, auth, db };
