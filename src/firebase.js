// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBSI9krZEmFLX-oKdvYfGn64JBuxV4vAAA",
    authDomain: "academia-86b98.firebaseapp.com",
    projectId: "academia-86b98",
    storageBucket: "academia-86b98.appspot.com",
    messagingSenderId: "588581516660",
    appId: "1:588581516660:web:3bed7a8b94144b2162a821",
    measurementId: "G-HNBFXPLYM5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { db, auth };
