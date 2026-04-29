document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const error = document.getElementById("error");

    // Si ya hay sesión → redirigir
    const rolActual = localStorage.getItem("rol");
    if (rolActual && window.location.pathname.includes("index.html")) {
        window.location.href = "dashboard.html";
    }

    // LOGIN
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const user = document.getElementById("user").value.trim().toLowerCase();
            const pass = document.getElementById("pass").value.trim();

            error.textContent = "";

            const usuarios = [
                { email: "admin@gmail.com", pass: "123456", rol: "admin" },
                { email: "empleado@gmail.com", pass: "123456", rol: "empleado" }
            ];

            const usuarioValido = usuarios.find(u => 
                u.email === user && u.pass === pass
            );

            if (usuarioValido) {

                localStorage.setItem("rol", usuarioValido.rol);
                localStorage.setItem("user", usuarioValido.email);
                localStorage.setItem("nombre", usuarioValido.email.split("@")[0]);

                // ✅ CORREGIDO
                window.location.href = "dashboard.html";

            } else {
                error.textContent = "❌ Credenciales incorrectas";
            }
        });
    }

    // LOGOUT
    const btnLogout = document.getElementById("btnLogout");

    if (btnLogout) {
        btnLogout.addEventListener("click", () => {

            localStorage.removeItem("rol");
            localStorage.removeItem("user");
            localStorage.removeItem("nombre");

            window.location.href = "index.html";
        });
    }

});