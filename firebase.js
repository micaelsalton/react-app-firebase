// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC6qzYPjWvtb1obsWntvIBhO44n65uDRWg",
  authDomain: "react-notes-fire.firebaseapp.com",
  projectId: "react-notes-fire",
  storageBucket: "react-notes-fire.appspot.com",
  messagingSenderId: "62640694035",
  appId: "1:62640694035:web:ff00b4cf3adf672a1b70e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "react-notes-fire")