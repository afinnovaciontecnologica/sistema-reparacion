javascript
/* ======================
📦 STORAGE SEGURO
====================== */
let clientes;

try{
    clientes = JSON.parse(localStorage.getItem("clientes")) || [];
}catch{
    clientes = [];
}

if(!Array.isArray(clientes)){
    clientes = [];
}

/* ======================
🔐 ROL
====================== */
const rol = localStorage.getItem("rol") || "empleado";

let indexEditar = null;

/* ======================
🚀 INIT
====================== */
document.addEventListener("DOMContentLoaded", () => {

    const inputBuscar = document.getElementById("buscar");

    if(inputBuscar){
        inputBuscar.addEventListener("input", mostrar);
    }

    mostrar();

});

/* ======================
💾 GUARDAR
====================== */
function guardarCliente(){

    let nombre = document.getElementById("nombre").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let correo = document.getElementById("correo").value.trim();

    if(!nombre) return alert("Ingrese nombre");

    if(rol !== "admin" && indexEditar !== null){
        return alert("No tienes permiso para editar");
    }

    if(indexEditar !== null){
        clientes[indexEditar] = {nombre, telefono, correo};
        indexEditar = null;
    }else{
        clientes.push({nombre, telefono, correo});
    }

    localStorage.setItem("clientes", JSON.stringify(clientes));

    limpiar();
    mostrar();
}

/* ======================
📊 MOSTRAR
====================== */
function mostrar(){

    let tabla = document.getElementById("tablaClientes");
    let inputBuscar = document.getElementById("buscar");

    if(!tabla) return;

    let buscar = inputBuscar ? inputBuscar.value.toLowerCase() : "";

    tabla.innerHTML = "";

    let filtrados = clientes.filter(c =>
        (c.nombre || "").toLowerCase().includes(buscar) ||
        (c.telefono || "").includes(buscar) ||
        (c.correo || "").toLowerCase().includes(buscar)
    );

    if(filtrados.length === 0){
        tabla.innerHTML = `<tr><td colspan="5">No hay resultados</td></tr>`;
        return;
    }

    filtrados.forEach((c)=>{

        let indexReal = clientes.indexOf(c);

        tabla.innerHTML += `
        <tr>
            <td>${indexReal + 1}</td>
            <td>${c.nombre}</td>
            <td>${c.telefono || ""}</td>
            <td>${c.correo || ""}</td>
            <td>
                ${rol === "admin" ? `
                    <button onclick="editar(${indexReal})">✏️</button>
                    <button onclick="eliminar(${indexReal})">🗑</button>
                ` : `
                    <span style="color:#94a3b8;">Sin permisos</span>
                `}
            </td>
        </tr>`;
    });

}

/* ======================
❌ ELIMINAR
====================== */
function eliminar(i){

    if(rol !== "admin") return alert("No tienes permiso");

    if(confirm("¿Eliminar cliente?")){
        clientes.splice(i,1);
        localStorage.setItem("clientes", JSON.stringify(clientes));
        mostrar();
    }
}

/* ======================
✏️ EDITAR
====================== */
function editar(i){

    if(rol !== "admin") return alert("No tienes permiso");

    let c = clientes[i];

    document.getElementById("nombre").value = c.nombre;
    document.getElementById("telefono").value = c.telefono || "";
    document.getElementById("correo").value = c.correo || "";

    indexEditar = i;
}

/* ======================
🧹 LIMPIAR
====================== */
function limpiar(){
    document.getElementById("nombre").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("correo").value = "";
}


