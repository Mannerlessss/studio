
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'upi-boost-vault-f64fw',
  appId: '1:1017948596718:web:b25de6f4ed5d179b5046ff',
  storageBucket: 'upi-boost-vault-f64fw.firebasestorage.app',
  apiKey: 'AIzaSyDLhmKP9BeoHGn_zz8UaVURix83lPfWSds',
  authDomain: 'upi-boost-vault-f64fw.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '1017948596718',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Explicitly initialize auth for the web environment to avoid issues in some contexts
const auth = typeof window !== 'undefined' 
  ? initializeAuth(app, {
      persistence: indexedDBLocalPersistence
    }) 
  : getAuth(app);

const db = getFirestore(app);

export { app, auth, db };
