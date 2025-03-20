import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD4yMnbkof85Ah2JW7XHdfnUI-P4T9KeIg",
  authDomain: "tutors4u-b279c.firebaseapp.com",
  projectId: "tutors4u-b279c",
  storageBucket: "tutors4u-b279c.firebasestorage.app",
  messagingSenderId: "576329766680",
  appId: "1:576329766680:web:170a9ff787fc2714b7306d",
  measurementId: "G-K3VQBMEW2J",
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app); 

export {app, db };