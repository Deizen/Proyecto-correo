// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions } from 'firebase/functions'
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyASn78hbIXM9R86p8BWt_GDD9BW_2ueJSk",
    authDomain: "correos-dc3de.firebaseapp.com",
    projectId: "correos-dc3de",
    storageBucket: "correos-dc3de.appspot.com",
    messagingSenderId: "195673864023",
    appId: "1:195673864023:web:24bc72fb32e6984aecf012"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app);

export default app;
export {db, collection, getDocs, setDoc, doc, functions};
