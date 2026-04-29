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
🔐 ROL
=============================== */
const rol = localStorage.getItem("rol");
if(!rol){
    window.location.href = "../index.html";
}

/* ===============================
📦 STORAGE
=============================== */
let productos = JSON.parse(localStorage.getItem("productos")) || [];
let categorias = JSON.parse(localStorage.getItem("categorias")) || categoriasBase;

localStorage.setItem("categorias", JSON.stringify(categorias));

/* ===============================
🎯 ELEMENTOS
=============================== */
let selectCategoria;
let selectSubcategoria;

const nombre = document.getElementById("nombre");
const descripcion = document.getElementById("descripcion");
const precio = document.getElementById("precio");
const stock = document.getElementById("stock");
const imagen = document.getElementById("imagen");
const tabla = document.getElementById("tablaProductos");
const buscar = document.getElementById("buscar");
const preview = document.getElementById("previewImg");

/* ===============================
🧠 ESTADO
=============================== */
let editandoIndex = null;

/* ===============================
🚀 INIT
=============================== */
document.addEventListener("DOMContentLoaded", () => {

    selectCategoria = document.getElementById("categoria");
    selectSubcategoria = document.getElementById("subcategoria");

    cargarCategorias();
    activarCambioCategoria();
    render();

    document.getElementById("btnGuardar").addEventListener("click", guardarProducto);
    buscar.addEventListener("keyup", e => render(e.target.value));
});

/* ===============================
📂 CATEGORÍAS
=============================== */
function cargarCategorias(){
    selectCategoria.innerHTML = "<option value=''>Categoría</option>";

    categorias.forEach((c, i)=>{
        selectCategoria.innerHTML += `<option value="${i}">${c.nombre}</option>`;
    });
}

function activarCambioCategoria(){
    selectCategoria.addEventListener("change", () => {

        const index = selectCategoria.value;
        selectSubcategoria.innerHTML = "<option value=''>Subcategoría</option>";

        if(index !== ""){
            categorias[index].subcategorias.forEach(sub=>{
                selectSubcategoria.innerHTML += `<option value="${sub}">${sub}</option>`;
            });
        }
    });
}

/* ===============================
💾 GUARDAR
=============================== */
function guardarProducto(){

    if(rol !== "admin"){
        return alert("❌ Solo admin puede guardar");
    }

    const categoriaIndex = selectCategoria.value;

    const precioVal = Number(precio.value);
    const stockVal = Number(stock.value);

    if(
        !nombre.value.trim() ||
        !descripcion.value.trim() ||
        categoriaIndex === "" ||
        !selectSubcategoria.value ||
        precioVal <= 0 ||
        isNaN(precioVal) ||
        stockVal < 0 ||
        isNaN(stockVal)
    ){
        return alert("⚠️ Completa correctamente los campos");
    }

    const categoriaNombre = categorias[categoriaIndex].nombre;

    const procesar = (imgBase64) => {

        const data = {
            nombre: nombre.value.trim(),
            descripcion: descripcion.value.trim(),
            categoria: categoriaNombre,
            subcategoria: selectSubcategoria.value,
            precio: precioVal,
            stock: stockVal,
            imagen: imgBase64
        };

        if(editandoIndex !== null){
            productos[editandoIndex] = data;
            editandoIndex = null;
        } else {
            productos.push(data);
        }

        localStorage.setItem("productos", JSON.stringify(productos));
        limpiar();
        render();
    };

    if(imagen.files[0]){
        const reader = new FileReader();
        reader.onload = e => procesar(e.target.result);
        reader.readAsDataURL(imagen.files[0]);
    } else {
        procesar(productos[editandoIndex]?.imagen || null);
    }
}

/* ===============================
📊 RENDER
=============================== */
function render(filtro = ""){

    tabla.innerHTML = "";

    const lista = productos.filter(p =>
        p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(filtro.toLowerCase()) ||
        p.categoria.toLowerCase().includes(filtro.toLowerCase())
    );

    if(lista.length === 0){
        tabla.innerHTML = `<tr><td colspan="6">Sin productos</td></tr>`;
        return;
    }

    lista.forEach((p, i)=>{
        tabla.innerHTML += `
        <tr>
            <td>${p.nombre}</td>
            <td>${p.descripcion}<br><small>${p.categoria} - ${p.subcategoria}</small></td>
            <td>S/ ${p.precio.toFixed(2)}</td>
            <td>${p.stock}</td>
            <td>${p.imagen ? `<img src="${p.imagen}">` : "Sin imagen"}</td>
            <td>
                ${rol === "admin" ? `
                    <button class="btn editar" onclick="editar(${i})">✏️</button>
                    <button class="btn eliminar" onclick="eliminar(${i})">🗑️</button>
                ` : `Sin permisos`}
            </td>
        </tr>
        `;
    });
}

/* ===============================
✏️ EDITAR
=============================== */
window.editar = (i) => {

    const p = productos[i];

    nombre.value = p.nombre;
    descripcion.value = p.descripcion;
    precio.value = p.precio;
    stock.value = p.stock;

    const index = categorias.findIndex(c => c.nombre === p.categoria);
    selectCategoria.value = index;
    selectCategoria.dispatchEvent(new Event("change"));

    const wait = setInterval(()=>{
        if(selectSubcategoria.options.length > 1){
            selectSubcategoria.value = p.subcategoria;
            clearInterval(wait);
        }
    },10);

    if(p.imagen){
        preview.src = p.imagen;
        preview.style.display = "block";
    }

    editandoIndex = i;
};

/* ===============================
🗑 ELIMINAR
=============================== */
window.eliminar = (i) => {

    if(rol !== "admin"){
        return alert("❌ Sin permiso");
    }

    if(confirm("¿Eliminar producto?")){
        productos.splice(i,1);
        localStorage.setItem("productos", JSON.stringify(productos));
        render();
    }
};

/* ===============================
🧹 LIMPIAR
=============================== */
function limpiar(){
    nombre.value = "";
    descripcion.value = "";
    precio.value = "";
    stock.value = "";
    imagen.value = "";

    selectCategoria.value = "";
    selectSubcategoria.innerHTML = "<option value=''>Subcategoría</option>";

    preview.style.display = "none";
    preview.src = "";
}


