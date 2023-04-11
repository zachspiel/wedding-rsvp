import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAR4MP31HFiMfrKg0CS4GZlVdSxony21C4",
  authDomain: "spielberger-wedding.firebaseapp.com",
  databaseURL: "https://spielberger-wedding-default-rtdb.firebaseio.com",
  projectId: "spielberger-wedding",
  storageBucket: "spielberger-wedding.appspot.com",
  messagingSenderId: "340233884916",
  appId: "1:340233884916:web:ea915f50e3636bf387baa1",
  measurementId: "G-CDGR4SLNX2",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const analytics = getAnalytics(firebaseApp);
export const database = getDatabase(firebaseApp);
export const storage = getStorage(firebaseApp);
