import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyj41vU44mYCbo-b2C8fpZ0mLT98Yb2LU",
  authDomain: "catatanhutang-app.firebaseapp.com",
  databaseURL: "https://catatanhutang-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "catatanhutang-app",
  storageBucket: "catatanhutang-app.firebasestorage.app",
  messagingSenderId: "730420684855",
  appId: "1:730420684855:web:ad7086726cd46fe43477b2",
  measurementId: "G-DGC7GBSSLW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
export { auth, provider };
export { db };
export default app;
