// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNDXjzw8hqMXblw0l_PcXIW8ytieMlzVc",
  authDomain: "definitely-not-a-scrapyard.firebaseapp.com",
  projectId: "definitely-not-a-scrapyard",
  storageBucket: "definitely-not-a-scrapyard.appspot.com",
  messagingSenderId: "157858643520",
  appId: "1:157858643520:web:640a6926cb5b6fffac29a5",
  measurementId: "G-E51E3HNJEV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const fs = getFirestore(app);
const storage = getStorage(app);

export { auth, fs, storage, app }; // export the services to use in other files
