javascript
/* ===============================
📦 DATOS BASE
=============================== */
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

/* ===============================
🔐 ROL + PROTECCIÓN
=============================== */
const rol = localStorage.getItem("rol");

if(!rol){
    window.location.href = "/login.html";
}

/* ===============================
📦 STORAGE SEGURO
=============================== */
let productos = [];
let categorias = [];

try{
    productos = JSON.parse(localStorage.getItem("productos")) || [];
}catch(e){
    productos = [];
}

try{
    categorias = JSON.parse(localStorage.getItem("categorias")) || categoriasBase;
}catch(e){
    categorias = categoriasBase;
}

localStorage.setItem("categorias", JSON.stringify(categorias));

/* ===============================
🎯 ELEMENTOS
=============================== */
const selectCategoria = document.getElementById("categoria");
const selectSubcategoria = document.getElementById("subcategoria");

/* ===============================
🧠 ESTADO
=============================== */
let editandoIndex = null;

/* ===============================
🚀 CARGAR CATEGORÍAS
=============================== */
function cargarCategorias(){
if(!selectCategoria || !selectSubcategoria) return;

selectCategoria.innerHTML = "<option value=''>Categoría</option>";
selectSubcategoria.innerHTML = "<option value=''>Subcategoría</option>";

categorias.forEach((c, i)=>{
    selectCategoria.innerHTML += `<option value="${i}">${c.nombre}</option>`;
});
}

/* ===============================
🔄 CAMBIO CATEGORÍA
=============================== */
if(selectCategoria){
selectCategoria.addEventListener("change", function(){

let index = this.value;
selectSubcategoria.innerHTML = "<option value=''>Subcategoría</option>";

if(index !== ""){
    categorias[index].subcategorias.forEach(sub=>{
        selectSubcategoria.innerHTML += `<option value="${sub}">${sub}</option>`;
    });
}

});
}

/* ===============================
💾 GUARDAR / EDITAR
=============================== */
function guardarProducto(){

if(rol !== "admin") return alert("❌ Solo admin puede guardar");

let nombre = document.getElementById("nombre").value.trim();
let descripcion = document.getElementById("descripcion").value.trim();
let categoriaIndex = selectCategoria.value;
let subcategoria = selectSubcategoria.value;
let precio = Number(document.getElementById("precio").value);
let stock = Number(document.getElementById("stock").value);
let imagenInput = document.getElementById("imagen");
let imagen = imagenInput.files[0];

if(!nombre || !descripcion || categoriaIndex === "" || !subcategoria || !precio || !stock){
    return alert("⚠️ Completa todos los campos");
}

if(precio <= 0 || stock < 0){
    return alert("⚠️ Datos inválidos");
}

let categoria = categorias[categoriaIndex].nombre;

if(editandoIndex !== null){

    let producto = productos[editandoIndex];

    producto.nombre = nombre;
    producto.descripcion = descripcion;
    producto.categoria = categoria;
    producto.subcategoria = subcategoria;
    producto.precio = precio;
    producto.stock = stock;

    if(imagen){
        let reader = new FileReader();
        reader.onload = e=>{
            producto.imagen = e.target.result;
            guardarFinal();
        };
        reader.readAsDataURL(imagen);
    } else {
        guardarFinal();
    }

} else {

    if(!imagen){
        return alert("⚠️ Debes subir una imagen");
    }

    let reader = new FileReader();

    reader.onload = e=>{
        productos.push({
            nombre,
            descripcion,
            categoria,
            subcategoria,
            precio,
            stock,
            imagen: e.target.result
        });
        guardarFinal();
    };

    reader.readAsDataURL(imagen);
}
}

/* ===============================
💾 FINAL GUARDADO
=============================== */
function guardarFinal(){
localStorage.setItem("productos", JSON.stringify(productos));
mostrarProductos();
limpiarFormulario();
editandoIndex = null;
}

/* ===============================
📊 MOSTRAR PRODUCTOS
=============================== */
function mostrarProductos(lista = productos){

let tabla = document.getElementById("tablaProductos");
if(!tabla) return;

tabla.innerHTML = "";

if(lista.length === 0){
    tabla.innerHTML = `<tr><td colspan="6">Sin productos</td></tr>`;
    return;
}

lista.forEach((p, i) => {
    tabla.innerHTML += `
    <tr>
        <td>${p.nombre}</td>
        <td>${p.descripcion}<br><small>${p.categoria} - ${p.subcategoria}</small></td>
        <td>S/ ${parseFloat(p.precio).toFixed(2)}</td>
        <td>${p.stock}</td>
        <td><img src="${p.imagen}" style="width:60px;height:60px;object-fit:cover;"></td>
        <td>
            ${rol === "admin" ? `
                <button onclick="editar(${i})">✏️</button>
                <button onclick="eliminar(${i})">🗑️</button>
            ` : `<span>Sin permisos</span>`}
        </td>
    </tr>
    `;
});
}

/* ===============================
❌ ELIMINAR
=============================== */
function eliminar(i){
if(rol !== "admin") return alert("❌ Sin permiso");

if(confirm("¿Eliminar este producto?")){
    productos.splice(i,1);
    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
}
}

/* ===============================
✏️ EDITAR
=============================== */
function editar(i){

if(rol !== "admin") return alert("❌ Sin permiso");

let p = productos[i];

document.getElementById("nombre").value = p.nombre;
document.getElementById("descripcion").value = p.descripcion;
document.getElementById("precio").value = p.precio;
document.getElementById("stock").value = p.stock;

let index = categorias.findIndex(c => c.nombre === p.categoria);

selectCategoria.value = index;
selectCategoria.dispatchEvent(new Event("change"));

setTimeout(()=>{
    selectSubcategoria.value = p.subcategoria;
}, 50);

editandoIndex = i;
}

/* ===============================
🔍 BUSCAR
=============================== */
function buscarProducto(){

let texto = document.getElementById("buscar").value.toLowerCase();

let filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(texto) ||
    p.descripcion.toLowerCase().includes(texto) ||
    p.categoria.toLowerCase().includes(texto) ||
    p.subcategoria.toLowerCase().includes(texto)
);

mostrarProductos(filtrados);
}

/* ===============================
🧹 LIMPIAR
=============================== */
function limpiarFormulario(){

document.getElementById("nombre").value = "";
document.getElementById("descripcion").value = "";
document.getElementById("precio").value = "";
document.getElementById("stock").value = "";
document.getElementById("imagen").value = "";

selectCategoria.value = "";
selectSubcategoria.innerHTML = "<option value=''>Subcategoría</option>";
}

/* ===============================
🔥 INIT
=============================== */
document.addEventListener("DOMContentLoaded", () => {
cargarCategorias();
mostrarProductos();
});


