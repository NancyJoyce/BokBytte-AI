// utils/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: "bokbytte-6a8e2.firebaseapp.com",
    projectId: "bokbytte-6a8e2",
    storageBucket: "bokbytte-6a8e2.firebasestorage.app",
    messagingSenderId: "794985118046",
    appId: "1:794985118046:web:4158d5374802037817b7cf",
    measurementId: "G-8Z0Y52XT5Q"
  };
  

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const booksRef = collection(db, 'books');
