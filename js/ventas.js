
// ======================
// INICIO
// ======================
document.addEventListener("DOMContentLoaded", () => {

    cargarProductos();
    cargarCategorias();
    renderCarrito();
    configurarComprobante();
    configurarBuscadorClientes();
    configurarMetodoPago();
    renderVentas();

    let buscador = document.getElementById("buscarVenta");

    if(buscador){
        buscador.addEventListener("input", function(){

            let valor = this.value.toLowerCase();

            let filtradas = ventas.filter(v =>
                v.cliente.toLowerCase().includes(valor) ||
                v.numero.toLowerCase().includes(valor)
            );

            renderVentas(filtradas);
        });
    }

});

// ======================
// DATA
// ======================
let productos = [];
let carrito = [];
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

let metodoSeleccionado = "";
let ventaActual = null;

// ======================
// LOGO BASE64 🔥
// ======================
const LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAA..."; // ⚠️ puedes reemplazar luego con tu logo real

// ======================
// CATEGORIAS BASE
// ======================
const categoriasBase = [
    { nombre: "Laptops", subcategorias: ["Gamer","Oficina","Ultrabook","2 en 1","Workstation"] },
    { nombre: "Computadoras", subcategorias: ["Escritorio","All in One","Mini PC","Workstation"] },
    { nombre: "Monitores", subcategorias: ["LED","Curvo","Gaming","4K","Ultrawide"] },
    { nombre: "Teclados", subcategorias: ["Mecánico","Membrana","Inalámbrico","RGB"] },
    { nombre: "Mouse", subcategorias: ["Gamer","Oficina","Inalámbrico","Ergonómico"] },
    { nombre: "Impresoras", subcategorias: ["Láser","Tinta","Multifuncional","Térmica"] },
    { nombre: "Redes", subcategorias: ["Router","Switch","Access Point","Repetidor"] },
    { nombre: "Almacenamiento", subcategorias: ["HDD","SSD","NVMe","USB"] },
    { nombre: "Memorias RAM", subcategorias: ["DDR3","DDR4","DDR5","SO-DIMM"] },
    { nombre: "Tarjetas Gráficas", subcategorias: ["NVIDIA","AMD","Gama Alta","Gama Media"] },
    { nombre: "Procesadores", subcategorias: ["Intel i3","Intel i5","Intel i7","Ryzen"] },
    { nombre: "Placas Madre", subcategorias: ["ATX","Micro ATX","Mini ITX","Gaming"] },
    { nombre: "Fuentes de Poder", subcategorias: ["Bronze","Gold","Modular","Semi Modular"] },
    { nombre: "Gabinetes", subcategorias: ["Gamer","Oficina","Compacto","RGB"] },
    { nombre: "Refrigeración", subcategorias: ["Aire","Líquida","Ventiladores","Pasta térmica"] },
    { nombre: "Audio", subcategorias: ["Audífonos","Parlantes","Micrófonos","Soundbar"] },
    { nombre: "Cámaras", subcategorias: ["Webcam","CCTV","IP","HD"] },
    { nombre: "Accesorios", subcategorias: ["Cables","Adaptadores","Bases","Hub USB"] }
];

// ======================
// PRODUCTOS
// ======================
function cargarProductos() {

    let productosStorage = JSON.parse(localStorage.getItem("productos")) || [];

    // 🔥 ASEGURAR FORMATO CORRECTO
    productos = productosStorage.map(p => ({
        nombre: p.nombre,
        descripcion: p.descripcion,
        categoria: p.categoria,
        subcategoria: p.subcategoria,
        precio: Number(p.precio),
        stock: Number(p.stock)
    }));

    console.log("✅ Productos cargados:", productos);
}

// ======================
// ELEMENTOS
// ======================
const categoriaSelect = document.getElementById("categoria");
const subcategoriaSelect = document.getElementById("subcategoria");
const productoSelect = document.getElementById("producto");
const precioInput = document.getElementById("precio");
const cantidadInput = document.getElementById("cantidad");
const stockInput = document.getElementById("stock");

// ======================
// CATEGORIAS
// ======================
function cargarCategorias() {

    categoriaSelect.innerHTML = "<option value=''>Categoría</option>";

    let categorias = [...new Set(productos.map(p => p.categoria))];

    categorias.forEach(cat => {
        let option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoriaSelect.appendChild(option);
    });
}

categoriaSelect.addEventListener("change", () => {
    subcategoriaSelect.innerHTML = "<option>Subcategoría</option>";

    let cat = categoriasBase.find(c => c.nombre === categoriaSelect.value);
    if (!cat) return;

    cat.subcategorias.forEach(sub => {
        let option = document.createElement("option");
        option.value = sub;
        option.textContent = sub;
        subcategoriaSelect.appendChild(option);
    });
});

categoriaSelect.addEventListener("change", () => {

    subcategoriaSelect.innerHTML = "<option value=''>Subcategoría</option>";

    let subcategorias = [];

    // 🔥 buscar en base
    let catBase = categoriasBase.find(c => c.nombre === categoriaSelect.value);
    if (catBase) {
        subcategorias = [...catBase.subcategorias];
    }

    // 🔥 agregar subcategorias de productos reales
    let subProd = productos
        .filter(p => p.categoria === categoriaSelect.value)
        .map(p => p.subcategoria);

    subcategorias = [...new Set([...subcategorias, ...subProd])];

    subcategorias.forEach(sub => {
        let option = document.createElement("option");
        option.value = sub;
        option.textContent = sub;
        subcategoriaSelect.appendChild(option);
    });
});

// ======================
// PRODUCTO DETALLE
// ======================
productoSelect.addEventListener("change", () => {
    let prod = productos.find(p => p.nombre === productoSelect.value);
    if (!prod) return;

    precioInput.value = prod.precio;
    stockInput.value = prod.stock;
});

// ======================
// CARRITO
// ======================
function agregarCarrito() {
    let nombre = productoSelect.value;
    let cantidad = parseInt(cantidadInput.value);

    if (!nombre || isNaN(cantidad) || cantidad <= 0) {
        mostrarNotificacion("Seleccione producto y cantidad válida ⚠️", "warning");
        return;
    }

    let prod = productos.find(p => p.nombre === nombre);
    if (!prod) return;

    if (cantidad > prod.stock) {
        mostrarNotificacion("Stock insuficiente ❌", "error");
        return;
    }

    let existe = carrito.find(p => p.nombre === nombre);

    if (existe) {
        if (existe.cantidad + cantidad > prod.stock) {
            mostrarNotificacion("Supera el stock ⚠️", "warning");
            return;
        }
        existe.cantidad += cantidad;
    } else {
        carrito.push({
    nombre,
    descripcion: prod.descripcion,
    precio: prod.precio,
    precioOriginal: prod.precio,
    descuento: 0,
    cantidad
});
    }

    renderCarrito();
}

function renderCarrito() {
    let tbody = document.getElementById("carrito");
    tbody.innerHTML = "";

    let total = 0;

    carrito.forEach((item, i) => {
        let subtotal = item.precio * item.cantidad;
        total += subtotal;

        tbody.innerHTML += `
        <tr>
            <td>${item.nombre}</td>
            <td>S/. ${item.precio.toFixed(2)}</td>
            <td>${item.cantidad}</td>
            <td>S/. ${subtotal.toFixed(2)}</td>
            <td>
                <button onclick="editarCantidad(${i})">✏️</button>
                <button onclick="aplicarDescuento(${i})">💲</button>
                <button onclick="eliminarItem(${i})">🗑️</button>
            </td>
        </tr>`;
    });

    document.getElementById("total").textContent = total.toFixed(2);
}

// ======================
function eliminarItem(i) {
    carrito.splice(i,1);
    renderCarrito();
    mostrarNotificacion("Producto eliminado 🗑️","ok");
}

// ======================
// MODAL
// ======================
let accionActual = null;
let indexActual = null;

function abrirModal(titulo, index, accion){
    document.getElementById("modalTitulo").textContent = titulo;
    document.getElementById("modalValor").value = "";
    document.getElementById("modalContainer").style.display = "flex";

    accionActual = accion;
    indexActual = index;
}

function cerrarModal(){
    document.getElementById("modalContainer").style.display = "none";
}

function confirmarModal(){
    let valor = parseFloat(document.getElementById("modalValor").value);

    if(isNaN(valor) || valor <= 0){
        mostrarNotificacion("Ingrese valor válido ⚠️","warning");
        return;
    }

    if(accionActual === "cantidad"){
        actualizarCantidad(indexActual, valor);
    }

    if(accionActual === "descuento"){
        actualizarDescuento(indexActual, valor);
    }

    cerrarModal();
}

function editarCantidad(i) {
    abrirModal("Editar cantidad", i, "cantidad");
}

function actualizarCantidad(i, nueva){
    let prod = productos.find(p => p.nombre === carrito[i].nombre);
    if (!prod) return;

    if (nueva > prod.stock) {
        mostrarNotificacion("Supera stock ⚠️","warning");
        return;
    }

    carrito[i].cantidad = nueva;
    renderCarrito();
}

function aplicarDescuento(i) {
    abrirModal("Aplicar descuento", i, "descuento");
}

function actualizarDescuento(i, d){
    let nuevoPrecio = carrito[i].precioOriginal - d;

    if (nuevoPrecio < 0) {
        mostrarNotificacion("Descuento inválido ❌","error");
        return;
    }

    carrito[i].precio = nuevoPrecio;
    carrito[i].descuento = d;
    renderCarrito();
}

// ======================
// METODO PAGO
// ======================
function configurarMetodoPago(){
    document.querySelectorAll(".chip").forEach(btn => {
        btn.addEventListener("click", () => {

            document.querySelectorAll(".chip").forEach(b => b.classList.remove("activo"));

            btn.classList.add("activo");
            metodoSeleccionado = btn.dataset.pago;
        });
    });
}

// ======================
// FINALIZAR VENTA
// ======================

function finalizarVenta(){

    if(carrito.length === 0){
        mostrarNotificacion("Agregue productos ⚠️","warning");
        return;
    }

    if(!metodoSeleccionado){
        mostrarNotificacion("Seleccione método de pago ⚠️","warning");
        return;
    }

    let total = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);

 let venta = {
    fecha: new Date().toLocaleString(),
    cliente: document.getElementById("buscarCliente").value || "CLIENTE GENERAL",
    telefono: document.getElementById("clienteTelefono").value || "-",
    correo: document.getElementById("clienteCorreo").value || "-",
    comprobante: document.getElementById("tipoComprobante").value || "boleta",
    numero: generarNumeroBoleta(),
    items: carrito,
    metodo: metodoSeleccionado,
    total: total
};

    // 🔥 GUARDAR
    ventas.push(venta);
    ventaActual = venta;
    localStorage.setItem("ventas", JSON.stringify(ventas));
    
    actualizarStock();   // 🔥 DESCUENTA STOCK
    cargarProductos();   // 🔥 RECARGA DATOS

    
    // 🔥 GENERAR BOLETA
    let html = generarBoletaHTML(venta);

    let modal = document.getElementById("modalBoleta");
    let contenido = document.getElementById("boletaHTML");

    document.getElementById("boletaVista").innerHTML = html;
document.getElementById("boletaHTML").innerHTML = html;
    modal.style.display = "flex";

  

    // 🔥 LIMPIAR TODO
    limpiarSistema();

    mostrarNotificacion("Venta realizada ✅","ok");
    renderVentas();
}
// ======================
// COMPROBANTE
// ======================
function configurarComprobante() {
    const tipo = document.getElementById("tipoComprobante");
    const contCliente = document.getElementById("contenedorCliente");
    const datosCliente = document.getElementById("datosCliente");
    const ruc = document.getElementById("ruc");
    const razon = document.getElementById("razonSocial");

    tipo.addEventListener("change", () => {

        if (tipo.value === "boleta") {
            contCliente.style.display = "block";
            datosCliente.style.display = "flex";
            ruc.style.display = "none";
            razon.style.display = "none";
        }
        else if (tipo.value === "factura") {
            contCliente.style.display = "block";
            datosCliente.style.display = "flex";
            ruc.style.display = "block";
            razon.style.display = "block";
        }
        else {
            contCliente.style.display = "none";
            datosCliente.style.display = "none";
            ruc.style.display = "none";
            razon.style.display = "none";
        }
    });
}

// ======================
// CLIENTES
// ======================
function configurarBuscadorClientes() {

    const input = document.getElementById("buscarCliente");
    const lista = document.getElementById("listaClientes");
    const mensaje = document.getElementById("mensajeCliente");
    const telefono = document.getElementById("clienteTelefono");
    const correo = document.getElementById("clienteCorreo");

    input.addEventListener("input", () => {

        let valor = input.value.toLowerCase().trim();
        lista.innerHTML = "";

        // 🔥 LIMPIAR SIEMPRE
        telefono.value = "";
        correo.value = "";

        if (valor === "") {
            mensaje.textContent = "";
            return;
        }

        let filtrados = clientes.filter(c =>
            c.nombre.toLowerCase().includes(valor)
        );

        // ======================
        // ❌ NO EXISTE
        // ======================
        if (filtrados.length === 0) {
            mensaje.className = "msg-error";
            mensaje.textContent = "❌ Cliente no existe";
            lista.innerHTML = "";
            return;
        }

        // ======================
        // ✅ EXISTE
        // ======================
        mensaje.className = "msg-ok";
        mensaje.textContent = "✅ Cliente encontrado";

        filtrados.forEach(c => {
            let div = document.createElement("div");
            div.textContent = c.nombre;

            div.onclick = () => {
                input.value = c.nombre;
                telefono.value = c.telefono || "";
                correo.value = c.correo || "";

                mensaje.className = "msg-ok";
                mensaje.textContent = "✅ Cliente seleccionado";

                lista.innerHTML = "";
            };

            lista.appendChild(div);
        });

    });
}

// ======================
// LIMPIAR
// ======================
function limpiarSistema(){

    // ======================
    // CARRITO
    // ======================
    carrito = [];
    renderCarrito();

    // ======================
    // PRODUCTOS
    // ======================
    document.getElementById("categoria").value = "";
    document.getElementById("subcategoria").innerHTML = "<option>Subcategoría</option>";
    document.getElementById("producto").innerHTML = "<option>Producto</option>";

    document.getElementById("precio").value = "";
    document.getElementById("cantidad").value = 1;
    document.getElementById("stock").value = "";

    // ======================
    // CLIENTE
    // ======================
    document.getElementById("buscarCliente").value = "";
    document.getElementById("listaClientes").innerHTML = "";
    document.getElementById("clienteTelefono").value = "";
    document.getElementById("clienteCorreo").value = "";

    // ======================
    // COMPROBANTE
    // ======================
    document.getElementById("tipoComprobante").value = "";
    document.getElementById("contenedorCliente").style.display = "none";
    document.getElementById("datosCliente").style.display = "none";

    document.getElementById("ruc").value = "";
    document.getElementById("razonSocial").value = "";
    document.getElementById("ruc").style.display = "none";
    document.getElementById("razonSocial").style.display = "none";

    // ======================
    // METODO DE PAGO
    // ======================
    metodoSeleccionado = "";
    document.querySelectorAll(".chip").forEach(b => b.classList.remove("activo"));

    // ======================
    // TOTAL
    // ======================
    document.getElementById("total").textContent = "0.00";

    // ======================
    // MENSAJES
    // ======================
    const mensaje = document.getElementById("mensajeCliente");
    if(mensaje) mensaje.textContent = "";

    // ======================
    // UX (FOCO INICIAL)
    // ======================
    document.getElementById("categoria").focus();
}

function actualizarStock() {

    let productosStorage = JSON.parse(localStorage.getItem("productos")) || [];

    carrito.forEach(item => {

        let prod = productosStorage.find(p => p.nombre === item.nombre);

        if (prod) {
            prod.stock = Number(prod.stock) - Number(item.cantidad);

            // 🔥 evitar negativos
            if (prod.stock < 0) {
                prod.stock = 0;
            }
        }

    });

    localStorage.setItem("productos", JSON.stringify(productosStorage));
}
// ======================
// NOTIFICACION
// ======================
function mostrarNotificacion(msg, tipo="ok"){
    const noti = document.getElementById("notificacion");
    if(!noti) return;

    noti.className = "noti " + tipo;
    noti.textContent = msg;

    noti.classList.add("show");

    setTimeout(()=>{
        noti.classList.remove("show");
    },2500);
}

// ======================
// BOLETA
// ======================


subcategoriaSelect.addEventListener("change", () => {

    productoSelect.innerHTML = "<option value=''>Producto</option>";

    let filtrados = productos.filter(p =>
        p.categoria === categoriaSelect.value &&
        p.subcategoria === subcategoriaSelect.value
    );

    console.log("Filtrados:", filtrados); // 🔥 DEBUG

    filtrados.forEach(p => {
        let option = document.createElement("option");
        option.value = p.nombre;
        option.textContent = p.nombre;
        productoSelect.appendChild(option);
    });
});

const descripcionInput = document.getElementById("descripcion");

productoSelect.addEventListener("change", () => {

    let prod = productos.find(p => p.nombre === productoSelect.value);
    if (!prod) return;

    descripcionInput.value = prod.descripcion || prod.nombre;
    precioInput.value = prod.precio;
    stockInput.value = prod.stock;
});

function cerrarBoleta(){
    document.getElementById("modalBoleta").style.display = "none";
}



function generarBoletaHTML(venta){

let descuentoTotal = 0;

(venta.items || []).forEach(p => {
    descuentoTotal += (p.descuento || 0) * p.cantidad;
});

let subtotal = venta.total + descuentoTotal;

return `
<div class="ticket">

    <div class="header-empresa">
        <img src="https://afinnovaciontecnologica.github.io/sistema-reparacion/assets/img/logo.png" class="logo">
        <h2>INNOVACION TECNOLOGICA</h2>
        <p>RUC: 10416270258</p>
        <p>Huaraz - Ancash</p>
        <p>Cel: 948231352</p>
    </div>

    <div class="linea"></div>

    <div class="boleta-info">
        <p><b>${venta.comprobante.toUpperCase()}:</b> ${venta.numero}</p>
        <p><b>Fecha:</b> ${venta.fecha}</p>
        <p><b>Cliente:</b> ${venta.cliente}</p>
        <p><b>Teléfono:</b> ${venta.telefono}</p>
        <p><b>Correo:</b> ${venta.correo}</p>
    </div>

    <div class="linea"></div>

    <table class="detalle">
        <thead>
            <tr>
                <th>DESC</th>
                <th>CANT</th>
                <th>P.U</th>
                <th>SUB</th>
            </tr>
        </thead>
        <tbody>
            ${(venta.items || []).map(p => `
                <tr>
                    <td>${p.descripcion || p.nombre}</td>
                    <td>${p.cantidad}</td>
                    <td>${p.precio.toFixed(2)}</td>
                    <td>${(p.precio * p.cantidad).toFixed(2)}</td>
                </tr>
            `).join("")}
        </tbody>
    </table>

    <div class="linea"></div>

    <div class="totales">
        <p>SUBTOTAL: S/ ${subtotal.toFixed(2)}</p>
        ${
            descuentoTotal > 0
            ? `<p class="descuento">DESCUENTO: - S/ ${descuentoTotal.toFixed(2)}</p>`
            : ""
        }
        <h3 class="total">TOTAL: S/ ${venta.total.toFixed(2)}</h3>
    </div>

    <div class="linea"></div>

    <p class="pago">PAGO: ${venta.metodo.toUpperCase()}</p>

    <p class="gracias">¡GRACIAS POR SU COMPRA!</p>

</div>
`;
}



function imprimirBoleta(){
    window.print();
}

function generarNumeroBoleta(){
    let num = localStorage.getItem("numBoleta") || 1;
    let correlativo = String(num).padStart(8, "0");

    localStorage.setItem("numBoleta", Number(num) + 1);

    return `B001-${correlativo}`;
}

function renderVentas(lista = ventas){

    let tbody = document.getElementById("tablaHistorial");
    if(!tbody) return;

    tbody.innerHTML = "";

    lista.forEach((v, i) => {
        tbody.innerHTML += `
        <tr>
            <td>${v.numero}</td>
            <td>${v.cliente}</td>
            <td>${v.fecha}</td>
            <td>S/. ${v.total}</td>
            <td>
                <button class="btn-ver" onclick="verVenta(${i})">👁️</button>
                <button class="btn-editar" onclick="descargarPDF(${i})">📄</button>
            </td>
        </tr>`;
    });
}

function verVenta(i){

    let venta = ventas[i];

    let html = generarBoletaHTML(venta); // 🔥 USA TU SISTEMA REAL

    document.getElementById("boletaVista").innerHTML = html;

    document.getElementById("modalBoleta").style.display = "flex";
}

function descargarPDF(i){

    let venta = ventas[i];

    let html = generarBoletaHTML(venta);

    let contenedor = document.createElement("div");
    contenedor.innerHTML = html;

    let opciones = {
        margin: 0,
        filename: `Boleta-${venta.numero}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
            scale: 2,
            useCORS: true
        },
        jsPDF: {
            unit: 'mm',
            format: [80, 250],
            orientation: 'portrait'
        }
    };

    html2pdf().from(contenedor).set(opciones).save();
}

document.addEventListener("DOMContentLoaded", () => {

    let buscador = document.getElementById("buscarVenta");

    if(buscador){
        buscador.addEventListener("input", function(){

            let valor = this.value.toLowerCase();

            let filtradas = ventas.filter(v =>
                v.cliente.toLowerCase().includes(valor) ||
                v.numero.toLowerCase().includes(valor)
            );

            renderVentas(filtradas);
        });
    }

});

function enviarWhatsApp(){

    let venta = ventaActual;

    if(!venta){
        mostrarNotificacion("No hay venta","error");
        return;
    }

    let telefono = venta.telefono;

    if(!telefono || telefono === "-" || telefono.trim() === ""){
        mostrarNotificacion("Cliente sin número ❌","error");
        return;
    }

    telefono = telefono.replace(/\s+/g, "");

    if(!telefono.startsWith("51")){
        telefono = "51" + telefono;
    }

    // 🔥 1. GENERAR PDF PRIMERO
    let html = generarBoletaHTML(venta);
    let contenedor = document.createElement("div");
    contenedor.innerHTML = html;

    let opciones = {
    margin: 0,
    filename: `Boleta-${venta.numero}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: {
        scale: 2,
        useCORS: true
    },
    jsPDF: {
        unit: 'mm',
        format: [80, 250],
        orientation: 'portrait'
    }
};
    // 🔥 2. ABRIR WHATSAPP (SIN ESPERAR PROMESAS)
   let detalle = venta.items.map(p =>
`• ${p.nombre} x${p.cantidad} — S/. ${(p.precio * p.cantidad).toFixed(2)}`
).join("\n");

let mensaje = encodeURIComponent(
`🧾 *INNOVACION TECNOLOGICA*

Hola *${venta.cliente}* 👋

Tu compra ha sido procesada correctamente ✅

📋 *Resumen de compra:*
${detalle}

💰 *Total pagado:* S/. ${venta.total.toFixed(2)}
📅 *Fecha:* ${venta.fecha}
🧾 *Comprobante:* ${venta.numero}

📄 Tu comprobante ya está disponible en formato digital.

🤝 Si necesitas ayuda, estamos para atenderte.
¡Gracias por tu preferencia! 🙌`
);

    setTimeout(() => {
        window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");
    }, 800); // 🔥 pequeño delay estable
}

function enviarCorreo(){

    let correo = "afinnovaciontecnologica@gmail.com";

    let asunto = encodeURIComponent("Boleta de Venta");

    let contenido = document.getElementById("boletaHTML").innerText;

    let cuerpo = encodeURIComponent(
        "Hola,\n\nAdjunto su comprobante:\n\n" +
        contenido +
        "\n\nGracias por su compra."
    );

    let url = `https://mail.google.com/mail/?view=cm&fs=1&to=${correo}&su=${asunto}&body=${cuerpo}`;

    window.open(url, "_blank");
}

function descargarPDFManual(){

    let venta = ventaActual;

    if(!venta){
        mostrarNotificacion("No hay venta","error");
        return;
    }

    let html = generarBoletaHTML(venta);

    let contenedor = document.createElement("div");
    contenedor.innerHTML = html;

    const opciones = {
        margin: 0,
        filename: `Boleta-${venta.numero}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
            scale: 2,
            useCORS: true // 🔥 CLAVE PARA EL LOGO
        },
        jsPDF: {
            unit: 'mm',
            format: [80, 250], // 🔥 TICKET
            orientation: 'portrait'
        }
    };

    html2pdf().from(contenedor).set(opciones).save();
}

function guardarVenta(){

    const cliente = document.getElementById("cliente").value

    if(!cliente || listaProductos.length === 0){
        alert("Faltan datos")
        return
    }

    let ventas = JSON.parse(localStorage.getItem("ventas")) || []
    let contador = Number(localStorage.getItem("contadorBoleta")) || 1

    const total = listaProductos.reduce((acc, p) => acc + p.subtotal, 0)

    const nuevaVenta = {
        numero: "B001-" + String(contador).padStart(8,"0"),
        cliente: cliente,
        fecha: new Date().toLocaleString(),
        total: total,
        productos: listaProductos  // 🔥 ESTO ES LO QUE TE FALTA
    }

    ventas.push(nuevaVenta)

    localStorage.setItem("ventas", JSON.stringify(ventas))
    localStorage.setItem("contadorBoleta", contador + 1)

    alert("Venta guardada correctamente")

    // limpiar
    listaProductos = []
    document.getElementById("cliente").value = ""
    renderTabla()
}