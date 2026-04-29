/* =========================
   🚀 INICIO
========================= */
document.addEventListener("DOMContentLoaded", () => {

    const tabla = document.getElementById("tablaHistorial")
    const inputBuscar = document.getElementById("buscarVenta")
    const vacio = document.getElementById("sinDatos")

    // 👉 Datos (si no hay en localStorage usa demo)
    let ventas = JSON.parse(localStorage.getItem("ventas")) || [
        {
            numero:"B001-0000005",
            cliente:"ANDY",
            fecha:"28/04/2026",
            telefono:"988174760",
            correo:"soportehpn@gmail.com",
            total:1000,
            items:[
                {nombre:"GAMER",cantidad:1,precio:1000}
            ]
        }
    ]

    /* =========================
       🧾 RENDER TABLA
    ========================= */
    function render(lista = ventas){

        tabla.innerHTML = ""

        if(lista.length === 0){
            vacio.style.display = "block"
            return
        }

        vacio.style.display = "none"

        lista.forEach((v,i)=>{

            tabla.innerHTML += `
                <tr>
                    <td>${v.numero}</td>
                    <td>${v.cliente}</td>
                    <td>${v.fecha}</td>
                    <td>S/ ${Number(v.total).toFixed(2)}</td>
                    <td>
                        <button onclick="verBoleta(${i})">🧾</button>
                        <button onclick="eliminarVenta(${i})">🗑</button>
                    </td>
                </tr>
            `
        })
    }

    render()

    /* =========================
       🔍 BUSCAR
    ========================= */
    inputBuscar.addEventListener("input", e => {

        const texto = e.target.value.toLowerCase()

        const filtrado = ventas.filter(v =>
            (v.cliente || "").toLowerCase().includes(texto) ||
            (v.numero || "").includes(texto)
        )

        render(filtrado)
    })

})

/* =========================
   🧾 VER BOLETA
========================= */
function verBoleta(i){

    let ventas = JSON.parse(localStorage.getItem("ventas")) || []
    let v = ventas[i]

    if(!v){
        alert("Venta no encontrada")
        return
    }

    let productos = ""

    v.items.forEach(p => {

        let cantidad = Number(p.cantidad)
        let precio = Number(p.precio)
        let sub = cantidad * precio

        productos += `
            <tr>
                <td>${(p.nombre || '').substring(0,15)}</td>
                <td>${cantidad}</td>
                <td>${precio.toFixed(2)}</td>
                <td>${sub.toFixed(2)}</td>
            </tr>
        `
    })

    document.getElementById("boletaVista").innerHTML = `
    <div class="ticket">

        

        <h3>INNOVACION TECNOLOGICA</h3>
        <p>RUC: 10416270258</p>
        <p>Huaraz - Ancash</p>
        <p>Cel: ${v.telefono || '-'}</p>

        <hr>

        <p><b>BOLETA:</b> ${v.numero}</p>
        <p><b>Fecha:</b> ${v.fecha}</p>
        <p><b>Cliente:</b> ${v.cliente}</p>
        <p><b>Teléfono:</b> ${v.telefono || '-'}</p>
        <p><b>Correo:</b> ${v.correo || '-'}</p>

        <hr>

        <table>
            <tr>
                <th>DESC</th>
                <th>CANT</th>
                <th>P.U</th>
                <th>SUB</th>
            </tr>
            ${productos}
        </table>

        <hr>

        <p style="text-align:right">SUBTOTAL: S/ ${Number(v.total).toFixed(2)}</p>

        <div class="total-box">
            TOTAL: S/ ${Number(v.total).toFixed(2)}
        </div>

        <hr>

        <p>PAGO: PLIN</p>
        <p>¡GRACIAS POR SU COMPRA!</p>

    </div>
    `

    document.getElementById("modalBoleta").style.display = "flex"
}

/* =========================
   ❌ CERRAR
========================= */
function cerrarBoleta(){
    document.getElementById("modalBoleta").style.display = "none"
}

/* =========================
   🗑 ELIMINAR
========================= */
function eliminarVenta(i){

    let ventas = JSON.parse(localStorage.getItem("ventas")) || []

    if(!confirm("¿Eliminar esta venta?")) return

    ventas.splice(i,1)

    localStorage.setItem("ventas", JSON.stringify(ventas))

    location.reload()
}

/* =========================
   🗑 BORRAR TODO
========================= */
function borrarTodoHistorial(){

    if(confirm("¿Seguro que deseas borrar TODO el historial?")){
        localStorage.removeItem("ventas")
        location.reload()
    }
}


document.getElementById("btnLogout")?.addEventListener("click", e=>{
    e.preventDefault()
    localStorage.removeItem("rol")
    window.location.href="/index.html"
})

function descargarPDF(){

    const contenido = document.getElementById("boletaVista").innerHTML

    const ventana = window.open("", "", "width=300,height=600")

    ventana.document.write(`
        <html>
        <head>
            <title>Boleta PDF</title>
            <style>
                body{font-family:monospace;padding:10px;}
                table{width:100%;border-collapse:collapse;}
                th,td{font-size:11px;padding:2px;text-align:center;}
                hr{border-top:1px dashed black;}
                .total-box{background:black;color:white;padding:5px;text-align:center;}
            </style>
        </head>
        <body>
            ${contenido}
        </body>
        </html>
    `)

    ventana.document.close()

    setTimeout(()=>{
        ventana.print()   // 👉 aquí eliges "Guardar como PDF"
    },500)
}


function descargarPDF(){

    const contenido = document.getElementById("boletaVista").innerHTML

    const ventana = window.open("", "", "width=300,height=600")

    ventana.document.write(`
        <html>
        <head>
            <title>Boleta PDF</title>
            <style>
                body{font-family:monospace;padding:10px;}
                table{width:100%;border-collapse:collapse;}
                th,td{font-size:11px;padding:2px;text-align:center;}
                hr{border-top:1px dashed black;}
                .total-box{background:black;color:white;padding:5px;text-align:center;}
            </style>
        </head>
        <body>
            ${contenido}
        </body>
        </html>
    `)

    ventana.document.close()

    setTimeout(()=>{
        ventana.print() // 👉 eliges "Guardar como PDF"
    },500)
}