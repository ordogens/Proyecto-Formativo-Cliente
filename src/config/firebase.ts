import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyAyG7SgZ26_PEB0PLjIYEq-o5e1OHdGJ5E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "craftyourstyle-dc394.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "craftyourstyle-dc394",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "craftyourstyle-dc394.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "402895179257",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:402895179257:web:68d82fdc519bfc212fc128",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "G-RJR0H22HRG",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
