
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

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

const auth = getAuth(app);
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});

if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code == 'unimplemented') {
      console.warn('The current browser does not support all of the features required to enable persistence.');
    }
  });
}


export { app, auth, db };
