// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyCBxJR9gqByM5AkQe8wRg80Zj-UvtQizpg",
  authDomain: "studio-9200408584-12ba9.firebaseapp.com",
  projectId: "studio-9200408584-12ba9",
  storageBucket: "studio-9200408584-12ba9.firebasestorage.app",
  messagingSenderId: "352093090839",
  appId: "1:352093090839:web:16acc183dbdbe1c13dd852",
  measurementId: "G-RTTDQP7CTW"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Export Firebase services
export { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, doc, setDoc, getDoc, updateDoc, serverTimestamp };