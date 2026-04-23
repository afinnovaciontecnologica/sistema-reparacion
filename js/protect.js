// =========================
// IMPORTS
// =========================
import { app } from "./firebase-config.js";

import { 
    getAuth, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { 
    getFirestore, 
    doc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =========================
// INIT
// =========================
const auth = getAuth(app);
const db = getFirestore(app);


// =========================
// PROTECCIÓN
// =========================
document.addEventListener("DOMContentLoaded", () => {

    onAuthStateChanged(auth, async (user) => {

        // ❌ NO LOGUEADO → LOGIN
        if (!user) {
            window.location.href = "./login.html";
            return;
        }

        try {
            // 🔎 OBTENER ROL
            const docRef = doc(db, "usuarios", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                alert("Sin rol asignado");
                window.location.href = "./login.html";
                return;
            }

            const rol = docSnap.data().rol;

            // 💾 GUARDAR
            localStorage.setItem("rol", rol);

            // =========================
            // 📍 RUTA ACTUAL
            // =========================
            const ruta = window.location.pathname;

            // =========================
            // 🔐 CONTROL POR ROL
            // =========================

            // ADMIN → solo dashboard
            if (rol === "admin") {

                // Si intenta entrar a pages → lo regreso
                if (ruta.includes("/pages/")) {
                    window.location.href = "./dashboard.html";
                    return;
                }

            }

            // EMPLEADO → no puede dashboard
            if (rol === "empleado") {

                if (ruta.includes("dashboard.html")) {
                    window.location.href = "./pages/ventas.html";
                    return;
                }

            }

            // ✅ TODO OK → NO REDIRIGE (AQUÍ SE EVITA EL BUCLE)

        } catch (error) {
            console.error("Error:", error);
            window.location.href = "./login.html";
        }

    });

});