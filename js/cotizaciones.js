// =============================
// STORAGE
// =============================
let productos = JSON.parse(localStorage.getItem("productos")) || [];
let cotizaciones = JSON.parse(localStorage.getItem("cotizaciones")) || [];
let clientes = JSON.parse(localStorage.getItem("clientes")) || [
{nombre:"Juan Perez", telefono:"948231352"},
{nombre:"Maria Lopez", telefono:"912345678"},
{nombre:"Carlos Ramos", telefono:"987654321"}
];

let carrito = [];

// 🔐 ROL
const rol = localStorage.getItem("rol") || "empleado";

// =============================
// INIT
// =============================
document.addEventListener("DOMContentLoaded", ()=>{

    cargarProductos();
    cargarClientes();
    mostrarCotizaciones();

    document.querySelector(".btn-guardar")?.addEventListener("click", guardarCotizacion);
    document.querySelector(".btn-limpiar")?.addEventListener("click", limpiarCotizacion);
    document.querySelector(".btn-reset")?.addEventListener("click", reiniciarTodo);
});

// =============================
// PRODUCTOS
// =============================
function cargarProductos(){
let select = document.getElementById("producto");
if(!select) return;

select.innerHTML = "<option value=''>Seleccionar producto</option>";

productos.forEach((p, i)=>{
    select.innerHTML += `
    <option value="${i}">
    ${p.nombre} - S/ ${p.precio} (Stock: ${p.stock})
    </option>`;
});


}

// =============================
// CLIENTES
// =============================
function cargarClientes(){
let select = document.getElementById("cliente");
if(!select) return;


select.innerHTML = "<option value=''>Seleccionar cliente</option>";

clientes.forEach(c=>{
    select.innerHTML += `<option value="${c.nombre}">${c.nombre}</option>`;
});


}

// =============================
// AGREGAR ITEM
// =============================
function agregarItem(){


let index = document.getElementById("producto").value;
let cantidad = parseInt(document.getElementById("cantidad").value);

if(index === "" || !cantidad || cantidad <= 0){
    return alert("⚠️ Completa datos correctamente");
}

let p = productos[index];

if(p.stock < cantidad){
    return alert("⚠️ Stock insuficiente");
}

carrito.push({
    nombre: p.nombre,
    precio: parseFloat(p.precio),
    cantidad
});

document.getElementById("producto").value = "";
document.getElementById("cantidad").value = 1;

mostrarDetalle();


}

// =============================
// DETALLE
// =============================
function mostrarDetalle(){


let tabla = document.getElementById("detalle");
if(!tabla) return;

tabla.innerHTML = "";

carrito.forEach((i, index)=>{
    let subtotal = i.precio * i.cantidad;

    tabla.innerHTML += `
    <tr>
        <td>${i.nombre}</td>
        <td>S/ ${i.precio}</td>
        <td>${i.cantidad}</td>
        <td>S/ ${subtotal.toFixed(2)}</td>
        <td><button onclick="eliminarItem(${index})">✖</button></td>
    </tr>`;
});

calcularTotal();


}

// =============================
// TOTALES
// =============================
function calcularTotales(items){
let total = items.reduce((sum,i)=> sum + i.precio*i.cantidad,0);
let subtotal = total / 1.18;
let igv = total - subtotal;
return {subtotal, igv, total};
}

function calcularTotal(){

    let {subtotal, igv, total} = calcularTotales(carrito);

    document.getElementById("subtotal").textContent = "S/ " + subtotal.toFixed(2);
    document.getElementById("igv").textContent = "S/ " + igv.toFixed(2);
    document.getElementById("totalFinal").textContent = "S/ " + total.toFixed(2);

    return {subtotal, igv, total};
}

// =============================
function eliminarItem(i){
carrito.splice(i,1);
mostrarDetalle();
}

// =============================
function limpiarCotizacion(){
carrito = [];
document.getElementById("cliente").value = "";
mostrarDetalle();
}

// =============================
function descontarStock(){
carrito.forEach(item=>{
let p = productos.find(x=>x.nombre === item.nombre);
if(p) p.stock -= item.cantidad;
});


localStorage.setItem("productos", JSON.stringify(productos));


}

// =============================
// SERIE Y NUMERO
// =============================
function getSerie(){
return localStorage.getItem("serie") || "COT01";
}

function getNumero(){
let n = parseInt(localStorage.getItem("correlativo") || "1");
localStorage.setItem("correlativo", n + 1);
return String(n).padStart(8,"0");
}

// =============================
// QR
// =============================
function generarQR(texto){
return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(texto)}`;
}

// =============================
// BOLETA COMPLETA (NO TOCADA)
// =============================
function verBoleta(index){
    let cot = cotizaciones[index];

let serie = "C001";
let numero = getNumero();

let {subtotal, igv, total} = calcularTotales(cot.items);

let hoy = new Date();
let fecha = hoy.toLocaleDateString() + " " + hoy.toLocaleTimeString();

let html = `
<div id="boleta">

    <div class="empresa">
        <img src="/assets/img/logo.png"> style="width:90px"><br>
        <b>INNOVACION TECNOLOGICA</b><br>
        RUC: 10416270258<br>
        Dirección: Jr. Lucar y Torre #454<br>
        Huaraz - Ancash<br>
        Whatsapp: 948231352<br>
        Email: afinnovaciontecnologica@gmail.com
    </div>

    <div class="linea"></div>

    <div class="cabecera">
        <span>COTIZACION</span>
        <span>${serie}-${numero}</span>
    </div>

    <div class="info">
        <span>Fecha: ${fecha}</span>
        <span>Cliente: <b>${cot.cliente}</b></span>
    </div>

    <div class="linea"></div>

    <table>
        <thead>
            <tr>
                <th>CANT</th>
                <th>DESCRIPCIÓN</th>
                <th>P.UNIT</th>
                <th>TOTAL</th>
            </tr>
        </thead>
        <tbody>
`;

cot.items.forEach(i=>{
    let t = i.precio * i.cantidad;

    html += `
        <tr>
            <td>${i.cantidad}</td>
            <td>${i.nombre}</td>
            <td>${i.precio.toFixed(2)}</td>
            <td><b>${t.toFixed(2)}</b></td>
        </tr>
    `;
});

html += `
        </tbody>
    </table>

    <div class="linea"></div>

    <div class="totales">
        <span>SUBTOTAL:</span>
        <span>S/ ${subtotal.toFixed(2)}</span>

        <span>IGV (18%):</span>
        <span>S/ ${igv.toFixed(2)}</span>
    </div>

    <div class="total-final">
        TOTAL: S/ ${total.toFixed(2)}
    </div>

    <div class="pago">
        Método de pago: EFECTIVO - YAPE - PLIN
    </div>

    <div class="linea"></div>

    <div class="gracias">
        <b>¡GRACIAS POR SU COMPRA!</b><br>
        Representación impresa de la boleta electrónica
    </div>

    <div class="acciones">
        <button onclick='descargarPDF(${JSON.stringify(cot)})'>📄 PDF</button>
        <button onclick='enviarWhatsApp(${JSON.stringify(cot)})'>📲 WhatsApp</button>
        <button onclick="window.print()">🖨 Imprimir</button>
        <button onclick="cerrarModal()">❌ Cerrar</button>
    </div>

</div>
`;

document.getElementById("modalBody").innerHTML = html;
document.getElementById("modalPDF").style.display = "flex";
}

// =============================
// PDF + WHATSAPP
// =============================
function enviarPDFyWhatsApp(cot){
descargarPDF(cot);
setTimeout(()=> enviarWhatsApp(cot),800);
}

function descargarPDF(cot){
const { jsPDF } = window.jspdf;
let doc = new jsPDF();


let {total} = calcularTotales(cot.items);

doc.text("COTIZACION",10,10);
doc.text("Cliente: "+cot.cliente,10,20);
doc.text("Total: "+total.toFixed(2),10,30);

doc.save("cotizacion.pdf");


}

// =============================
// WHATSAPP
// =============================
function enviarWhatsApp(cot){


let c = clientes.find(x=>x.nombre===cot.cliente);
if(!c) return alert("Cliente sin número");

let numero = "51"+c.telefono;

let {total} = calcularTotales(cot.items);

let msg = `🧾 COTIZACIÓN


Cliente: ${cot.cliente}
Total: S/ ${total.toFixed(2)}

Adjunta el PDF descargado`;


window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`);


}

// =============================
// GUARDAR
// =============================
function guardarCotizacion(){


let cliente = document.getElementById("cliente").value;

if(!cliente || carrito.length===0){
    return alert("Faltan datos");
}

let {subtotal, igv, total} = calcularTotales(carrito);

let cot = {
    cliente,
    items:[...carrito],
    subtotal,
    igv,
    total,
    fecha:new Date().toLocaleDateString()
};

cotizaciones.push(cot);
localStorage.setItem("cotizaciones", JSON.stringify(cotizaciones));

descontarStock();
limpiarCotizacion();
mostrarCotizaciones();
verBoleta(cot);


}

// =============================
// HISTORIAL (CON ROLES)
// =============================
function mostrarCotizaciones(){


let tabla = document.getElementById("listaCotizaciones");
if(!tabla) return;

tabla.innerHTML = "";

cotizaciones.forEach((c,i)=>{
    tabla.innerHTML += `
    <tr>
        <td>${c.cliente}</td>
        <td>${c.fecha}</td>
        <td>S/ ${c.total.toFixed(2)}</td>
        <td>
            <button onclick="verBoleta(${i})">👁</button>

            ${rol === "admin" ? `
                <button onclick="editarCotizacion(${i})">✏️</button>
                <button onclick="eliminarCotizacion(${i})">🗑</button>
            ` : `
                <span style="color:#94a3b8;">Sin permisos</span>
            `}
        </td>
    </tr>`;
});


}

// =============================
function editarCotizacion(i){


if(rol !== "admin") return alert("No tienes permiso");

let c = cotizaciones[i];

document.getElementById("cliente").value = c.cliente;
carrito = [...c.items];

cotizaciones.splice(i,1);
localStorage.setItem("cotizaciones", JSON.stringify(cotizaciones));

mostrarDetalle();
mostrarCotizaciones();


}

// =============================
function eliminarCotizacion(i){


if(rol !== "admin") return alert("No tienes permiso");

if(confirm("Eliminar?")){
    cotizaciones.splice(i,1);
    localStorage.setItem("cotizaciones", JSON.stringify(cotizaciones));
    mostrarCotizaciones();
}


}

// =============================
function cerrarModal(){
document.getElementById("modalPDF").style.display = "none";
}

function reiniciarTodo(){

    if(!confirm("⚠️ Esto borrará TODO (carrito, cotizaciones y numeración). ¿Continuar?")){
        return;
    }

    // Vaciar carrito
    carrito = [];

    // Limpiar selects
    document.getElementById("cliente").value = "";
    document.getElementById("producto").value = "";
    document.getElementById("cantidad").value = 1;

    // Limpiar tablas
    document.getElementById("detalle").innerHTML = "";
    document.getElementById("listaCotizaciones").innerHTML = "";

    // Reset totales
    document.getElementById("subtotal").textContent = "S/ 0.00";
    document.getElementById("igv").textContent = "S/ 0.00";
    document.getElementById("totalFinal").textContent = "S/ 0.00";

    // Borrar historial de cotizaciones
    cotizaciones = [];
    localStorage.removeItem("cotizaciones");

    // Reiniciar numeración
    localStorage.removeItem("correlativo");

    alert("✅ Sistema reiniciado correctamente");
}