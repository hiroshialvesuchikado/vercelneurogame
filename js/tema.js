// ======================================================
// TEMA — NEUROGAME
// ======================================================

const CHAVE_TEMA_NEUROGAME = "neurogame-tema";


// ======================================================
// OBTER TEMA
// ======================================================

function obterTemaNeuroGame() {

    const temaSalvo =
        localStorage.getItem(
            CHAVE_TEMA_NEUROGAME
        );

    if (
        temaSalvo === "claro" ||
        temaSalvo === "escuro"
    ) {

        return temaSalvo;

    }

    return "escuro";
}


// ======================================================
// APLICAR TEMA
// ======================================================

function aplicarTemaNeuroGame(tema) {

    const html =
        document.documentElement;

    html.classList.remove(
        "tema-claro",
        "tema-escuro"
    );

    html.classList.add(
        tema === "claro"
            ? "tema-claro"
            : "tema-escuro"
    );

    localStorage.setItem(
        CHAVE_TEMA_NEUROGAME,
        tema
    );

    atualizarBotaoTema();
}


// ======================================================
// ALTERNAR
// ======================================================

function alternarTemaNeuroGame() {

    const temaAtual =
        document.documentElement
            .classList
            .contains("tema-claro")
            ? "claro"
            : "escuro";

    const novoTema =
        temaAtual === "claro"
            ? "escuro"
            : "claro";

    aplicarTemaNeuroGame(
        novoTema
    );
}


// ======================================================
// ATUALIZAR INTERRUPTOR
// ======================================================

function atualizarBotaoTema() {

    const botao =
        document.getElementById(
            "alternarTema"
        );

    if (!botao) {
        return;
    }

    const temaClaro =
        document.documentElement
            .classList
            .contains(
                "tema-claro"
            );

    botao.classList.toggle(
        "claro",
        temaClaro
    );

    botao.setAttribute(
        "aria-label",
        temaClaro
            ? "Ativar tema escuro"
            : "Ativar tema claro"
    );
}


// ======================================================
// APLICAR TEMA SALVO
// ======================================================

aplicarTemaNeuroGame(
    obterTemaNeuroGame()
);


// ======================================================
// ATIVAR BOTÃO
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const botao =
            document.getElementById(
                "alternarTema"
            );

        if (!botao) {
            return;
        }

        atualizarBotaoTema();

        botao.addEventListener(
            "click",
            alternarTemaNeuroGame
        );

    }
);


// ======================================================
// DISPONIBILIZAR GLOBALMENTE
// ======================================================

window.NeuroGameTema = {

    aplicar:
        aplicarTemaNeuroGame,

    alternar:
        alternarTemaNeuroGame,

    obter:
        obterTemaNeuroGame

};