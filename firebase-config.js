
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVLpHhqba5VLWG109Aahab2KK64F3HSlg",
  authDomain: "matanle-1ba57.firebaseapp.com",
  projectId: "matanle-1ba57",
  storageBucket: "matanle-1ba57.appspot.com",
  messagingSenderId: "664450977410",
  appId: "1:664450977410:web:7cb94be55f9eddae696e9b",
  measurementId: "G-4DBN6K8YPR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };