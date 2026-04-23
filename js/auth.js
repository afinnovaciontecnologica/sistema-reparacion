// =========================
// DOM READY
// =========================
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm")
    const userInput = document.getElementById("usuario")
    const passInput = document.getElementById("password")
    const errorMsg = document.getElementById("errorMsg")
    const btn = document.querySelector(".btn-primary")
    const card = document.querySelector(".login-card")
    const toggle = document.querySelector(".btn-toggle")

    // =========================
    // AUTO LOGIN
    // =========================
    const rolGuardado = localStorage.getItem("rol")

    if(rolGuardado && card){
        card.classList.add("hide")

        setTimeout(()=>{
            window.location.href = "/dashboard.html"
        },500)
        return
    }

    // =========================
    // 👁 MOSTRAR / OCULTAR PASSWORD
    // =========================
    if(toggle && passInput){
        toggle.addEventListener("click", () => {
            passInput.type = passInput.type === "password" ? "text" : "password"
        })
    }

    // =========================
    // VALIDACIÓN EN VIVO
    // =========================
    function validarInput(input){
        if(!input) return

        if(input.value.trim() === ""){
            input.classList.add("error")
            input.classList.remove("success")
        } else {
            input.classList.remove("error")
            input.classList.add("success")
        }
    }

    if(userInput){
        userInput.addEventListener("input", () => validarInput(userInput))
    }

    if(passInput){
        passInput.addEventListener("input", () => validarInput(passInput))
    }

    // =========================
    // LOGIN
    // =========================
    if(form){
        form.addEventListener("submit", (e) => {
            e.preventDefault()

            const user = userInput.value.trim()
            const pass = passInput.value.trim()

            if(errorMsg){
                errorMsg.style.display = "none"
            }

            if(user === "" || pass === ""){
                if(errorMsg){
                    errorMsg.textContent = "⚠ Completa todos los campos"
                    errorMsg.style.display = "block"
                }
                return
            }

            if(btn){
                btn.classList.add("loading")
            }

            setTimeout(() => {

                let rol = ""

                // 🔐 USUARIOS
                if(user === "admin" && pass === "admin12345"){
                    rol = "admin"
                } 
                else if(user === "empleado" && pass === "12345"){
                    rol = "empleado"
                }

                if(rol !== ""){
                    localStorage.setItem("rol", rol)

                    if(card){
                        card.classList.add("hide")
                    }

                    setTimeout(()=>{
                        window.location.href = "/dashboard.html"
                    },500)

                } else {
                    if(errorMsg){
                        errorMsg.textContent = "❌ Usuario o contraseña incorrectos"
                        errorMsg.style.display = "block"
                    }

                    if(passInput){
                        passInput.classList.add("error")
                    }

                    if(btn){
                        btn.classList.remove("loading")
                    }
                }

            }, 1000)

        })
    }

})


// =========================
// CANVAS ANIMADO
// =========================
const canvas = document.getElementById("bgCanvas")

if(canvas){

    const ctx = canvas.getContext("2d")

    function resizeCanvas(){
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }

    resizeCanvas()

    let particles = []

    function initParticles(){
        particles = []

        for(let i = 0; i < 60; i++){
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2 + 0.5,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.5
            })
        }
    }

    initParticles()

    function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        particles.forEach(p => {

            ctx.beginPath()
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(59,130,246,0.5)"
            ctx.fill()

            p.x += p.dx
            p.y += p.dy

            if(p.x < 0 || p.x > canvas.width) p.dx *= -1
            if(p.y < 0 || p.y > canvas.height) p.dy *= -1
        })

        requestAnimationFrame(draw)
    }

    draw()

    window.addEventListener("resize", () => {
        resizeCanvas()
        initParticles()
    })
}


// =========================
// LOGOUT GLOBAL
// =========================
function logout(){
    localStorage.removeItem("rol")
    window.location.href = "/login.html"
}





javascript
import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================
// LOGIN
// =========================
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

    if(!form) return;

    form.addEventListener("submit", async (e)=>{
        e.preventDefault();

        const email = document.getElementById("usuario").value;
        const password = document.getElementById("password").value;

        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await obtenerRol(user);

        }catch(error){
            alert("❌ Credenciales incorrectas");
        }
    });

});

// =========================
// OBTENER ROL
// =========================
async function obtenerRol(user){

    try{
        const ref = doc(db, "usuarios", user.email);
        const snap = await getDoc(ref);

        if(snap.exists()){

            const rol = snap.data().rol;

            // 🔥 guardas rol
            localStorage.setItem("rol", rol);

            // 🔥 redirige
            window.location.href = "/dashboard.html";

        }else{
            alert("❌ Usuario sin rol asignado");
        }

    }catch(error){
        console.error(error);
        alert("Error obteniendo rol");
    }
}

