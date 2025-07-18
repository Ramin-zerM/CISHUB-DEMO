import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmYFDqKms8mJ9ENmV_Q8bgrn_GI_K1sWw",
  authDomain: "cishub-4b3ee.firebaseapp.com",
  projectId: "cishub-4b3ee",
  storageBucket: "cishub-4b3ee.firebasestorage.app",
  messagingSenderId: "192653384934",
  appId: "1:192653384934:web:da794bf3d81ba9bee22f27",
  measurementId: "G-MKX97L8TF1"
};

const app = initializeApp(firebaseConfig);

let analytics;

if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
const auth = getAuth(app);
const db = getFirestore(app);
export { app, analytics, auth, db };
