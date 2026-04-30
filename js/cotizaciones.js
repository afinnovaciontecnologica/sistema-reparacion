/* =============================
INIT
============================= */
let clientes = [];
let productos = [];
let carrito = [];

/* =============================
ELEMENTOS
============================= */
const cliente = document.getElementById("cliente");
const producto = document.getElementById("producto");
const cantidad = document.getElementById("cantidad");

const cNombre = document.getElementById("cNombre");
const cTelefono = document.getElementById("cTelefono");
const cDireccion = document.getElementById("cDireccion");

const pNombre = document.getElementById("pNombre");
const pPrecio = document.getElementById("pPrecio");
const pStock = document.getElementById("pStock");

const detalle = document.getElementById("detalle");
const historial = document.getElementById("historial");

const subtotalEl = document.getElementById("subtotal");
const igvEl = document.getElementById("igv");
const totalEl = document.getElementById("total");

/* =============================
UTILS
============================= */
const S = n => Number(n || 0);
const money = n => "S/ " + S(n).toFixed(2);

/* =============================
LOAD
============================= */
window.addEventListener("load", () => {

    clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    productos = JSON.parse(localStorage.getItem("productos")) || [];

    console.log("CLIENTES:", clientes);
    console.log("PRODUCTOS:", productos);

    if (clientes.length === 0) {
        alert("⚠ No hay clientes. Ve a la sección CLIENTES.");
    }

    if (productos.length === 0) {
        alert("⚠ No hay productos. Ve a la sección PRODUCTOS.");
    }

    cargarClientes();
    cargarProductos();
    mostrarDetalle();
    mostrarHistorial();

    if (cliente) cliente.addEventListener("change", seleccionarCliente);
    if (producto) producto.addEventListener("change", seleccionarProducto);
});

/* =============================
CLIENTES
============================= */
function cargarClientes() {
    if (!cliente) return;

    cliente.innerHTML = "<option value=''>Seleccionar</option>";

    clientes.forEach((c, i) => {
        cliente.innerHTML += `<option value="${i}">${c.nombre}</option>`;
    });
}

function seleccionarCliente() {
    const c = clientes[cliente.value];
    if (!c) return limpiarCliente();

    cNombre.textContent = c.nombre || "-";
    cTelefono.textContent = c.telefono || "-";
    cDireccion.textContent = c.direccion || "-";
}

function limpiarCliente() {
    cNombre.textContent = "-";
    cTelefono.textContent = "-";
    cDireccion.textContent = "-";
}

/* =============================
PRODUCTOS
============================= */
function cargarProductos() {
    if (!producto) return;

    producto.innerHTML = "<option value=''>Seleccionar</option>";

    productos.forEach((p, i) => {
        producto.innerHTML += `<option value="${i}">${p.nombre} (Stock:${p.stock})</option>`;
    });
}

function seleccionarProducto() {
    const p = productos[producto.value];
    if (!p) return limpiarProducto();

    pNombre.textContent = p.nombre;
    pPrecio.textContent = money(p.precio);
    pStock.textContent = p.stock;
}

function limpiarProducto() {
    pNombre.textContent = "-";
    pPrecio.textContent = "-";
    pStock.textContent = "-";
}

/* =============================
AGREGAR ITEM
============================= */
function agregarItem() {

    const i = producto.value;
    const cant = parseInt(cantidad.value);

    if (i === "") return alert("Selecciona producto");
    if (!Number.isInteger(cant) || cant <= 0) return alert("Cantidad inválida");

    const p = productos[i];

    if (!p) return alert("Producto inválido");
    if (cant > p.stock) return alert("Stock insuficiente");

    p.stock -= cant;

    const existente = carrito.find(x => x.nombre === p.nombre);

    if (existente) {
        existente.cantidad += cant;
    } else {
        carrito.push({
            nombre: p.nombre,
            precio: S(p.precio),
            cantidad: cant
        });
    }

    localStorage.setItem("productos", JSON.stringify(productos));

    mostrarDetalle();
    cargarProductos();
    limpiarProducto();
}

/* =============================
DETALLE
============================= */
function mostrarDetalle() {

    if (!detalle) return;

    if (carrito.length === 0) {
        detalle.innerHTML = `<tr><td colspan="5">Sin productos</td></tr>`;
        calcular();
        return;
    }

    detalle.innerHTML = "";

    carrito.forEach((item, i) => {
        const totalItem = S(item.precio) * S(item.cantidad);

        detalle.innerHTML += `
        <tr>
            <td>${item.nombre}</td>
            <td>${money(item.precio)}</td>
            <td>${item.cantidad}</td>
            <td>${money(totalItem)}</td>
            <td>
                <button onclick="sumarItem(${i})">➕</button>
                <button onclick="restarItem(${i})">➖</button>
                <button onclick="eliminarItem(${i})">❌</button>
            </td>
        </tr>`;
    });

    calcular();
}

/* =============================
EDITAR ITEMS
============================= */
function sumarItem(i) {
    const item = carrito[i];
    const p = productos.find(x => x.nombre === item.nombre);

    if (p && p.stock > 0) {
        item.cantidad++;
        p.stock--;
        sync();
    } else {
        alert("Sin stock");
    }
}

function restarItem(i) {
    const item = carrito[i];
    const p = productos.find(x => x.nombre === item.nombre);

    item.cantidad--;

    if (p) p.stock++;

    if (item.cantidad <= 0) carrito.splice(i, 1);

    sync();
}

function eliminarItem(i) {
    const item = carrito[i];
    const p = productos.find(x => x.nombre === item.nombre);

    if (p) p.stock += item.cantidad;

    carrito.splice(i, 1);

    sync();
}

function sync() {
    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarDetalle();
    cargarProductos();
}

/* =============================
TOTALES
============================= */
function calcular() {
    const total = carrito.reduce((s, i) => s + S(i.precio) * S(i.cantidad), 0);
    const subtotal = total / 1.18;
    const igv = total - subtotal;

    subtotalEl.textContent = money(subtotal);
    igvEl.textContent = money(igv);
    totalEl.textContent = money(total);
}

/* =============================
GUARDAR
============================= */


/* =============================
HISTORIAL
============================= */


/* =============================
VER
============================= */
function verCotizacion(i) {
    const data = JSON.parse(localStorage.getItem("cotizaciones")) || [];
    const c = data[i];
    if (!c) return;

    alert(`${c.numero}\n${c.cliente}\nTotal: ${c.total}`);
}

/* =============================
ELIMINAR
============================= */
function eliminarCotizacion(i) {
    const data = JSON.parse(localStorage.getItem("cotizaciones")) || [];
    data.splice(i, 1);
    localStorage.setItem("cotizaciones", JSON.stringify(data));
    mostrarHistorial();
}

function limpiarTodo(){

    carrito = [];

    // reset selects
    cliente.value = "";
    producto.value = "";
    cantidad.value = 1;

    // limpiar UI cliente
    cNombre.textContent = "-";
    cTelefono.textContent = "-";
    cDireccion.textContent = "-";

    // limpiar UI producto
    pNombre.textContent = "-";
    pPrecio.textContent = "-";
    pStock.textContent = "-";

    mostrarDetalle();
    calcular();
}

function guardarCotizacion(){

    if(cliente.value === "") return alert("Selecciona cliente");
    if(carrito.length === 0) return alert("Sin productos");

    const c = clientes[cliente.value];

    let contador = parseInt(localStorage.getItem("contadorCot") || "1");

   const cot = {
    numero: "COT-" + String(contador).padStart(4,"0"),
    cliente: c.nombre,
    telefono: c.telefono,
    direccion: c.direccion,
    items: carrito.map(x=>({...x})),
    total: totalEl.textContent,
    fecha: new Date().toLocaleString(),
    usuario: localStorage.getItem("user") // 🔥 AQUÍ
};

    const data = JSON.parse(localStorage.getItem("cotizaciones")) || [];
    data.push(cot);

    localStorage.setItem("cotizaciones", JSON.stringify(data));
    localStorage.setItem("contadorCot", contador + 1);

    alert("✔ Cotización guardada");

    // 🔥 LIMPIAR TODO
    limpiarTodo();

    mostrarHistorial();
}

function mostrarHistorial(){

    const rol = localStorage.getItem("rol");
    const user = localStorage.getItem("user");

let data = JSON.parse(localStorage.getItem("cotizaciones")) || [];



    historial.innerHTML = "";

    data.forEach((c,i)=>{
        historial.innerHTML += `
        <tr>
            <td>${c.cliente}</td>
            <td>${c.fecha}</td>
            <td>${c.total}</td>
            <td>
                <button onclick="verPDF(${i})">📄</button>
                <button onclick="enviarWhatsApp(${i})">📲</button>
                ${rol === "admin" ? `
                <button onclick="editarCotizacion(${i})">✏️</button>
                <button onclick="eliminarCotizacion(${i})">🗑</button>
                ` : ``}
            </td>
        </tr>`;
    });
}

function verPDF(i){

const data = JSON.parse(localStorage.getItem("cotizaciones")) || [];
const c = data[i];
if(!c) return;

const total = parseFloat(c.total.replace("S/","")) || 0;
const subtotal = total / 1.18;
const igv = total - subtotal;

const filas = c.items.map(p=>`
<tr>
<td>${p.cantidad}</td>
<td>${p.nombre}</td>
<td>S/ ${p.precio.toFixed(2)}</td>
<td>S/ ${(p.precio*p.cantidad).toFixed(2)}</td>
</tr>
`).join("");

const win = window.open("", "_blank");

win.document.write(`
<html>
<head>
<title>${c.numero}</title>

<style>

/* ===== BASE ===== */
*{box-sizing:border-box;font-family:'Segoe UI';margin:0}
body{background:#eef2f7}

/* ===== HOJA ===== */
.page{
width:210mm;
min-height:297mm;
margin:auto;
background:#fff;
padding:30px;

display:flex;
flex-direction:column;
}

/* ===== CONTENIDO ===== */
.content{flex:1}

/* ===== HEADER ===== */
.header{
text-align:center;
}

.logo{
height:90px;
margin-bottom:10px;
}

.title{
font-size:22px;
font-weight:bold;
color:#1e3a5f;
}

.tag{
color:#2563eb;
font-size:14px;
}

.line{
border-top:3px solid #1e3a5f;
margin:15px 0;
}

/* ===== TOP ===== */
.top{
display:flex;
justify-content:space-between;
align-items:center;
}

.badge{
background:#1e3a5f;
color:#fff;
padding:8px 16px;
border-radius:8px;
font-weight:bold;
}

/* ===== CLIENTE ===== */
.cliente{
display:flex;
justify-content:space-between;
background:#f1f5f9;
padding:14px;
border-radius:10px;
margin-top:10px;
font-size:14px;
}

/* ===== TABLA ===== */
table{
width:100%;
border-collapse:collapse;
margin-top:15px;
}

th{
background:#1e3a5f;
color:white;
padding:10px;
font-size:13px;
}

td{
border:1px solid #ddd;
padding:10px;
text-align:center;
}

/* ===== TOTAL ===== */
.total-box{
margin-top:15px;
width:260px;
margin-left:auto;
border:1px solid #ccc;
padding:12px;
border-radius:10px;
background:#f9fafb;
}

.total{
font-size:20px;
color:#16a34a;
font-weight:bold;
}

/* ===== CONDICIONES ===== */
.cond{
margin-top:25px;
font-size:13px;
}

/* ===== FOOTER ===== */
.footer{
border-top:1px solid #ccc;
margin-top:20px;
padding-top:15px;
}

/* PAGOS */
.pagos{
text-align:center;
margin-bottom:10px;
}

.pagos img{
height:25px;
margin:0 6px;
}

/* SERVICIOS */
.servicios{
display:flex;
justify-content:space-between;
text-align:center;
font-size:12px;
margin:10px 0;
}

/* FIRMA */
.firma{
display:flex;
justify-content:space-between;
align-items:center;
margin-top:10px;
}

.firma img{
height:60px;
}

.sello{
border:3px double #1e3a5f;
border-radius:50%;
padding:15px;
font-size:12px;
text-align:center;
}

/* PRINT */
@media print{
body{background:white}
}

</style>
</head>

<body>

<div class="page">

<div class="content">

<div class="header">
<img src="/sistema-reparacion/assets/img/logo.png" class="logo">
<div class="title">AF INNOVACION TECNOLOGICA</div>
<div class="tag">Soluciones Tecnológicas a tu Alcance</div>
RUC: 10416270258<br>
Jr. Lucar y Torre #454<br>
Huaraz - Ancash<br>
WhatsApp: 9482321352
</div>

<div class="line"></div>

<div class="top">
<h2>COTIZACIÓN</h2>
<div class="badge">${c.numero}</div>
</div>

<p>📅 ${c.fecha}</p>

<div class="cliente">
<div>👤 ${c.cliente}</div>
<div>📞 ${c.telefono}</div>
<div>📍 ${c.direccion}</div>
</div>

<table>
<tr>
<th>CANT</th>
<th>DESCRIPCIÓN</th>
<th>P.UNIT</th>
<th>TOTAL</th>
</tr>

${filas}

</table>

<div class="total-box">
Subtotal: S/ ${subtotal.toFixed(2)}<br>
IGV (18%): S/ ${igv.toFixed(2)}<br>
<div class="total">TOTAL: S/ ${total.toFixed(2)}</div>
</div>

<div class="cond">
<b>CONDICIONES COMERCIALES</b><br>
• Precios incluyen IGV<br>
• Validez: 7 días<br>
• Tiempo de entrega: A coordinar<br>

</div>

</div>

<div class="footer" style="margin-top:20px; padding:0; border:none;">

<img src="/sistema-reparacion/assets/img/pie_pagina.png" style="
width:100%;
height:auto;
display:block;
">

</div>

</div>

<script>
window.onload=()=>window.print();
</script>

</body>
</html>
`);
}

function enviarWhatsApp(i){

    const data = JSON.parse(localStorage.getItem("cotizaciones")) || [];
    const c = data[i];

    if(!c || !c.telefono){
        return alert("Teléfono no válido");
    }

    const numero = c.telefono.replace(/\D/g,"");

    if(numero.length < 9){
        return alert("Número incorrecto");
    }

    let texto = `🧾 *${c.numero}*\n\n`;
    texto += `👤 ${c.cliente}\n📞 ${c.telefono}\n\n`;

    c.items.forEach(p=>{
        texto += `▫ ${p.nombre} x${p.cantidad} = S/ ${(p.precio*p.cantidad).toFixed(2)}\n`;
    });

    texto += `\n💰 TOTAL: ${c.total}`;

    const url = `https://wa.me/51${numero}?text=${encodeURIComponent(texto)}`;

    window.open(url, "_blank");
}

function editarCotizacion(i){

    if(localStorage.getItem("rol") !== "admin"){
    return alert("No tienes permisos");
}
    const data = JSON.parse(localStorage.getItem("cotizaciones")) || [];
    const c = data[i];

    // cargar cliente
    const idx = clientes.findIndex(x => x.nombre === c.cliente);

    if(idx !== -1){
        cliente.value = idx;
        seleccionarCliente();
    }

    // cargar carrito
    carrito = c.items.map(x=>({...x}));

    // eliminar original
    data.splice(i,1);
    localStorage.setItem("cotizaciones", JSON.stringify(data));

    mostrarDetalle();
    mostrarHistorial();

    window.scrollTo({top:0, behavior:"smooth"});
}

function eliminarCotizacion(i){

    if(localStorage.getItem("rol") !== "admin"){
        return alert("No tienes permisos");
    }

    const data = JSON.parse(localStorage.getItem("cotizaciones")) || [];
    data.splice(i,1);
    localStorage.setItem("cotizaciones", JSON.stringify(data));
    mostrarHistorial();
}