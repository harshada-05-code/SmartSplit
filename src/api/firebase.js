import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaKSZp9o7FvwnlDizX5Ty2sfg7BMv-l_o",
  authDomain: "smartsplit-e4550.firebaseapp.com",
  projectId: "smartsplit-e4550",
  storageBucket: "smartsplit-e4550.firebasestorage.app",
  messagingSenderId: "760408283525",
  appId: "1:760408283525:web:8528f33eafbce661744cec",
  measurementId: "G-SWT9NR8WL1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use throughout the app
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;