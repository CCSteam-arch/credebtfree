import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCCx3Q5EgITt_9lZBBxVjOp_BqAIwR4BXU",
  authDomain: "ccs-10-28.firebaseapp.com",
  projectId: "ccs-10-28",
  storageBucket: "ccs-10-28.firebasestorage.app",
  messagingSenderId: "162624755423",
  appId: "1:162624755423:web:fec9a957c1d27669197b6a",
  measurementId: "G-MBLX5EGTM0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };