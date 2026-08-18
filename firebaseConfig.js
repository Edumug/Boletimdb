// firebaseConfig.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLRht5H506Lnpp83ihWE3aU1eP_5s9ZMY",
  authDomain: "abnerproject-2b773.firebaseapp.com",
  projectId: "abnerproject-2b773",
  storageBucket: "abnerproject-2b773.firebasestorage.app",
  messagingSenderId: "695519700756",
  appId: "1:695519700756:web:d46d62410aa2f861984401",
  measurementId: "G-CTHVFS1XM1"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);

// Inicialização do Firestore
const database = getFirestore(app);

// Exporta o Firestore
export { database };