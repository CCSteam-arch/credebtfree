import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const required = ["apiKey", "projectId", "appId"];
const missing = required.filter((k) => !firebaseConfig[k]);

let app = null;
let analytics = null;

if (missing.length) {
  // clear, non-fatal dev-time message
  // eslint-disable-next-line no-console
  console.error("Firebase config missing required keys:", missing);
} else {
  app = initializeApp(firebaseConfig);
  if (typeof window !== "undefined") {
    try {
      analytics = getAnalytics(app);
    } catch (err) {
      // analytics can fail in non-browser or restricted envs
      // eslint-disable-next-line no-console
      console.warn("Firebase analytics not initialized:", err.message ?? err);
    }
  }
}

export { app, analytics, firebaseConfig };