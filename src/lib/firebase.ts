
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

export { app, auth, db };
