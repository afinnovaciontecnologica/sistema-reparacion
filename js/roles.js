document.addEventListener("DOMContentLoaded", () => {

    const rol = localStorage.getItem("rol");

    // =========================
    // 🔒 SI NO HAY SESIÓN
    // =========================
    if (!rol) {
        window.location.href = "./login.html";
        return;
    }

    // =========================
    // 🔥 PERMISOS REALES
    // =========================
    const permisos = {
        admin: [
            "dashboard.html",
            "clientes.html",
            "reparaciones.html",
            "ventas.html",
            "cotizaciones.html",
            "historial.html",
            "productos.html"
        ],
        empleado: [
            "clientes.html",
            "reparaciones.html",
            "ventas.html",
            "cotizaciones.html"
        ]
    };

    // seguridad extra
    if (!permisos[rol]) {
        localStorage.removeItem("rol");
        window.location.href = "./login.html";
        return;
    }

    // =========================
    // 📍 RUTA ACTUAL
    // =========================
    const rutaActual = window.location.pathname.split("/").pop();

    const permitido = permisos[rol].includes(rutaActual);

    // =========================
    // 🔒 BLOQUEO REAL
    // =========================
    if (!permitido) {

        if (rol === "admin") {
            window.location.href = "./dashboard.html";
        } else {
            window.location.href = "./ventas.html";
        }

        return;
    }

    // =========================
    // 👁 OCULTAR MENÚ
    // =========================
    const links = document.querySelectorAll(".sidebar a");

    links.forEach(link => {

        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        const pagina = href.split("/").pop();

        const visible = permisos[rol].includes(pagina);

        if (!visible) {
            link.style.display = "none";
        }
    });

});

