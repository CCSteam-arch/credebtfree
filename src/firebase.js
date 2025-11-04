// src/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Import App Check specific functions and provider
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// *** IMPORTANT: These are YOUR project's actual credentials. Do NOT change them unless they become outdated. ***
const firebaseConfig = {
  apiKey: "AIzaSyCCx3Q5EgITt_9lZBBxVjOp_BqAIwR4BXU",
  authDomain: "ccs-10-28.firebaseapp.com",
  projectId: "ccs-10-28",
  storageBucket: "ccs-10-28.firebasestorage.app",
  messagingSenderId: "162624755423",
  appId: "1:162624755423:web:fec9a957c1d27669197b6a",
  measurementId: "G-MBLX5EGTM0"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// --- START APP CHECK INTEGRATION ---

// IMPORTANT: This MUST be your correct reCAPTCHA Enterprise Site Key.
// Based on your previous input, it should be '6Ld8JgEsAAAAAJfQBBNCdWxrObszFn9LCunW1zuL'.
const RECAPTCHA_ENTERPRISE_SITE_KEY = "6Ld8JgEsAAAAAJfQBBNCdWxrObszFn9LCunW1zuL"; // <--- Corrected this to match your provided ID

// For local development, enable the debug token.
// This is correctly set up to activate only in development environments.
// Ensure that `process.env.NODE_ENV` is appropriately configured by your build tool (e.g., Webpack, Vite).
if (process.env.NODE_ENV === 'development') {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  console.warn("App Check Debug Token Enabled: Ensure this is NOT active in production.");
}


// Initialize App Check with the reCAPTCHA Enterprise provider
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_ENTERPRISE_SITE_KEY),
  isTokenAutoRefreshEnabled: true // Automatically refresh App Check tokens for continuous protection
});

// --- END APP CHECK INTEGRATION ---


// Initialize Firebase services you need
const analytics = getAnalytics(app);     // For Google Analytics
const db = getFirestore(app);           // For Cloud Firestore
const functions = getFunctions(app);    // For Cloud Functions (used by your EmailForm)

// Export them for use in other parts of your app
export { app, analytics, db, functions, appCheck, firebaseConfig };
