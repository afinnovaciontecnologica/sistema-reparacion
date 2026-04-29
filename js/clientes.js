/* ======================
📦 STORAGE
====================== */
let clientes = JSON.parse(localStorage.getItem("clientes")) || []

const tabla = document.getElementById("tablaClientes")
const buscar = document.getElementById("buscarCliente")

let indexEditar = null

/* ======================
🚀 INIT
====================== */
document.addEventListener("DOMContentLoaded", () => {

    render()

    if (buscar) {
        buscar.addEventListener("input", buscarCliente)
    }
})

/* ======================
💾 GUARDAR
====================== */
function guardarCliente(){

    const nombre = document.getElementById("nombre").value.trim()
    const telefono = document.getElementById("telefono").value.trim()
    const correo = document.getElementById("correo").value.trim()
    const direccion = document.getElementById("direccion").value.trim()

    if (!nombre) {
        alert("Ingrese nombre")
        return
    }

    const cliente = { nombre, telefono, correo, direccion }

    if (indexEditar === null) {
        clientes.push(cliente)
    } else {
        clientes[indexEditar] = cliente
        indexEditar = null
    }

    localStorage.setItem("clientes", JSON.stringify(clientes))

    limpiar()
    render()
}

/* ======================
📊 RENDER
====================== */
function render(lista = clientes){

    tabla.innerHTML = ""

    if (lista.length === 0) {
        tabla.innerHTML = "<tr><td colspan='5'>No hay clientes</td></tr>"
        return
    }

    lista.forEach((c, i) => {

        const tr = document.createElement("tr")

        tr.innerHTML = `
            <td>${c.nombre}</td>
            <td>${c.telefono || ""}</td>
            <td>${c.correo || ""}</td>
            <td>${c.direccion || ""}</td>
            <td>
                <button onclick="editar(${i})">✏️</button>
                <button onclick="eliminar(${i})">🗑</button>
            </td>
        `

        tabla.appendChild(tr)
    })
}

/* ======================
🔍 BUSCAR
====================== */
function buscarCliente(){

    const texto = buscar.value.toLowerCase()

    const filtrados = clientes.filter(c =>
        (c.nombre || "").toLowerCase().includes(texto) ||
        (c.telefono || "").includes(texto) ||
        (c.correo || "").toLowerCase().includes(texto) ||
        (c.direccion || "").toLowerCase().includes(texto)
    )

    render(filtrados)
}

/* ======================
✏️ EDITAR
====================== */
function editar(i){

    const c = clientes[i]

    document.getElementById("nombre").value = c.nombre
    document.getElementById("telefono").value = c.telefono || ""
    document.getElementById("correo").value = c.correo || ""
    document.getElementById("direccion").value = c.direccion || ""

    indexEditar = i
}

/* ======================
❌ ELIMINAR
====================== */
function eliminar(i){

    if (confirm("¿Eliminar cliente?")) {
        clientes.splice(i, 1)
        localStorage.setItem("clientes", JSON.stringify(clientes))
        render()
    }
}

/* ======================
🧹 LIMPIAR
====================== */
function limpiar(){

    document.getElementById("nombre").value = ""
    document.getElementById("telefono").value = ""
    document.getElementById("correo").value = ""
    document.getElementById("direccion").value = ""

    indexEditar = null
}


