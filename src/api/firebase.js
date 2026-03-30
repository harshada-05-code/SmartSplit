import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/**
 * Values come from Firebase Console → Project settings → Your apps (Web).
 * Create `.env` in the project root (copy from `.env.example`) and fill each variable.
 * Vite only exposes env vars prefixed with `VITE_`.
 */
const firebaseConfig = {
  apiKey: "AIzaSyBaKSZp9o7FvwnlDizX5Ty2sfg7BMv-l_o",
  authDomain: "smartsplit-e4550.firebaseapp.com",
  projectId: "smartsplit-e4550",
  storageBucket: "smartsplit-e4550.firebasestorage.app",
  messagingSenderId: "760408283525",
  appId: "1:760408283525:web:8528f33eafbce661744cec",
  measurementId: "G-SWT9NR8WL1"
};
function validateConfig() {
  const entries = [
    ["VITE_FIREBASE_API_KEY", firebaseConfig.apiKey],
    ["VITE_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
    ["VITE_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
    ["VITE_FIREBASE_STORAGE_BUCKET", firebaseConfig.storageBucket],
    ["VITE_FIREBASE_MESSAGING_SENDER_ID", firebaseConfig.messagingSenderId],
    ["VITE_FIREBASE_APP_ID", firebaseConfig.appId],
  ];
  const missing = entries
    .filter(([, v]) => v == null || String(v).trim() === "")
    .map(([k]) => k);
  if (missing.length > 0) {
    throw new Error(
      `[SmartSplit] Firebase is not configured. Missing: ${missing.join(", ")}. ` +
        "Copy `.env.example` to `.env`, paste values from Firebase Console, then restart `npm run dev`."
    );
  }
}

validateConfig();

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
