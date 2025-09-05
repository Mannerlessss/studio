// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
