
// Inicializa as fichas disponíveis
if (localStorage.getItem("total") === null) {
    localStorage.setItem("total", 48);
}

// Inicializa as fichas reservadas
if (localStorage.getItem("reservada") === null) {
    localStorage.setItem("reservada", 0);
}

// Atualiza as informações da página
function atualizar() {

    let total = Number(localStorage.getItem("total"));
    let reservada = Number(localStorage.getItem("reservada"));

    let resta = total - reservada;

    let elementoFicha = document.getElementById("ficha");
    let elementoReservadas = document.getElementById("reservadas");

    if (elementoFicha) {
        elementoFicha.innerText = resta;
    }

    if (elementoReservadas) {
        elementoReservadas.innerText = reservada;
    }

    verificarFichas(resta);
}

// Verifica a quantidade de fichas disponíveis
function verificarFichas(restantes) {

    let aviso = document.getElementById("aviso");

    if (!aviso) return;

    if (restantes <= 0) {

        aviso.innerText = "Nenhuma ficha disponível!";
        aviso.style.color = "red";

    } else if (restantes <= 2) {

        aviso.innerText = `Atenção! Apenas ${restantes} fichas restantes!`;
        aviso.style.color = "red";

    } else if (restantes <= 5) {

        aviso.innerText = `Restam apenas ${restantes} fichas!`;
        aviso.style.color = "blue";

    } else {

        aviso.innerText = `${restantes} fichas disponíveis.`;
        aviso.style.color = "green";

    }
}

// Atualiza quando a página abre
window.addEventListener("DOMContentLoaded", atualizar);

// Atualiza quando outra página modifica o localStorage
window.addEventListener("storage", atualizar);

window.addEventListener("DOMContentLoaded", function () {
    const data = document.getElementById("data");
    if (data) {
        data.textContent = new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "long"
        }).format(new Date());
    }
});
