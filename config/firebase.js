// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // Import Firebase Storage

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADVv8sLbf8MfcNURnN9C1AZA7GOS3olXw",
  authDomain: "meetatu-49ebb.firebaseapp.com",
  projectId: "meetatu-49ebb",
  storageBucket: "meetatu-49ebb.appspot.com",
  messagingSenderId: "287724007839",
  appId: "1:287724007839:web:7a0bc3dc65ac338e748daa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db=getFirestore(app);
export const storage = getStorage(app);  // Export storage instance
export default app;