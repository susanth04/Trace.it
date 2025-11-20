import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA1U7TyZqehyKM4gvTjdalXTtqXbwPeNLk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "web3-a4fc5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "web3-a4fc5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "web3-a4fc5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "729670213536",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:729670213536:web:0f229afce330ad06554ec5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-EVNNYQK0MV",
};

console.log('🔥 Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
  projectId: firebaseConfig.projectId,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
