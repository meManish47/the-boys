import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "the-boys-61f4a.firebaseapp.com",
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: "the-boys-61f4a",
  storageBucket: "the-boys-61f4a.firebasestorage.app",
  messagingSenderId: "922618802702",
  appId: "1:922618802702:web:4de8e1772bbed46ab4425f"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);