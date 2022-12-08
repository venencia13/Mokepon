const h1Container = document.getElementById('h1-container')
const botonMascotaJugador = document.getElementById('boton-mascota')
const botonReinicar = document.getElementById('boton-reiniciar')
const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataques')
const sectionReinicar = document.getElementById('reiniciar')
const sectionSeleccionarMascota = document.getElementById('seleccionar-mascota')
const divResultado = document.getElementById('resultado')
const divAtaqueJugador = document.getElementById('ataques-jugador')
const divAtaqueEnemigo = document.getElementById('ataques-enemigo')
const divResultadoFinal = document.getElementById('resultado-final')
const spanVidasJugador = document.getElementById('vidas-jugador')
const spanVidasEnemigo = document.getElementById('vidas-enemigo')
const spanMascotaJugador = document.getElementById('mascota-jugador')
const spanMascotaEnemigo = document.getElementById('mascota-enemigo')
const contenedorTarjetas = document.getElementById('contenedor-tarjetas')
const contenedorAtaques = document.getElementById('contenedor-ataques')
const sectionMapa = document.getElementById('section-mapa')
const mapa = document.getElementById('mapa')
const anchoMaximoDelMapa = 350

let jugadorId = null
let inputHipodoge
let inputCapipepo
let inputRatigueya
let mokepones = []
let opcionDeMokepones
let opcionDeAtaques
let mascotaJugador
let mascotaJugadorObjeto
let ataqueEnemigo = []
let ataquesMokeponEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let botonFuego
let botonAgua
let botonPlanta
let botones =[]
let ataqueJugador = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let lienzo = mapa.getContext('2d')
let intervalo
let mapaBackground = new Image()
mapaBackground.src = './assests/mokemap.webp'
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20


if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20    
}
alturaQueBuscamos = anchoDelMapa * 600 / 800
mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos

class Mokepon{
    constructor(nombre, foto, vidas, head, id = null){
        this.nombre = nombre
        this.foto = foto
        this.vidas = vidas
        this.ataques = []
        this.ancho = 40
        this.alto = 40
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = head
        this.velocidadX = 0
        this.velocidadY = 0
        this.id = id
    }

    pintarMokepon(){
        lienzo.drawImage(this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto)
    }
}

let hipodoge = new Mokepon('Hipodoge', './assests/mokepons_mokepon_hipodoge_attack.webp', 5, "./assests/hipodoge.webp");
let capipepo = new Mokepon('Capipepo', './assests/mokepons_mokepon_capipepo_attack.webp', 5, "./assests/capipepo.webp");
let ratigueya = new Mokepon('Ratigueya', './assests/mokepons_mokepon_ratigueya_attack.webp', 5, "./assests/ratigueya.webp");

mokepones.push(hipodoge, capipepo, ratigueya)

const HIPODOGE_ATAQUES = [
    {nombre: '💧', id: 'boton-agua', numero: 1},
    {nombre: '💧', id: 'boton-agua', numero: 2},
    {nombre: '💧', id: 'boton-agua', numero: 3},
    {nombre: '🔥', id: 'boton-fuego', numero: 4},
    {nombre: '🌱', id: 'boton-planta', numero: 5}
]

hipodoge.ataques.push(...HIPODOGE_ATAQUES)

const CAPIPEPO_ATAQUES = [
    {nombre: '🌱', id: 'boton-planta', numero: 1},
    {nombre: '🌱', id: 'boton-planta', numero: 2},
    {nombre: '🌱', id: 'boton-planta', numero: 3},
    {nombre: '💧', id: 'boton-agua', numero: 4},
    {nombre: '🔥', id: 'boton-fuego', numero: 5}
]

capipepo.ataques.push(...CAPIPEPO_ATAQUES)

const RATIGUEYA_ATAQUES = [
    {nombre: '🔥', id: 'boton-fuego', numero: 1},
    {nombre: '🔥', id: 'boton-fuego', numero: 2},
    {nombre: '🔥', id: 'boton-fuego', numero: 3},
    {nombre: '💧', id: 'boton-agua', numero: 4},
    {nombre: '🌱', id: 'boton-planta', numero: 5}
]

ratigueya.ataques.push(...RATIGUEYA_ATAQUES)

function iniciarJuego() {
    sectionSeleccionarAtaque.style.display = 'none'
    sectionReinicar.style.display = 'none'
    sectionMapa.style.display = 'none'

    mokepones.forEach((mokepon) => {
        opcionDeMokepones = `
            <input type="radio" name="mascota" id=${mokepon.nombre} />
            <label class="type-button__label" for=${mokepon.nombre} >
                <p>${mokepon.nombre}</p>
                <img src=${mokepon.foto} alt=${mokepon.nombre}>
            </label>
            `
    contenedorTarjetas.innerHTML += opcionDeMokepones

    inputHipodoge = document.getElementById('Hipodoge')
    inputCapipepo = document.getElementById('Capipepo')
    inputRatigueya = document.getElementById('Ratigueya')
    })
    
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
    botonReinicar.addEventListener('click', reinicarJuego)

    unirseAlJuego()
}

function unirseAlJuego() {
    fetch("http://localhost:8080/unirse")
        .then(function (res) {
            if (res.ok) {
                res.text()
                    .then(function(respuesta){
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
            }
        })
}

function seleccionarMascotaJugador() {
    sectionSeleccionarMascota.style.display = 'none'
    
    
    botonReinicar.disabled = true
    h1Container.style.alignItems = 'center'
    

    if (inputHipodoge.checked){
        spanMascotaJugador.innerHTML = inputHipodoge.id
        mascotaJugador = inputHipodoge.id
    } else if(inputCapipepo.checked){
        spanMascotaJugador.innerHTML = inputCapipepo.id
        mascotaJugador = inputCapipepo.id
    } else if(inputRatigueya.checked){
        spanMascotaJugador.innerHTML = inputRatigueya.id
        mascotaJugador = inputRatigueya.id
    } else{
        alert("no has seleccionado nada")
    }

    seleccionarMokepon(mascotaJugador)

    extraerAtaques(mascotaJugador)
    iniciarMapa()
}

function seleccionarMokepon(mascotaJugador){
    fetch(`http://localhost:8080/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        })
    })
}

function extraerAtaques(mascotaJugador){
    let ataques
    for (let i = 0; i < mokepones.length; i++) {
        if(mascotaJugador === mokepones[i].nombre){
            ataques = mokepones[i].ataques
        }
        
    }
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques){
    ataques.forEach((ataque) => {
        opcionDeAtaques = `
        <button id=${ataque.id} class="type-button BAtaque">${ataque.nombre} </button>
        `

        contenedorAtaques.innerHTML += opcionDeAtaques
    })
    botonFuego = document.getElementById('boton-fuego')
    botonAgua = document.getElementById('boton-agua')
    botonPlanta = document.getElementById('boton-planta')
    botones = document.querySelectorAll('.BAtaque')
}

function secuenciaAtaque(){
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            if (e.target.textContent === '🔥 ') {
                ataqueJugador.push('🔥')
                boton.style.background = 'rgba(30, 30, 30, 0.5)'
                boton.disabled = true
            } else if (e.target.textContent === '💧 '){
                ataqueJugador.push('💧')
                boton.style.background = 'rgba(30, 30, 30, 0.5)'
                boton.disabled = true
            } else {
                ataqueJugador.push('🌱')
                boton.style.background = 'rgba(30, 30, 30, 0.5)'
                boton.disabled = true
            }
            ataqueAleatorioEnemigo()
        })
    })
}

function seleccionarMascotaEnemigo(enemigo){
    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesMokeponEnemigo = enemigo.ataques
    
    secuenciaAtaque()
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * ( max - min + 1 ) + min)
}

function ataqueAleatorioEnemigo(){
    let ataqueAleatorio = aleatorio(0,ataquesMokeponEnemigo.length -1)

    ataqueEnemigo.push(ataquesMokeponEnemigo[ataqueAleatorio].nombre)

    ataquesMokeponEnemigo.splice(ataqueAleatorio, 1)
    
    iniciarPelea()
}

function iniciarPelea(){
    if (ataqueJugador.length === 5) {
        combate()
    }
}

function indexAmbosOponentes(jugador, enemigo){
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function combate(){
    for (let index = 0; index < ataqueJugador.length; index++) {
        if(ataqueJugador[index] === ataqueEnemigo[index]){
            indexAmbosOponentes(index, index)
            crearMensaje("EMPATE 🤝")
        } else if(ataqueJugador[index] === '🔥' && ataqueEnemigo[index] === '🌱'){
            indexAmbosOponentes(index, index)
            crearMensaje("GANASTE 🎉")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else if(ataqueJugador[index] === '💧' && ataqueEnemigo[index] === '🔥'){
            indexAmbosOponentes(index, index)
            crearMensaje("GANASTE 🎉")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else if(ataqueJugador[index] === '🌱' && ataqueEnemigo[index] === '💧'){
            indexAmbosOponentes(index, index)
            crearMensaje("GANASTE 🎉")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else {
            indexAmbosOponentes(index, index)
            crearMensaje('PERDISTE 💩')
            victoriasEnemigo++
            spanVidasEnemigo.innerHTML = victoriasEnemigo
        }
    }

    revisarVidas()
}

function crearMensaje(resultado){
    let nuevoAtaqueJugador = document.createElement('p')
    let nuevoAtaqueEnemigo = document.createElement('p')

    divResultado.innerHTML = resultado
    nuevoAtaqueJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueEnemigo.innerHTML = indexAtaqueEnemigo
    
    divAtaqueJugador.appendChild(nuevoAtaqueJugador)
    divAtaqueEnemigo.appendChild(nuevoAtaqueEnemigo)
}

function crearMensajeFinal(resultadoFinal){
    divResultadoFinal.innerHTML = resultadoFinal
    botonReinicar.disabled = false
}

function revisarVidas(){
    if(victoriasJugador === victoriasEnemigo){
        crearMensajeFinal("EMPATASTE EL DUELO")
    } else if(victoriasJugador > victoriasEnemigo){
        crearMensajeFinal("GANASTE EL DUELO")
    } else {
        crearMensajeFinal("PERDISTE EL DUELO")
    }
}

function reinicarJuego(){
    location.reload()
}

function pintarCanvas(){

    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX
    mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height)
    
    mascotaJugadorObjeto.pintarMokepon()

    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)

   // if(mascotaJugadorObjeto.velocidadX !== 0 ||
     //  mascotaJugadorObjeto.velocidadY !== 0){
      //  revisarColision(hipodogeEnemigo)
      //  revisarColision(capipepoEnemigo)
      //  revisarColision(ratigueyaEnemigo)
  //  }
}

function enviarPosicion(x, y){
    fetch(`http://localhost:8080/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function(res)
    {if(res.ok){
        res.json()
        .then(function({enemigos}){
        console.log(enemigos)
        enemigos.forEach(function(enemigo){
            let mokeponEnemigo = null
            const mokeponNombre = enemigo.mokepon.nombre || ""
            if(mokeponNombre === "Hipodoge"){
                mokeponEnemigo = new Mokepon('Hipodoge','./assets/mokepons_mokepon_hipodoge_attack.png',5,'./assets/hipodoge.png')
            } else if(mokeponNombre === "Capipepo"){
                mokeponEnemigo = new Mokepon('Capipepo','./assets/mokepons_mokepon_capipepo_attack.png',5,'./assets/capipepo.png')
            } else if(mokeponNombre === "Ratigueya"){
                mokeponEnemigo = new Mokepon('Ratigueya','./assets/mokepons_mokepon_ratigueya_attack.png',5,'./assets/ratigueya.png')
            }
        mokeponEnemigo.x = enemigo.x
        mokeponEnemigo.y = enemigo.y
        mokeponEnemigo.pintarMokepon()}
        )}
        )}
    })
    }

function moverDerecha(){
    mascotaJugadorObjeto.velocidadX = 5
}

function moverIzquierda(){
    mascotaJugadorObjeto.velocidadX = -5
}

function moverAbajo(){
    mascotaJugadorObjeto.velocidadY = 5
}

function moverArriba(){
    mascotaJugadorObjeto.velocidadY = -5
}

function detenerMovimiento(){
    mascotaJugadorObjeto.velocidadX = 0
    mascotaJugadorObjeto.velocidadY = 0
}

function sePresionoUnaTecla(event){
    switch (event.key) {
        case 'ArrowUp':
            moverArriba()
            break;
        case 'ArrowDown':
            moverAbajo()
            break;
        case 'ArrowLeft':
            moverIzquierda()
            break;
        case 'ArrowRight':
            moverDerecha()
            break;
        default:
            break;
    }
}

function iniciarMapa() {
    mascotaJugadorObjeto = obtenerObjetoMascota()
    sectionMapa.style.display = 'flex'
    intervalo = setInterval(pintarCanvas, 50)
    
    window.addEventListener('keydown', sePresionoUnaTecla)
    window.addEventListener('keyup', detenerMovimiento)
}

function obtenerObjetoMascota(){
    for (let i = 0; i < mokepones.length; i++) {
        if(mascotaJugador === mokepones[i].nombre){
            return mokepones[i]
        }
    }
}

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = 
        mascotaJugadorObjeto.y
    const abajoMascota = 
        mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto
    const derechaMascota = 
        mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho
    const izquierdaMascota = 
        mascotaJugadorObjeto.x

    if(
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return
    }
    detenerMovimiento()
    clearInterval(intervalo)
    sectionSeleccionarAtaque.style.display = 'grid'
    sectionReinicar.style.display = 'flex'
    sectionMapa.style.display = 'none'
    seleccionarMascotaEnemigo(enemigo)
}
window.addEventListener('load', iniciarJuego)