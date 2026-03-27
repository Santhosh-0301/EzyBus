import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "ezybus-78a0f.firebaseapp.com",
    projectId: "ezybus-78a0f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);