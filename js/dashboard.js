javascript
// ======================
// INIT
// ======================
document.addEventListener("DOMContentLoaded", () => {

    const rol = localStorage.getItem("rol")

    // ======================
    // 🔐 VALIDAR LOGIN
    // ======================
    if(!rol){
        window.location.href = "/login.html"
        return
    }

    // ======================
    // 📊 DATA
    // ======================
    let clientes = JSON.parse(localStorage.getItem("clientes")) || []
    let reparaciones = JSON.parse(localStorage.getItem("reparaciones")) || []
    let ventas = JSON.parse(localStorage.getItem("ventas")) || []
    let cotizaciones = JSON.parse(localStorage.getItem("cotizaciones")) || []

    window.ventasGlobal = ventas

    // ======================
    // 👤 BIENVENIDA
    // ======================
    const welcome = document.getElementById("welcomeText")

    if(rol === "admin"){
        welcome.textContent = "Bienvenido, Administrador 👋"
        document.body.classList.add("admin")
    }else{
        welcome.textContent = "Bienvenido, Empleado 👋"
    }

    // ======================
    // 🔥 LOGOUT
    // ======================
    const btnLogout = document.getElementById("btnLogout")

    if(btnLogout){
        btnLogout.addEventListener("click", (e)=>{
            e.preventDefault()
            localStorage.removeItem("rol")
            window.location.href = "/login.html"
        })
    }

    // ======================
    // 📊 CONTADORES
    // ======================
    if(document.getElementById("totalClientes"))
        document.getElementById("totalClientes").textContent = clientes.length

    if(document.getElementById("totalReparaciones"))
        document.getElementById("totalReparaciones").textContent = reparaciones.length

    if(document.getElementById("totalVentas"))
        document.getElementById("totalVentas").textContent = ventas.length

    if(document.getElementById("totalCotizaciones"))
        document.getElementById("totalCotizaciones").textContent = cotizaciones.length

    actualizarDashboard(ventas)

    // ======================
    // MENU ACTIVO
    // ======================
    document.querySelectorAll(".sidebar a").forEach(link=>{
        if(link.href.includes(window.location.pathname)){
            link.classList.add("active")
        }
    })

})


// ======================
// GRAFICOS
// ======================
let grafico1 = null
let grafico2 = null


// ======================
// FECHA SEGURA
// ======================
function parseFecha(fechaStr){

    if(!fechaStr) return null

    let fecha = new Date(fechaStr)

    if(isNaN(fecha)){
        try{
            let partes = fechaStr.split(",")
            let fechaPart = partes[0]

            let [dia, mes, anio] = fechaPart.split("/")

            fecha = new Date(`${anio}-${mes}-${dia}`)
        }catch(e){
            return null
        }
    }

    return fecha
}


// ======================
// DASHBOARD
// ======================
function actualizarDashboard(ventas){

    let mensaje = document.getElementById("mensajeVacio")

    if(!ventas || ventas.length === 0){

        if(mensaje) mensaje.style.display = "block"

        if(grafico1) grafico1.destroy()
        if(grafico2) grafico2.destroy()

        return
    } else {
        if(mensaje) mensaje.style.display = "none"
    }

    // INGRESOS
    let ingresos = ventas.reduce((acc, v) => acc + Number(v.total || 0), 0)

    let elIngresos = document.getElementById("ingresos")
    if(elIngresos){
        elIngresos.textContent = "S/. " + ingresos.toFixed(2)
    }

    // TOTAL VENTAS
    let elVentas = document.getElementById("totalVentas")
    if(elVentas){
        elVentas.textContent = ventas.length
    }

    // ======================
    // GRAFICO VENTAS
    // ======================
    let canvasVentas = document.getElementById("graficoVentas")

    if(canvasVentas && typeof Chart !== "undefined"){

        if(grafico1) grafico1.destroy()

        let ventasPorDia = {}

        ventas.forEach(v => {
            let fechaObj = parseFecha(v.fecha)
            if(!fechaObj) return

            let fecha = fechaObj.toLocaleDateString()

            ventasPorDia[fecha] = (ventasPorDia[fecha] || 0) + Number(v.total || 0)
        })

        grafico1 = new Chart(canvasVentas, {
            type: 'line',
            data: {
                labels: Object.keys(ventasPorDia),
                datasets: [{
                    label: 'Ventas por día',
                    data: Object.values(ventasPorDia),
                    borderWidth: 2,
                    tension: 0.3
                }]
            }
        })
    }

    // ======================
    // TOP PRODUCTOS
    // ======================
    let canvasProductos = document.getElementById("topProductos")

    if(canvasProductos && typeof Chart !== "undefined"){

        if(grafico2) grafico2.destroy()

        let productos = {}

        ventas.forEach(v => {
            (v.items || []).forEach(p => {
                productos[p.nombre] = (productos[p.nombre] || 0) + p.cantidad
            })
        })

        grafico2 = new Chart(canvasProductos, {
            type: 'bar',
            data: {
                labels: Object.keys(productos),
                datasets: [{
                    label: 'Cantidad vendida',
                    data: Object.values(productos)
                }]
            }
        })
    }
}


// ======================
// FILTRO
// ======================
function filtrar(tipo){

    let hoy = new Date()

    let filtradas = window.ventasGlobal.filter(v => {

        let fechaVenta = parseFecha(v.fecha)
        if(!fechaVenta) return false

        if(tipo === "hoy"){
            return fechaVenta.toDateString() === hoy.toDateString()
        }

        if(tipo === "mes"){
            return fechaVenta.getMonth() === hoy.getMonth() &&
                   fechaVenta.getFullYear() === hoy.getFullYear()
        }

        return true
    })

    actualizarDashboard(filtradas)
}



