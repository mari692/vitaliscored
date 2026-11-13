
let dataEscolhida = new Date();
let dataAtual = new Date(dataEscolhida.getFullYear(), dataEscolhida.getMonth(), 1);

const meses = [
    "Janeiro", "Fevereiro", "Março",
    "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro",
    "Outubro", "Novembro", "Dezembro"
];

const diasSemana = [
    "Domingo", "Segunda-feira",
    "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado"
];

// AVISOS DO SISTEMA

const avisos = [
    {
        titulo: "Campanha de vacinação",
        descricao: "Campanha de vacinação disponível na UBS Centro.",
        data: "2026-11-17"
    },
    {
        titulo: "Alerta de dengue",
        descricao: "Atenção aos focos de dengue. Colabore com a prevenção.",
        data: "2026-11-12"
    },
    {
        titulo: "Lembrete de medicamentos",
        descricao: "Previsão de chegada dos medicamentos.",
        data: "2026-11-30"
    },
    {
        titulo: "Atendimento odontológico",
        descricao: "Novos horários disponíveis para atendimento.",
        data: "2026-11-19"
    },
    {
        titulo: "Atualização da UBS",
        descricao: "Confira os horários de funcionamento da unidade.",
        data: "2026-11-21"
    },
    {
        titulo: "Campanha de prevenção",
        descricao: "Ação de conscientização e cuidados com a saúde.",
        data: "2026-11-25"
    }
];

function formatarData(data) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

// MOSTRAR AVISOS

function mostrarAvisos() {

    const lista = document.getElementById("listaAvisos");

    lista.innerHTML = "";

    avisos.forEach(aviso => {

        const div = document.createElement("div");

        div.className = "notificacao";

        const titulo = document.createElement("h3");
        titulo.textContent = aviso.titulo;

        const descricao = document.createElement("p");
        descricao.textContent = aviso.descricao;

        const data = document.createElement("span");
        data.className = "data-aviso";
        data.textContent = "Data: " + formatarData(aviso.data);

        div.appendChild(titulo);
        div.appendChild(descricao);
        div.appendChild(data);

        lista.appendChild(div);

    });
}

// CALENDÁRIO

function desenharCalendario() {

    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    document.getElementById("nomeMes").innerText =
        meses[mes] + " " + ano;

    const calendario = document.getElementById("calendario");

    calendario.innerHTML = "";

    ["D", "S", "T", "Q", "Q", "S", "S"].forEach(dia => {

        let div = document.createElement("div");

        div.className = "semana";
        div.innerText = dia;

        calendario.appendChild(div);

    });

    const primeiroDia = new Date(ano, mes, 1).getDay();

    const totalDias = new Date(ano, mes + 1, 0).getDate();

    for (let i = 0; i < primeiroDia; i++) {
        calendario.appendChild(document.createElement("div"));
    }

    for (let dia = 1; dia <= totalDias; dia++) {

        const botao = document.createElement("button");

        botao.innerText = dia;

        // VERIFICAR SE O DIA POSSUI AVISO

        const dataFormatada =
            `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

        const possuiAviso = avisos.some(aviso =>
            aviso.data === dataFormatada
        );

        if (possuiAviso) {
            botao.classList.add("tem-aviso");
        }

        // DATA SELECIONADA

        if (
            dia === dataEscolhida.getDate() &&
            mes === dataEscolhida.getMonth() &&
            ano === dataEscolhida.getFullYear()
        ) {
            botao.classList.add("selecionado");
        }

        botao.onclick = function() {

            dataEscolhida = new Date(ano, mes, dia);

            desenharCalendario();

            atualizarConsulta();

        };

        calendario.appendChild(botao);

    }
}

// TROCAR MÊS

function mudarMes(valor) {

    dataAtual.setDate(1);
    dataAtual.setMonth(dataAtual.getMonth() + valor);
    dataEscolhida = new Date(
        dataAtual.getFullYear(),
        dataAtual.getMonth(),
        1
    );

    desenharCalendario();
    atualizarConsulta();

}

// ATUALIZAR CONSULTA

function atualizarConsulta() {

    const dia = dataEscolhida.getDate();

    const mes = meses[dataEscolhida.getMonth()];

    const semana = diasSemana[dataEscolhida.getDay()];

    document.getElementById("dataSelecionada").innerText =
        semana + ", " + dia + " de " + mes;

    const especialidade =
        document.getElementById("especialidade").value;

    document.getElementById("detalhes").innerHTML =
        "Consulta — " + especialidade +
        "<br><br>09:30 · Atendimento presencial";

}

// EVENTOS

document.getElementById("especialidade")
.addEventListener("change", atualizarConsulta);

desenharCalendario();

atualizarConsulta();

mostrarAvisos();
