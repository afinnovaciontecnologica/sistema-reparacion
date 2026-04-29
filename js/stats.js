// DATOS SIMULADOS (luego puedes conectar Firebase)

const clientes = 25
const ventas = 40
const ingresos = 3200

// MOSTRAR
document.getElementById("clientesTotal").textContent = clientes
document.getElementById("ventasTotal").textContent = ventas
document.getElementById("ingresosTotal").textContent = "S/ " + ingresos

// GRAFICO
const ctx = document.getElementById("ventasChart")

new Chart(ctx, {
    type: "line",
    data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May"],
        datasets: [{
            label: "Ventas",
            data: [5, 10, 8, 15, 20],
            borderWidth: 2
        }]
    }
})