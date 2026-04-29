document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       🔐 CONTROL DE SESIÓN Y ROLES
    ===================================================== */
    const rol = localStorage.getItem("rol")

    const adminMenu = document.getElementById("adminMenu")
    const rolTexto = document.getElementById("rolTexto")
    const userRolMini = document.getElementById("userRolMini")

    const rolesValidos = ["admin", "empleado"]

    if(!rol || !rolesValidos.includes(rol)){
        cerrarSesion()
        return
    }

    const configRoles = {
        admin: {
            nombre: "Administrador",
            mostrarAdmin: true
        },
        empleado: {
            nombre: "Empleado",
            mostrarAdmin: false
        }
    }

    const config = configRoles[rol]

    if(rolTexto) rolTexto.textContent = "Rol: " + config.nombre
    if(userRolMini) userRolMini.textContent = config.nombre
    if(adminMenu) adminMenu.style.display = config.mostrarAdmin ? "block" : "none"


    /* =====================================================
       📦 FUNCION SEGURA PARA DATOS
    ===================================================== */
    function obtenerDatos(clave){
        try {
            const data = JSON.parse(localStorage.getItem(clave))
            return Array.isArray(data) ? data : []
        } catch {
            return []
        }
    }


    /* =====================================================
       📊 OBTENER DATOS
    ===================================================== */
    const clientes = obtenerDatos("clientes")
    const ventas = obtenerDatos("ventas")
    const reparaciones = obtenerDatos("reparaciones")


    /* =====================================================
       📈 ANIMACIÓN CONTADORES (UX PRO)
    ===================================================== */
    function animarNumero(id, valorFinal, prefijo = ""){

        const el = document.getElementById(id)
        if(!el) return

        let inicio = 0
        const duracion = 800
        const incremento = valorFinal / (duracion / 16)

        const intervalo = setInterval(() => {
            inicio += incremento

            if(inicio >= valorFinal){
                el.textContent = prefijo + valorFinal
                clearInterval(intervalo)
            } else {
                el.textContent = prefijo + Math.floor(inicio)
            }
        }, 16)
    }

    animarNumero("clientesTotal", clientes.length)
    animarNumero("ventasTotal", ventas.length)
    animarNumero("reparacionesTotal", reparaciones.length)


    /* =====================================================
       💰 INGRESOS FORMATEADOS
    ===================================================== */
    const ingresos = ventas.reduce((acc, v) => acc + Number(v.total || 0), 0)

    const moneda = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    })

    const ingresosEl = document.getElementById("ingresosTotal")
    if(ingresosEl){
        ingresosEl.textContent = moneda.format(ingresos)
    }


    /* =====================================================
       📊 GRAFICO MODERNO
    ===================================================== */
    const canvas = document.getElementById("ventasChart")

    if(canvas){

        const ctx = canvas.getContext("2d")

        const dias = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"]
        const ventasPorDia = [0,0,0,0,0,0,0]

        ventas.forEach(v => {

            if(v.fecha){
                const fecha = new Date(v.fecha)

                if(!isNaN(fecha)){
                    let dia = fecha.getDay()
                    dia = dia === 0 ? 6 : dia - 1
                    ventasPorDia[dia]++
                }
            }

        })

        if(window.miGrafico){
            window.miGrafico.destroy()
        }

        window.miGrafico = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dias,
                datasets: [{
                    label: 'Ventas',
                    data: ventasPorDia,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.2)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#e2e8f0'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        beginAtZero: true
                    }
                }
            }
        })
    }


    /* =====================================================
       ✨ EFECTO ACTIVO EN MENÚ
    ===================================================== */
    const links = document.querySelectorAll(".menu a")

    links.forEach(link => {
        if(link.href === window.location.href){
            link.classList.add("active")
        }
    })


})


/* =====================================================
   🚪 LOGOUT SEGURO
===================================================== */
function cerrarSesion(){
    localStorage.removeItem("rol")
    window.location.href = "index.html"
}

function logout(){
    cerrarSesion()
}