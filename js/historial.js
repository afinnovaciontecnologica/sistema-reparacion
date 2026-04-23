javascript
// ======================
// STORAGE (SEGURO)
// ======================
let ventas = [];

try{
    ventas = JSON.parse(localStorage.getItem("ventas")) || [];
}catch(e){
    ventas = [];
}

if(!Array.isArray(ventas)){
    ventas = [];
}

console.log("VENTAS CARGADAS HISTORIAL:", ventas);

// ======================
// INICIO
// ======================
document.addEventListener("DOMContentLoaded", () => {

    renderVentas();
    activarBuscador();

});

// ======================
// RENDER TABLA
// ======================
function renderVentas(lista = ventas){

    let tbody = document.getElementById("tablaHistorial");

    if(!tbody){
        console.error("❌ No existe #tablaHistorial");
        return;
    }

    tbody.innerHTML = "";

    if(!lista || lista.length === 0){
        tbody.innerHTML = `
        <tr>
            <td colspan="5" style="color:#94a3b8;">
                No hay ventas registradas
            </td>
        </tr>`;
        return;
    }

    lista.slice().reverse().forEach((v) => {

        let indexReal = ventas.indexOf(v);

        let fila = document.createElement("tr");

        fila.innerHTML = `
        <td>${v.numero || "-"}</td>
        <td>${v.cliente || "SIN NOMBRE"}</td>
        <td>${v.fecha || "-"}</td>
        <td>S/ ${Number(v.total || 0).toFixed(2)}</td>
        <td>
            <button onclick="verVenta(${indexReal})">👁️</button>
            <button onclick="descargarPDF(${indexReal})">📄 PDF</button>
            <button onclick="eliminarVenta(${indexReal})">🗑️</button>
        </td>
        `;

        tbody.appendChild(fila);
    });
}

// ======================
// BUSCADOR
// ======================
function activarBuscador(){

    let input = document.getElementById("buscarVenta");

    if(!input) return;

    input.addEventListener("input", function(){

        let texto = this.value.toLowerCase();

        let filtrado = ventas.filter(v =>
            (v.cliente || "").toLowerCase().includes(texto) ||
            (v.numero || "").toLowerCase().includes(texto)
        );

        renderVentas(filtrado);
    });
}

// ======================
// VER BOLETA
// ======================
function verVenta(i){

    let venta = ventas[i];

    if(!venta){
        alert("Venta no encontrada");
        return;
    }

    let cont = document.getElementById("boletaVista");
    let modal = document.getElementById("modalBoleta");

    if(!cont || !modal){
        alert("Falta modal en HTML");
        return;
    }

    cont.innerHTML = generarBoletaHTML(venta);
    modal.style.display = "flex";
}

// ======================
// GENERAR BOLETA
// ======================
function generarBoletaHTML(v){

    let descuentoTotal = 0;

    (v.items || []).forEach(p => {
        descuentoTotal += (Number(p.descuento || 0) * Number(p.cantidad));
    });

    let subtotal = Number(v.total || 0) + descuentoTotal;

    return `
    <div style="font-family:Arial; color:black; font-size:12px; width:300px;">

        <center>
            <img src="/assets/img/logo.png" style="width:80px;"><br>
            <b>INNOVACION TECNOLOGICA</b><br>
            RUC: 10416270258<br>
            Huaraz - Ancash
        </center>

        <hr>

        <b>BOLETA:</b> ${v.numero}<br>
        <b>FECHA:</b> ${v.fecha}<br>
        <b>CLIENTE:</b> ${v.cliente}

        <hr>

        <table width="100%">
            <tr>
                <th>CANT</th>
                <th>DESC</th>
                <th>P.U</th>
                <th>TOTAL</th>
            </tr>

            ${(v.items || []).map(p => `
                <tr>
                    <td>${p.cantidad}</td>
                    <td>${p.nombre}</td>
                    <td>${Number(p.precio).toFixed(2)}</td>
                    <td>${(p.precio * p.cantidad).toFixed(2)}</td>
                </tr>
            `).join("")}

        </table>

        <hr>

        <b>SUBTOTAL: S/ ${subtotal.toFixed(2)}</b><br>
        <b>TOTAL: S/ ${Number(v.total).toFixed(2)}</b>

        <br><br>
        <center>GRACIAS POR SU COMPRA</center>
    </div>
    `;
}

// ======================
// PDF
// ======================
function descargarPDF(i){

    let v = ventas[i];

    if(!v){
        alert("Venta no encontrada");
        return;
    }

    if(typeof html2pdf === "undefined"){
        alert("Falta librería html2pdf");
        return;
    }

    let contenido = document.createElement("div");
    contenido.innerHTML = generarBoletaHTML(v);

    html2pdf().from(contenido).save(`Boleta-${v.numero}.pdf`);
}

// ======================
// ELIMINAR
// ======================
function eliminarVenta(i){

    if(!confirm("¿Eliminar venta?")) return;

    ventas.splice(i,1);

    localStorage.setItem("ventas", JSON.stringify(ventas));

    renderVentas();
}

// ======================
// BORRAR TODO
// ======================
function borrarTodoHistorial(){

    if(!confirm("⚠️ ¿Seguro que quieres borrar todo el historial?")) return;

    localStorage.removeItem("ventas");

    ventas = [];

    renderVentas();

    alert("Historial eliminado correctamente");
}

// ======================
// CERRAR MODAL
// ======================
function cerrarBoleta(){
    let modal = document.getElementById("modalBoleta");
    if(modal) modal.style.display = "none";
}

// ======================
// WHATSAPP
// ======================
function enviarWhatsAppPDF(i){

    let v = ventas[i];

    if(!v) return;

    let texto = `Boleta ${v.numero} - Total S/ ${v.total}`;
    let numero = "51" + (v.telefono || "");

    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`);
}

// ======================
// CORREO
// ======================
function enviarCorreo(i){

    let v = ventas[i];

    if(!v) return;

    let asunto = `Boleta ${v.numero}`;
    let cuerpo = `Total: S/ ${v.total}`;

    window.location.href = `mailto:${v.correo}?subject=${asunto}&body=${cuerpo}`;
}

// ======================
// REINICIAR NUMERACIÓN
// ======================
function reiniciarNumeracionBoleta(){

    if(!confirm("⚠️ ¿Reiniciar numeración a 1?")) return;

    localStorage.setItem("numBoleta", 1);

    alert("Numeración reiniciada a 1");
}

