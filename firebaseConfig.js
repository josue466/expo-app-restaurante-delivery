// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCM0ThCbys5z_MRVk0aNpf_mCnYMAsevWw",
  authDomain: "app-expo-7e27d.firebaseapp.com",
  projectId: "app-expo-7e27d",
  storageBucket: "app-expo-7e27d.firebasestorage.app",
  messagingSenderId: "695837937347",
  appId: "1:695837937347:web:911d901a4be413edc4dc76",
  measurementId: "G-H24Y7E54PP",
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://app-expo-7e27d-default-rtdb.firebaseio.com",
};

// Esto evita que se inicialice dos veces
const app = getApps().length === 0 
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const auth = getAuth(app);

export { auth };

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
export { database };
