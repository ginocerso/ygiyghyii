
let palabras = [
    {
        palabra: "DEUDA",
        pista: "Dinero que una persona, empresa o país debe devolver."
    },
    {
        palabra: "PYMES",
        pista: "Empresas pequeñas y medianas."
    },
    {
        palabra: "FUGAS",
        pista: "Salida de dinero o capital de una economía."
    },
    {
        palabra: "PODER",
        pista: "Capacidad económica de influir o tomar decisiones."
    },
    {
        palabra: "BANCO",
        pista: "Institución que administra dinero y ofrece préstamos."
    },
    {
        palabra: "PESOS",
        pista: "Moneda utilizada en Argentina."
    }
];

let seleccion = palabras[Math.floor(Math.random() * palabras.length)];
let palabraCorrecta = seleccion.palabra;

let tablero = document.getElementById("tablero");
let mensaje = document.getElementById("mensaje");
let textoPista = document.getElementById("textoPista");

let filaActual = 0;
let casillas = [];

// Crear las 30 casillas

for (let fila = 0; fila < 6; fila++) {

    casillas[fila] = [];

    for (let columna = 0; columna < 5; columna++) {

        let casilla = document.createElement("input");

        casilla.maxLength = 1;
        casilla.disabled = fila !== 0;
        casilla.autocomplete = "off";
        casilla.autocapitalize = "characters";
        casilla.inputMode = "text";

        casilla.addEventListener("input", function () {

            this.value = this.value
                .toLocaleUpperCase("es")
                .replace(/[^A-ZÑ]/g, "")
                .slice(0, 1);

            if (this.value && columna < 4) {
                casillas[fila][columna + 1].focus();
            }

        });

        casilla.addEventListener("keydown", function (evento) {

            if (evento.key === "Backspace" && !this.value && columna > 0) {
                casillas[fila][columna - 1].focus();
            }

            if (evento.key === "Enter") {
                comprobarPalabra();
            }

        });

        casillas[fila].push(casilla);
        tablero.appendChild(casilla);
    }
}

// Comprobar la palabra ingresada

function comprobarPalabra() {

    if (filaActual >= 6) return;

    let intento = "";

    for (let columna = 0; columna < 5; columna++) {
        intento += casillas[filaActual][columna].value;
    }

    if (intento.length !== 5) {
        mensaje.textContent = "Completá las 5 letras.";
        return;
    }

    // Contar las letras de la respuesta
    let cantidades = {};

    for (let letra of palabraCorrecta) {
        cantidades[letra] = (cantidades[letra] || 0) + 1;
    }

    let resultado = Array(5).fill("gris");

    // Primero detectar las letras verdes
    for (let i = 0; i < 5; i++) {

        if (intento[i] === palabraCorrecta[i]) {

            resultado[i] = "verde";
            cantidades[intento[i]]--;

        }
    }

    // Después detectar las amarillas
    for (let i = 0; i < 5; i++) {

        if (resultado[i] === "verde") continue;

        let letra = intento[i];

        if (cantidades[letra] > 0) {

            resultado[i] = "amarillo";
            cantidades[letra]--;

        }
    }

    // Pintar las casillas
    for (let i = 0; i < 5; i++) {

        casillas[filaActual][i].classList.add(resultado[i]);
        casillas[filaActual][i].disabled = true;

    }

    // Comprobar si ganó
    if (intento === palabraCorrecta) {

        mensaje.textContent = "¡Felicitaciones! ¡Adivinaste!";
        terminarJuego();
        return;
    }

    filaActual++;

    // Comprobar si perdió
    if (filaActual === 6) {

        mensaje.textContent = "¡Se terminaron los intentos! La palabra era " + palabraCorrecta;
        terminarJuego();
        return;
    }

    // Habilitar la siguiente fila
    for (let i = 0; i < 5; i++) {
        casillas[filaActual][i].disabled = false;
    }

    mensaje.textContent = "¡Probá otra vez!";

    casillas[filaActual][0].focus();
}

// Mostrar la pista

document.getElementById("pista").addEventListener("click", function () {

    textoPista.textContent = seleccion.pista;

});

// Botón para comprobar

document.getElementById("comprobar").addEventListener("click", comprobarPalabra);

// Terminar partida

function terminarJuego() {

    for (let fila = 0; fila < 6; fila++) {

        for (let columna = 0; columna < 5; columna++) {

            casillas[fila][columna].disabled = true;

        }
    }

    document.getElementById("comprobar").disabled = true;
    document.getElementById("pista").disabled = true;
    document.getElementById("reiniciar").hidden = false;

}

// Reiniciar el juego

document.getElementById("reiniciar").addEventListener("click", function () {
    location.reload();
});
