
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChbUvopG486E6SwyCcX6ABI_IHKcYY0qc",
  authDomain: "psychologists-app-d4d41.firebaseapp.com",
  databaseURL: "https://psychologists-app-d4d41-default-rtdb.firebaseio.com",
  projectId: "psychologists-app-d4d41",
  storageBucket: "psychologists-app-d4d41.firebasestorage.app",
  messagingSenderId: "506764795311",
  appId: "1:506764795311:web:b8b31218884d0d0fdaa35a",
  measurementId: "G-SRCM1E7GPQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };