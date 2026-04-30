// ======================
// DATA
// ======================
let reparaciones = JSON.parse(localStorage.getItem("reparaciones")) || []
let clientes = JSON.parse(localStorage.getItem("clientes")) || []
let editIndex = null
let busquedaOrden = ""
// ======================
// SERVICIOS POR TIPO 🔥
// ======================
const serviciosPorTipo = {

    "PC": [
        "Mantenimiento preventivo (limpieza interna)",
        "Formateo e instalación de sistema operativo",
        "Instalación de programas (Office, Utilitarios, etc.)",
        "Instalación de programas (Ingenieria)",
        "Instalación de programas (Diseño)",
        "Instalacion de Antivirus (Nod32)",
        "Instalacion de Antivirus (Kasperky)",
        "Instalacion de Antivirus (McAfee)",
        "Eliminación de virus / malware",
        "Optimización de rendimiento",
        "Armado de PC (ensamblaje)",
        "Cambio de disco duro / SSD /M.2 (SATA o NVMe/PCIe)",
        "Instalación o cambio de RAM (DDR3,DDR4,DDR5)",
        "Fallo de fuente de poder",
        "Problemas de encendido",
        "Problemas de placa madre",
        "Instalación de tarjeta gráfica",
        "Problemas de video (no da imagen)",
        "Recuperación de datos",
        "Otros"
    ],

    "Laptop": [
        "Mantenimiento preventivo (limpieza interna)",
        "Cambio de pasta térmica",
        "Formateo e instalación de Sistema Operativo",
        "Instalación de programas (Office, Utilitarios, etc.)",
        "Instalación de programas (Ingenieria)",
        "Instalación de programas (Diseño)",
        "Instalacion de Antivirus (Nod32)",
        "Instalacion de Antivirus (Kasperky)",
        "Instalacion de Antivirus (McAfee)",
        "Eliminación de virus / malware",
        "Optimización del sistema (lento)",
        "Cambio de disco duro / SSD /M.2 (SATA o NVMe/PCIe)",
        "Ampliación de memoria RAM (DDR3,DDR4,DDR5)",
        "Reparacion de Placa",
        "Reparación de teclado",
        "Cambio de batería",
        "Reparación de pantalla",
        "Reparación de Cover",
        "Reparación de Bisagra",
        "Problemas de encendido",
        "Fallo de ventilador (sobrecalentamiento)",
        "Recuperación de datos",
        "Problemas de carga (jack de energía)",
        "Otros"
    ],

    "Impresora": [
        "Mantenimiento general (limpieza)",
        "Limpieza de cabezales",
        "Remplazo de Cabezal Epson",
        "Remplazo de Cabezal Brother",
        "Remplzo de Cabezal HP (Black o Tricolor)",
        "Remplazo de Cabezal Canon (Black o Tricolor)",
        "Remplazo Kit de Rodillos Epson",
        "Remplazo kit de Rodillos Brother",
        "Remplazo kit de Rodillos HP",
        "Remplazo Kit de Rodillos Canon",
        "Remplazo de Caja de Mantenimento Epson",
        "Remplazo de Caja de Manteniminto Brother",
        "Remplazo de Caja de Mantenimento HP",
        "Remplazo de Caja de Manteniminto Canon",
        "Remplazo de Almuadillas Epson",
        "Remplazo de Almuadillas Brother",
        "Remplazo de Almuadillas Canon",
        "Reset Contador Epson",
        "Reset Contador Canon",
        "Remplazo de Partes",
        "Reparacion de Placa Logica",
        "Instalación de impresora",
        "Configuración en red / WiFi",
        "No imprime / error de impresión",
        "Atasco de papel",
        "Problemas de tinta (no reconoce cartucho)",
        "Recarga de tinta",
        "Lavado de tanques - Damper",
        "Cambio de cartuchos",
        "Impresión borrosa o con líneas",
        "Problemas de conexión USB / red",
        "Otros"
    ],

    "Celular": [
        "Cambio de pantalla",
        "Cambio de batería",
        "Formateo / restauración",
        "Eliminación de virus",
        "Problemas de carga",
        "Cambio de pin de carga",
        "Problemas de encendido",
        "Actualización de software",
        "Flasheo de equipo",
        "Problemas de señal",
        "Quitar Cuenta Gmail",
        "Fallo de micrófono o parlante",
        "Recuperación de datos",
        "Instalación de aplicaciones"
    ],

    "Tablet": [
        "Cambio de pantalla",
        "Cambio de batería",
        "Formateo / restauración",
        "Instalación de aplicaciones",
        "Problemas de carga",
        "Cambio de pin de carga",
        "Problemas de encendido",
        "Actualización de sistema",
        "Lentitud del sistema",
        "Eliminación de virus",
        "Problemas táctiles (pantalla no responde)"
    ]
}

// ======================
// MARCAS
// ======================
const marcasPorTipo = {
    "Laptop": ["HP","Lenovo","Dell","Asus","Acer","Apple"],
    "PC": ["HP","Dell","Lenovo","Asus","Acer"],
    "Impresora": ["HP","Epson","Canon","Brother"],
    "Celular": ["Samsung","Xiaomi","Apple"],
    "Tablet": ["Samsung","Apple","Lenovo"]
}

// ======================
// FECHAS
// ======================
function hoy(){
    return new Date().toISOString().split("T")[0]
}

function dias(inicio, fin){

    if(!inicio) return "-"

    let fechaInicio = new Date(inicio)
    let fechaFin = fin ? new Date(fin) : new Date()

    let diferencia = Math.ceil((fechaFin - fechaInicio) / (1000*60*60*24))

    return diferencia < 0 ? 0 : diferencia
}

// ======================
// CLIENTES
// ======================
function cargarClientes(filtro = ""){
    const select = document.getElementById("cliente")
    const mensaje = document.getElementById("mensajeCliente")

    select.innerHTML = `<option value="">Seleccionar cliente</option>`

    let texto = filtro.toLowerCase().trim()

    let filtrados = clientes
        .map((c,i)=>({...c, indexReal:i}))
        .filter(c => {
            return (
                c.nombre.toLowerCase().includes(texto) ||
                (c.telefono || "").toLowerCase().includes(texto) ||
                (c.correo || "").toLowerCase().includes(texto)
            )
        })

    if(texto && filtrados.length === 0){
        mensaje.textContent = "❌ Cliente no encontrado"
    }else{
        mensaje.textContent = ""
    }

    filtrados.forEach(c=>{
        select.innerHTML += `
        <option value="${c.indexReal}">
        ${c.nombre}
        </option>`
    })
}

function mostrarDatosCliente(index){
    const telefono = document.getElementById("telefonoCliente")
    const correo = document.getElementById("correoCliente")

    if(index === ""){
        telefono.textContent = "-"
        correo.textContent = "-"
        return
    }

    let c = clientes[index]
    telefono.textContent = c.telefono || "-"
    correo.textContent = c.correo || "-"
}

// ======================
// SERVICIOS 🔥
// ======================
function cargarServicios(tipo){
    const contenedor = document.getElementById("listaServicios")
    contenedor.innerHTML = ""

    if(!serviciosPorTipo[tipo]){
        contenedor.innerHTML = "<p>Seleccione tipo de equipo</p>"
        return
    }

    serviciosPorTipo[tipo].forEach(servicio=>{
        const label = document.createElement("label")

        label.innerHTML = `
            <input type="checkbox" value="${servicio}">
            ${servicio}
        `

        label.querySelector("input")
        .addEventListener("change", actualizarResumen)

        contenedor.appendChild(label)
    })
}

function obtenerServicios(){
    return [...document.querySelectorAll("#listaServicios input:checked")]
        .map(s => s.value)
}

function actualizarResumen(){
    document.getElementById("solucion").value =
    obtenerServicios().map(s => "• " + s).join("\n")
}

function seleccionarTodo(){
    document.querySelectorAll("#listaServicios input")
    .forEach(c => c.checked = true)

    actualizarResumen()
}

function limpiarServicios(){
    document.querySelectorAll("#listaServicios input")
    .forEach(c => c.checked = false)

    actualizarResumen()
}

// ======================
// MARCAS
// ======================
function cargarMarcas(tipo){
    const select = document.getElementById("marca")
    select.innerHTML = '<option value="">Seleccione marca</option>'

    if(!marcasPorTipo[tipo]) return

    marcasPorTipo[tipo].forEach(m=>{
        select.innerHTML += `<option>${m}</option>`
    })
}



// ======================
// GUARDAR
// ======================
function guardarReparacion(){
    
    const i = document.getElementById("cliente").value
    if(i === "") return alert("Selecciona cliente")

    const tipo = document.getElementById("tipoEquipo").value
    if(!tipo) return alert("Selecciona tipo de equipo")

    const c = clientes[i]

    

   let obj = {
    orden: generarOrden(),
    cliente: `${c.nombre}|${c.telefono}|${c.correo||""}`,
    tipo: document.getElementById("tipoEquipo").value,
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    estetica: document.getElementById("estetica").value,
    accesorios: obtenerAccesorios(),
    
    servicios: obtenerServicios(),
    solucion: document.getElementById("solucion").value,
    estado: document.getElementById("estado").value,
    costo: Number(document.getElementById("costo").value) || 0,
    ingreso: hoy(),
    salida: document.getElementById("estado").value === "Terminado" ? hoy() : "",

    tecnico: document.getElementById("tecnico")?.value || "No asignado",
    garantia: document.getElementById("garantia")?.value || ""
}


    // ✅ VALIDAR ANTES DE GUARDAR
if(obj.estado === "Terminado" && obj.costo === 0){
    alert("⚠️ Debes ingresar el costo del servicio")
    return
}

// ✅ RECIÉN GUARDAR
if(editIndex !== null){
    reparaciones[editIndex] = obj
    editIndex = null
}else{
    reparaciones.push(obj)
}
// ✅ AQUÍ SÍ VA
    mostrarControl(obj)

    resetFormulario()
    mostrar()
    actualizarContadores()
}


// ======================
// MOSTRAR
// ======================
function mostrar(){
    const tabla = document.getElementById("tablaReparaciones")
    tabla.innerHTML = ""

    reparaciones
    .filter(r => {
    let cumpleEstado = !filtroActual || r.estado === filtroActual
    let texto = busquedaOrden.toLowerCase()

    let cumpleBusqueda = !texto ||

    (r.orden || "").toLowerCase().includes(texto) ||
    (r.cliente || "").toLowerCase().includes(texto) ||
    (r.tipo || "").toLowerCase().includes(texto) ||
    (r.marca || "").toLowerCase().includes(texto) ||
    (r.modelo || "").toLowerCase().includes(texto) ||
    (r.solucion || "").toLowerCase().includes(texto) ||
    (r.estado || "").toLowerCase().includes(texto) ||
    (r.ingreso || "").toLowerCase().includes(texto)

    return cumpleEstado && cumpleBusqueda
    })
    .forEach((r,index)=>{
        let [nombre] = r.cliente.split("|")

        tabla.innerHTML += `
        <tr class="${getClaseDias(dias(r.ingreso, r.salida))}">
        <td>${nombre}</td>
        <td>${r.tipo}</td>
        <td>${r.marca} ${r.modelo}</td>
        <td>${(r.servicios || []).join(", ")}</td>

        <td>
         ${
        r.costo === 0 
        ? `<input type="number" placeholder="Costo"
            onchange="actualizarCosto(${index}, this.value)">`
        : `S/. ${r.costo}`
        }
        </td>
        <td>
            <select onchange="cambiarEstado(${index})">
                <option ${r.estado=="Pendiente"?"selected":""}>Pendiente</option>
                <option value="En proceso" ${r.estado=="En proceso"?"selected":""}>
                Diagnóstico en curso
                </option>
                <option ${r.estado=="Terminado"?"selected":""}>Terminado</option>
            </select>
        </td>

        <td>${r.ingreso}</td>
        <td>${r.salida||"-"}</td>
        <td>${dias(r.ingreso, r.salida)}</td>

        <td>
    <button class="btn-control ${getEstadoClase(r.estado)}"
    onclick="verControl(${index})">📄</button><button 
    
    onclick="editarRegistro(${index})">✏️</button><button onclick="eliminarRegistro(${index})">🗑️</button>
        
    </td>

        </tr>`
    })

    // 🔥 ESTA LÍNEA FALTABA
    actualizarContadores()
}

// ======================
// LIMPIAR
// ======================
function limpiar(){

    // 🔹 LIMPIAR CLIENTE
    document.getElementById("cliente").value = ""
    document.getElementById("buscarCliente").value = ""
    document.getElementById("telefonoCliente").textContent = "-"
    document.getElementById("correoCliente").textContent = "-"

    // 🔹 LIMPIAR CAMPOS
    document.getElementById("modelo").value = ""
    document.getElementById("estetica").value = ""
    document.getElementById("solucion").value = ""
    document.getElementById("costo").value = ""
    document.getElementById("tecnico").value = ""
    document.getElementById("garantia").value = ""

    // 🔹 SELECTS
    document.getElementById("tipoEquipo").value = ""
    document.getElementById("marca").innerHTML = '<option value="">Seleccione marca</option>'

    // 🔹 CHECKBOX
   document.querySelectorAll(".accesorios-box input")
.forEach(c=>c.checked=false)

    // 🔹 SERVICIOS
    document.getElementById("listaServicios").innerHTML = "<p>Seleccione tipo de equipo</p>"
}



// ======================
// INIT
// ======================
document.addEventListener("DOMContentLoaded", ()=>{
    limpiarRegistrosAntiguos()
    cargarClientes()

    document.getElementById("buscarCliente")
.addEventListener("input", e=>{

    let texto = e.target.value.trim()

    // 🔥 limpiar siempre
    document.getElementById("cliente").value = ""
    document.getElementById("telefonoCliente").textContent = "-"
    document.getElementById("correoCliente").textContent = "-"

    cargarClientes(texto)

    let filtrados = clientes.filter(c => 
        c.nombre.toLowerCase().includes(texto.toLowerCase()) ||
        (c.telefono || "").includes(texto)
    )

    // 🔥 autoselección si hay coincidencia exacta
    if(filtrados.length === 1){
        let index = clientes.indexOf(filtrados[0])
        document.getElementById("cliente").value = index
        mostrarDatosCliente(index)
    }
})

    document.getElementById("cliente")
    .addEventListener("change", e=>{
        mostrarDatosCliente(e.target.value)
        document.getElementById("buscarCliente").value = ""
    })
document.getElementById("tipoEquipo")
.addEventListener("change", e=>{

    const tipo = e.target.value

    console.log("TIPO SELECCIONADO:", tipo)

    if(!tipo) return

    try{

        limpiarDiagnostico()

        cargarMarcas(tipo)
        cargarServicios(tipo)

        const bloqueTintas = document.getElementById("bloqueTintas")

        if(bloqueTintas){
            bloqueTintas.style.display = (tipo === "Impresora") ? "grid" : "none"
        }

    }catch(error){
        console.error("ERROR EN CAMBIO DE EQUIPO:", error)
    }

})

    document.getElementById("buscarOrden")
    .addEventListener("input", e=>{
        busquedaOrden = e.target.value.toLowerCase()
        mostrar()
    })

    // 🔥 AUTO CRECER SOLUCIÓN
    const textarea = document.getElementById("solucion");

    // 🔥 CONTROLAR COSTO SEGÚN ESTADO
const estadoSelect = document.getElementById("estado")

if(estadoSelect){
    estadoSelect.addEventListener("change", controlarCosto)
    controlarCosto()
}

// inicial
if(textarea){
    textarea.addEventListener("input", () => {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    });
}
    // 🔥 ESTO FALTABA
    mostrar()

})




function descargarControlPDF(){

    const elemento = document.querySelector(".ticket-pro")
    const modal = document.getElementById("modalControl")

    if(!elemento){
        alert("No se encontró el ticket")
        return
    }

    // 🔥 PASO CLAVE: forzar visible REAL
    modal.style.display = "block"
    modal.style.position = "static"

    // 🔥 esperar render (CLAVE)
    setTimeout(()=>{

        const alturaPx = elemento.scrollHeight
        const alturaMm = Math.max(alturaPx * 0.2645, 200)

        html2pdf()
        .set({
            margin: 0,
            filename: 'ticket-servicio.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 4,
                useCORS: true,
                scrollY: 0
            },
            jsPDF: {
                unit: 'mm',
                format: [80, alturaMm]
            }
        })
        .from(elemento)
        .save()
        .then(()=>{
            // 🔥 restaurar estado
            modal.style.position = "fixed"
            modal.style.display = ""
        })

    }, 300) // 🔥 tiempo clave
}








function enviarControlWhatsApp(){

    const r = window.controlActual

    if(!r) return alert("No hay control seleccionado")

    let [nombre, telefono] = r.cliente.split("|")

    if(!telefono){
        return alert("Teléfono no válido")
    }

    const numero = telefono.replace(/\D/g,"")

    let texto = `🧾 *CONTROL DE ATENCIÓN*\n\n`
    texto += `👤 ${nombre}\n📱 ${telefono}\n\n`
    texto += `💻 ${r.tipo} ${r.marca} ${r.modelo}\n\n`

    texto += `🛠 Diagnóstico:\n`
    texto += (r.servicios || []).map(s => "• " + s).join("\n")

    texto += `\n\n💰 TOTAL: S/. ${r.costo}`
    texto += `\n📌 Estado: ${r.estado}`

    const url = `https://wa.me/51${numero}?text=${encodeURIComponent(texto)}`

    window.open(url, "_blank")
}

function cerrarControl(){
    document.getElementById("modalControl").classList.remove("active")
}

function mostrarControl(r){

    console.log("CONTROL:", r) // para verificar
    console.log("Generando HTML...")
    const html = generarControlHTML(r)

    document.getElementById("controlVista").innerHTML = html
    document.getElementById("modalControl").classList.add("active")

    // 🔥 GENERAR QR
setTimeout(()=>{

    const qrContainer = document.getElementById("qrTicket")

    if(qrContainer){

        qrContainer.innerHTML = ""

        let [nombre, telefono] = r.cliente.split("|")

        const textoQR = `
Orden: ${r.orden}
Cliente: ${nombre}
Tel: ${telefono}
Equipo: ${r.tipo}
Estado: ${r.estado}
Total: S/. ${r.costo}
        `

        new QRCode(qrContainer, {
            text: textoQR,
            width: 80,
            height: 80
        })
    }

}, 200)
    window.controlActual = r
}

function generarControlHTML(r){

    let [nombre, telefono, correo] = r.cliente.split("|")

    return `
    <div class="ticket-pro">

        <div class="empresa">
           <img src="https://afinnovaciontecnologica.github.io/sistema-reparacion/assets/img/logo.png" class="logo">
            <h2>INNOVACION TECNOLOGICA</h2>
            <p>RUC: 10416270258</p>
            <p>Huaraz - Ancash</p>
            <p>WhatsApp: 948231352</p>
            <p>Email: afinovaciontecnologica@gmail.com</p>
        </div>

        <div class="linea"></div>

        <div class="titulo">
    <h3>CONTROL DE ATENCIÓN</h3>
    <p><strong>N° Orden:</strong> ${r.orden || "-"}</p>
            <p>Ingreso: ${r.ingreso}</p>
            <p>Salida: ${r.salida || "-"}</p>
            <p>Días: ${dias(r.ingreso, r.salida)}</p>
        </div>

        <div class="linea"></div>

        <div class="bloque">
            <p><strong>Cliente:</strong> ${nombre}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Email:</strong> ${correo || "-"}</p>
        </div>

        <div class="linea"></div>

        <div class="bloque">
            <p><strong>Equipo:</strong> ${r.tipo}</p>
            <p><strong>Marca:</strong> ${r.marca}</p>
            <p><strong>Modelo:</strong> ${r.modelo}</p>
            <p><strong>Estado:</strong> ${r.estetica || "-"}</p>
        </div>

        <div class="linea"></div>

        <div class="bloque">
            <strong>ACCESORIOS</strong>
            <p>${(r.accesorios && r.accesorios.length ? r.accesorios.join(", ") : "-")}</p>
        </div>

        <div class="linea"></div>
            <div class="bloque">
            <strong>DIAGNÓSTICO</strong>
            <p>${r.solucion || "-"}</p>
        </div>
        

        <div class="linea"></div>
${r.estado === "Terminado" ? `

<div class="linea"></div>

<div class="bloque">
    <strong>SERVICIOS REALIZADOS</strong>
    <ul>
        ${(r.servicios || []).map(s=>`<li>✔ ${s}</li>`).join("")}
    </ul>
</div>

` : `

<div class="linea"></div>

<div class="bloque">
    <strong>DIAGNÓSTICO EN CURSO</strong>
    <p>El equipo se encuentra en revisión técnica.</p>
</div>

`}

        <div class="linea"></div>

        <div class="bloque">
            <p><strong>Técnico:</strong> ${r.tecnico || "No asignado"}</p>
           ${r.garantia ? `<p><strong>Garantía:</strong> ${r.garantia}</p>` : ""}
        </div>

        <div class="linea"></div>

        <div class="totales">
           
            <div class=  "total"> 💰 TOTAL: S/. ${r.costo}</div>
        </div>

        <div class="estado">
        ${r.estado === "Pendiente" ? "⏳ Recepción registrada" :
             r.estado === "En proceso" ? "🔧 Diagnóstico en revisión" :
             r.estado === "Terminado" ? "✅ Servicio finalizado" :
              r.estado}
        </div>

        <div class="linea"></div>

        <div class="linea"></div>

        <div id="qrTicket" style="text-align:center;"></div>

        <p class="gracias">¡Gracias por confiar en nosotros!</p>

    </div>
    `
}

function resetFormulario(){

    // 🔴 CLIENTE
    document.getElementById("buscarCliente").value = ""
    document.getElementById("cliente").value = ""
    document.getElementById("telefonoCliente").textContent = "-"
    document.getElementById("correoCliente").textContent = "-"
    document.getElementById("mensajeCliente").textContent = ""

    // 🔴 EQUIPO
    document.getElementById("tipoEquipo").value = ""
    document.getElementById("marca").innerHTML = '<option value="">Seleccione marca</option>'
    document.getElementById("modelo").value = ""
    document.getElementById("estetica").value = ""

    // 🔴 TECNICO / GARANTIA
    document.getElementById("tecnico").value = ""
    document.getElementById("garantia").value = ""

    // 🔴 ACCESORIOS
    document.querySelectorAll(".accesorios-box input")
    .forEach(c => c.checked = false)

    // 🔴 SERVICIOS (CHECKBOX + CONTENEDOR)
    document.getElementById("listaServicios").innerHTML = "<p style='color:#94a3b8;'>Seleccione tipo de equipo primero</p>"

    // 🔴 SOLUCIÓN
    document.getElementById("solucion").value = ""

    // 🔴 CONTROL
    document.getElementById("estado").value = "Pendiente"
    document.getElementById("costo").value = ""

    // 🔴 VARIABLES INTERNAS (extra limpio)
    editIndex = null

}

function generarOrden(){

    let año = new Date().getFullYear()

    let correlativo = localStorage.getItem("correlativoOrden")

    if(!correlativo){
        correlativo = 1
    }else{
        correlativo = parseInt(correlativo) + 1
    }

    localStorage.setItem("correlativoOrden", correlativo)

    // Formato 0001
    let numero = correlativo.toString().padStart(4, "0")

    return `ORD-${año}-${numero}`
}

function cambiarEstado(index){

    let select = event.target
    let nuevoEstado = select.value
    let r = reparaciones[index]

    r.estado = nuevoEstado

    if(nuevoEstado === "Terminado" && !r.salida){
        r.salida = hoy()
    }

    if(nuevoEstado !== "Terminado"){
        r.salida = ""
    }

    localStorage.setItem("reparaciones", JSON.stringify(reparaciones))

    mostrar()
    actualizarContadores()
}


function verControl(index){

    let r = reparaciones[index]

    mostrarControl(r)
}

function getEstadoClase(estado){

    if(estado === "Pendiente") return "btn-pendiente"
    if(estado === "En proceso") return "btn-proceso"
    if(estado === "Terminado") return "btn-terminado"

    return ""
}

function actualizarContadores(){

    let p = 0, e = 0, t = 0

    reparaciones.forEach(r=>{
        if(r.estado === "Pendiente") p++
        else if(r.estado === "En proceso") e++
        else if(r.estado === "Terminado") t++
    })

    // 🔒 Validar existencia (evita errores)
    let elP = document.getElementById("cPendiente")
    let elE = document.getElementById("cProceso")
    let elT = document.getElementById("cTerminado")

    if(elP) elP.textContent = p
    if(elE) elE.textContent = e
    if(elT) elT.textContent = t
}

let filtroActual = ""

function filtrarEstado(estado){
    filtroActual = estado
    mostrar()
    
    
}

function getClaseDias(d){

    if(d >= 5) return "urgente"
    if(d >= 3) return "medio"
    return ""
}

function limpiarTodo(){

    let confirmar = confirm("⚠️ Se eliminarán TODAS las reparaciones.\n¿Deseas continuar?")

    if(!confirmar) return

    localStorage.removeItem("reparaciones")

    reparaciones = []

    mostrar()
    actualizarContadores()

    alert("✅ Registro eliminado correctamente")
}

function limpiarRegistrosAntiguos(){

    let hoyFecha = new Date()

    reparaciones = reparaciones.filter(r => {

        let fechaIngreso = new Date(r.ingreso)

        let diferencia = (hoyFecha - fechaIngreso) / (1000*60*60*24)

        return diferencia <= 365 // 1 año
    })

    localStorage.setItem("reparaciones", JSON.stringify(reparaciones))
}

function resetearCorrelativo(){

    if(reparaciones.length > 0){
        alert("⚠️ Debes limpiar registros primero")
        return
    }

    localStorage.removeItem("correlativoOrden")

    alert("✅ Numeración reiniciada")
}

function limpiarDiagnostico(){

    const checks = document.querySelectorAll("#listaServicios input[type='checkbox']")

    if(checks.length){
        checks.forEach(c => c.checked = false)
    }

    const txt = document.getElementById("solucion")

    if(txt){
        txt.value = ""
        txt.style.height = "auto"
    }
}

function obtenerAccesorios(){
    return [...document.querySelectorAll(".accesorios-box input:checked")]
        .map(c => c.value)
}

function controlarCosto(){

    const estado = document.getElementById("estado").value
    const inputCosto = document.getElementById("costo")

    if(estado === "Terminado"){
        inputCosto.disabled = false
        inputCosto.placeholder = "Ingrese total del servicio"
    }else{
        inputCosto.disabled = true
        inputCosto.value = ""
        inputCosto.placeholder = "Disponible al finalizar"
    }
}

function actualizarCosto(index, valor){

    let r = reparaciones[index]

    if(!valor || Number(valor) <= 0){
        alert("Ingrese un costo válido")
        return
    }

    r.costo = Number(valor)

    if(r.estado === "Terminado" && !r.salida){
        r.salida = hoy()
    }

    localStorage.setItem("reparaciones", JSON.stringify(reparaciones))

    mostrar()
}

function editarRegistro(index){

    let r = reparaciones[index]
    editIndex = index

    let [nombre, telefono, correo] = r.cliente.split("|")

    // 🔹 buscar cliente
    let i = clientes.findIndex(c => c.nombre === nombre)

    document.getElementById("cliente").value = i
    mostrarDatosCliente(i)

    document.getElementById("tipoEquipo").value = r.tipo
    cargarMarcas(r.tipo)
    cargarServicios(r.tipo)

    setTimeout(()=>{
        document.getElementById("marca").value = r.marca
    },100)

    document.getElementById("modelo").value = r.modelo
    document.getElementById("estetica").value = r.estetica
    document.getElementById("solucion").value = r.solucion
    document.getElementById("estado").value = r.estado
    document.getElementById("costo").value = r.costo

    controlarCosto()
}

function eliminarRegistro(index){

    let ok = confirm("¿Eliminar este registro?")
    if(!ok) return

    reparaciones.splice(index,1)
    localStorage.setItem("reparaciones", JSON.stringify(reparaciones))

    mostrar()
    actualizarContadores()
}

function resetearOrden(){

    let ok = confirm("⚠️ Se reiniciará el contador de órdenes\n¿Continuar?")
    if(!ok) return

    localStorage.removeItem("correlativoOrden")

    alert("✅ Contador reiniciado")
}