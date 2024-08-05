// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAC6l5JxPdq86H0Mp9uQV4SkUQ6JQ7-dUQ",
  authDomain: "inventory-management-8647a.firebaseapp.com",
  projectId: "inventory-management-8647a",
  storageBucket: "inventory-management-8647a.appspot.com",
  messagingSenderId: "372736404391",
  appId: "1:372736404391:web:d8c365d3b5a605e5cbe482",
  measurementId: "G-WE2SRHQM09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}