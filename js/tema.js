// ======================================================
// TEMA — NEUROGAME
// ======================================================


// ======================================================
// 1. CONFIGURAÇÃO
// ======================================================

const CHAVE_TEMA_NEUROGAME =
    "neurogame-tema";


// ======================================================
// 2. OBTER TEMA SALVO
// ======================================================

function obterTemaSalvo() {

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


    // Tema padrão

    return "escuro";

}


// ======================================================
// 3. APLICAR TEMA
// ======================================================

function aplicarTema(
    tema
) {

    const html =
        document.documentElement;


    if (
        tema === "claro"
    ) {

        html.classList.add(
            "tema-claro"
        );


        html.classList.remove(
            "tema-escuro"
        );

    }

    else {

        html.classList.add(
            "tema-escuro"
        );


        html.classList.remove(
            "tema-claro"
        );

    }


    localStorage.setItem(
        CHAVE_TEMA_NEUROGAME,
        tema
    );


    atualizarBotaoTema(
        tema
    );

}


// ======================================================
// 4. ATUALIZAR BOTÃO
// ======================================================

function atualizarBotaoTema(
    tema
) {

    const botao =
        document.getElementById(
            "alternarTema"
        );


    if (
        !botao
    ) {

        return;

    }


    const interruptor =
        botao.querySelector(
            ".interruptor-tema"
        );


    if (
        tema === "claro"
    ) {

        botao.classList.add(
            "tema-claro-ativo"
        );


        botao.setAttribute(
            "aria-label",
            "Ativar tema escuro"
        );


        botao.setAttribute(
            "title",
            "Ativar tema escuro"
        );


        if (
            interruptor
        ) {

            interruptor.classList.add(
                "ativo-claro"
            );

        }

    }

    else {

        botao.classList.remove(
            "tema-claro-ativo"
        );


        botao.setAttribute(
            "aria-label",
            "Ativar tema claro"
        );


        botao.setAttribute(
            "title",
            "Ativar tema claro"
        );


        if (
            interruptor
        ) {

            interruptor.classList.remove(
                "ativo-claro"
            );

        }

    }

}


// ======================================================
// 5. ALTERNAR TEMA
// ======================================================

function alternarTema() {

    const temaAtual =
        document.documentElement
            .classList
            .contains(
                "tema-claro"
            )

            ? "claro"

            : "escuro";


    const novoTema =
        temaAtual === "claro"

            ? "escuro"

            : "claro";


    aplicarTema(
        novoTema
    );

}


// ======================================================
// 6. APLICAR TEMA IMEDIATAMENTE
// ======================================================

const temaInicial =
    obterTemaSalvo();


aplicarTema(
    temaInicial
);


// ======================================================
// 7. BOTÃO
// ======================================================

document.addEventListener(
    "DOMContentLoaded",

    function() {

        const botao =
            document.getElementById(
                "alternarTema"
            );


        if (
            !botao
        ) {

            console.warn(
                "⚠️ Botão de tema não encontrado nesta página."
            );


            return;

        }


        atualizarBotaoTema(
            obterTemaSalvo()
        );


        botao.addEventListener(
            "click",

            function() {

                alternarTema();

            }
        );

    }
);


// ======================================================
// 8. DISPONIBILIZAR GLOBALMENTE
// ======================================================

window.NeuroGameTema = {

    aplicar:
        aplicarTema,

    alternar:
        alternarTema,

    obter:
        obterTemaSalvo

};