import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD3Ekoj25xRpsXkUkTH-m2Nfw6ozELGqcI",
  authDomain: "sistema-reparacion.firebaseapp.com",
  projectId: "sistema-reparacion",
  storageBucket: "sistema-reparacion.firebasestorage.app",
  messagingSenderId: "1055219511276",
  appId: "1:1055219511276:web:b1537a0aaa003bff089ac9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);