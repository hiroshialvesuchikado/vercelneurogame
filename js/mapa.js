// ======================================================
// ATLAS INTERATIVO — NEUROGAME
// ======================================================


// ======================================================
// 1. LER MAPA DA URL
// ======================================================

const parametrosAtlas =
    new URLSearchParams(
        window.location.search
    );


const mapaSelecionadoAtlas =
    parametrosAtlas.get(
        "mapa"
    );


// ======================================================
// 2. ELEMENTOS HTML
// ======================================================

const imagemAtlas =
    document.getElementById(
        "imagemAnatomica"
    );


const svgAtlas =
    document.getElementById(
        "camadaHotspots"
    );


const tituloMapa =
    document.getElementById(
        "tituloMapa"
    );


const nomeEstruturaAtlas =
    document.getElementById(
        "nomeEstruturaAtlas"
    );


const botaoVoltar =
    document.getElementById(
        "voltarMenu"
    );


// ======================================================
// 3. ENCONTRAR MAPA
// ======================================================

const mapaAtualAtlas =
    catalogoMapas.find(
        function(mapa) {

            return (
                mapa.id ===
                mapaSelecionadoAtlas
            );

        }
    );


if (!mapaAtualAtlas) {

    tituloMapa.textContent =
        "Mapa não encontrado.";

    throw new Error(
        "Mapa do atlas não encontrado."
    );

}


// ======================================================
// 4. TÍTULO
// ======================================================

tituloMapa.textContent =
    mapaAtualAtlas.titulo;


// ======================================================
// 5. CRIAR ESTRUTURAS
// ======================================================

function criarAtlas() {

    svgAtlas.innerHTML =
        "";


    svgAtlas.setAttribute(
        "viewBox",
        `0 0 ${imagemAtlas.naturalWidth} ${imagemAtlas.naturalHeight}`
    );


    mapaAtualAtlas
        .estruturas
        .forEach(
            function(estrutura) {

                let elemento;


                // =============================
                // LINHA
                // =============================

                if (
                    estrutura.tipo ===
                    "linha"
                ) {

                    elemento =
                        document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "polyline"
                        );


                    elemento.classList.add(
                        "estrutura",
                        "estrutura-linha",
                        "estrutura-atlas"
                    );

                }


                // =============================
                // ÁREA
                // =============================

                else {

                    elemento =
                        document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "polygon"
                        );


                    elemento.classList.add(
                        "estrutura",
                        "estrutura-area",
                        "estrutura-atlas"
                    );

                }


                elemento.setAttribute(
                    "points",
                    estrutura.pontos
                );


                elemento.dataset.id =
                    estrutura.id;


                elemento.dataset.nome =
                    estrutura.nome;


                elemento.dataset.tipo =
                    estrutura.tipo ||
                    "area";


                // =============================
                // CLIQUE
                // =============================

                elemento.addEventListener(
                    "click",

                    function() {

                        selecionarEstrutura(
                            elemento
                        );

                    }
                );


                svgAtlas.appendChild(
                    elemento
                );

            }
        );

}


// ======================================================
// 6. SELECIONAR ESTRUTURA
// ======================================================

function selecionarEstrutura(
    elemento
) {

    // Remove seleção anterior

    document
        .querySelectorAll(
            ".estrutura-atlas"
        )
        .forEach(
            function(estrutura) {

                estrutura
                    .classList
                    .remove(
                        "selecionada-atlas"
                    );

            }
        );


    // Marca atual

    elemento
        .classList
        .add(
            "selecionada-atlas"
        );


    // Mostra nome

    nomeEstruturaAtlas.textContent =
        elemento.dataset.nome;

}


// ======================================================
// 7. CARREGAR IMAGEM
// ======================================================

imagemAtlas.onload =
    function() {

        criarAtlas();

    };


imagemAtlas.src =
    mapaAtualAtlas.imagem;


// ======================================================
// 8. VOLTAR
// ======================================================

botaoVoltar.addEventListener(
    "click",

    function() {

        window.location.href =
            "index.html";

    }
);