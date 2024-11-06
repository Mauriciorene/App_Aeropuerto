import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBb0_SUoSTUAtnlvMFvZQVAoEbKJelLl60",
  authDomain: "aeropuerto-2024.firebaseapp.com",
  projectId: "aeropuerto-2024",
  storageBucket: "aeropuerto-2024.firebasestorage.app",
  messagingSenderId: "648720828044",
  appId: "1:648720828044:web:55c206bbeab30571621da9"
};

// Inicializar Firebase 
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializar Firestore
const db = getFirestore(app);

export { db };
