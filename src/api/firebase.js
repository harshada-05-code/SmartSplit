import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/**
 * Values come from Firebase Console → Project settings → Your apps (Web).
 * Create `.env` in the project root (copy from `.env.example`) and fill each variable.
 * Vite only exposes env vars prefixed with `VITE_`.
 */
// Fallback config (used when `.env` is not present).
// Firebase keys are not secrets for Firestore; still, you can override via `.env`.
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBaKSZp9o7FvwnlDizX5Ty2sfg7BMv-l_o",
  authDomain: "smartsplit-e4550.firebaseapp.com",
  projectId: "smartsplit-e4550",
  storageBucket: "smartsplit-e4550.firebasestorage.app",
  messagingSenderId: "760408283525",
  appId: "1:760408283525:web:8528f33eafbce661744cec",
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
};
function validateConfig() {
  const fields = [
    ["firebase apiKey", firebaseConfig.apiKey],
    ["firebase authDomain", firebaseConfig.authDomain],
    ["firebase projectId", firebaseConfig.projectId],
    ["firebase storageBucket", firebaseConfig.storageBucket],
    ["firebase messagingSenderId", firebaseConfig.messagingSenderId],
    ["firebase appId", firebaseConfig.appId],
  ];
  const missing = fields
    .filter(([, v]) => v == null || String(v).trim() === "")
    .map(([k]) => k);
  if (missing.length > 0) {
    throw new Error(
      `[SmartSplit] Firebase is not configured. Missing: ${missing.join(", ")}. ` +
        "Add `.env` (copy from `.env.example`) with your Firebase Web app values, then restart `npm run dev`."
    );
  }
}

validateConfig();

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
