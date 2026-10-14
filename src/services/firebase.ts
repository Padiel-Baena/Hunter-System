import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBL_81X-NLsPqHzDu7gU7CCEEEkPABI6A4",
  authDomain: "hunter-system-b6f51.firebaseapp.com",
  projectId: "hunter-system-b6f51",
  storageBucket: "hunter-system-b6f51.firebasestorage.app",
  messagingSenderId: "529858590500",
  appId: "1:529858590500:web:0ea752a20683d6fc3065b1",
};

// 1. Primero inicializamos Firebase
const app = initializeApp(firebaseConfig);

// 2. Después obtenemos las instancias de Auth y Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// 3. Forzamos la persistencia local permanente para que no pida la contraseña siempre
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error al configurar la persistencia de sesión:", error);
});
