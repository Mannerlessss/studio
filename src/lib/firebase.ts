
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  // TODO: Replace with your app's Firebase project configuration
  projectId: '',
  appId: '',
  storageBucket: '',
  apiKey: '',
  authDomain: '',
  measurementId: '',
  messagingSenderId: '',
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
