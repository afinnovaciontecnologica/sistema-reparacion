// =========================
// IMPORT FIREBASE APP
// =========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// =========================
// CONFIG (PON AQUÍ TUS DATOS REALES)
// =========================
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_ID",
  appId: "TU_APP_ID"
};

// =========================
// INIT
// =========================
export const app = initializeApp(firebaseConfig);