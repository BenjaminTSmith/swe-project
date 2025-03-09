import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Load Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASEapiKey,
  authDomain: process.env.FIREBASEauthDomain,
  projectId: process.env.FIREBASEprojectId,
  storageBucket: process.env.FIREBASEstorageBucket,
  messagingSenderId: process.env.FIREBASEmessagingSenderID,
  appId: process.env.FIREBASEappId,
  measurementId: process.env.FIREBASEmeasurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { app, analytics };
