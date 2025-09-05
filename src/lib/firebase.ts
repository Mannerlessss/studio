// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi9cWXekgmJSlmj4rrEB0TYiRXdmGfeOo",
  authDomain: "gagan-backend.firebaseapp.com",
  projectId: "gagan-backend",
  storageBucket: "gagan-backend.firebasestorage.app",
  messagingSenderId: "759910620254",
  appId: "1:759910620254:web:c0344b4c737be830a4e8cf",
  measurementId: "G-ZV6RTKWNLN"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
