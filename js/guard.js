document.addEventListener("DOMContentLoaded", () => {

    const rol = localStorage.getItem("rol");

    // 🔴 SIN LOGIN → LOGIN
    if (!rol) {
        window.location.href = "/index.html";
        return;
    }

    // MENÚS
    const menus = {
        dashboard: document.getElementById("menu-dashboard"),
        clientes: document.getElementById("menu-clientes"),
        productos: document.getElementById("menu-productos"),
        ventas: document.getElementById("menu-ventas"),
        historial: document.getElementById("menu-historial"),
        reparaciones: document.getElementById("menu-reparaciones"),
        cotizacion: document.getElementById("menu-cotizacion"),
        logout: document.getElementById("btnLogout")
    };

    // 🔵 ADMIN VE TODO
    if (rol === "admin") {
        Object.values(menus).forEach(m => {
            if (m) m.style.display = "block";
        });
    }

    // 🟡 EMPLEADO (RESTRINGIDO)
    if (rol === "empleado") {

        // OCULTAR MENÚS PROHIBIDOS
        if (menus.dashboard) menus.dashboard.style.display = "none";
        if (menus.productos) menus.productos.style.display = "none";
        if (menus.historial) menus.historial.style.display = "none";
    }

});