import { initializeApp } from "firebase/app";

import {
  getFirestore
} from "firebase/firestore";

import {
  getAuth
} from "firebase/auth";

const firebaseConfig = {

  apiKey:
    "AIzaSyB2ySrCzJjAj2r1qo9NecUf0QVdrMtQUnQ",

  authDomain:
    "inventory-manager-1e1b0.firebaseapp.com",

  projectId:
    "inventory-manager-1e1b0",

  storageBucket:
    "inventory-manager-1e1b0.appspot.com",

  messagingSenderId:
    "547078876836",

  appId:
    "1:547078876836:web:292c7d09e8856cb9f04031",
};

const app =
  initializeApp(
    firebaseConfig
  );

const db =
  getFirestore(app);

const auth =
  getAuth(app);

export {
  db,
  auth
};