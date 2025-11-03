"use client";

import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQs2eDpl2H4-uPxW6bVoTHybzzCDuE5Xs",
    authDomain: "technical-test-fe-789e1.firebaseapp.com",
    projectId: "technical-test-fe-789e1",
    storageBucket: "technical-test-fe-789e1.firebasestorage.app",
    messagingSenderId: "220698955045",
    appId: "1:220698955045:web:e4b6c3645967738bb21ecc"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);