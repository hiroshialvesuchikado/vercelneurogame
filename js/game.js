// ======================================================
// GAME — NEUROGAME
//
// SUPORTA:
// - ESTUDO POR CATEGORIA
// - ESTUDO POR MAPA
// - FILTRO POR TÓPICO
// - MAPAS MISTOS
// - TROCA AUTOMÁTICA DE IMAGENS
// - REUTILIZAÇÃO DA MESMA IMAGEM ENTRE QUESTÕES
// ======================================================


// ======================================================
// 1. LER PARÂMETROS DA URL
// ======================================================

const parametros =
    new URLSearchParams(
        window.location.search
    );


const tipoEstudo =
    parametros.get(
        "tipo"
    );


const categoriaSelecionada =
    parametros.get(
        "categoria"
    );


const mapaSelecionado =
    parametros.get(
        "mapa"
    );


const topicoSelecionado =
    parametros.get(
        "topico"
    );


const modoSelecionado =
    parametros.get(
        "modo"
    );


// ======================================================
// 2. ELEMENTOS
// ======================================================

const imagem =
    document.getElementById(
        "imagemAnatomica"
    );


const pergunta =
    document.getElementById(
        "pergunta"
    );


const svg =
    document.getElementById(
        "camadaHotspots"
    );


// ======================================================
// 3. DESCOBRIR TÓPICO DE UM MAPA
// ======================================================

function obterTopicoMapa(
    mapa
) {

    if (
        mapa &&
        mapa.topico
    ) {

        return mapa.topico;

    }


    if (
        typeof window.definicoesMapas !==
        "undefined"
    ) {

        const definicao =
            window.definicoesMapas.find(
                function(item) {

                    return (
                        item.id ===
                        mapa.id
                    );

                }
            );


        if (
            definicao &&
            definicao.topico
        ) {

            return definicao.topico;

        }

    }


    return null;

}


// ======================================================
// 4. DESCOBRIR CATEGORIA DA ESTRUTURA
// ======================================================

function obterCategoria(
    estrutura
) {

    const id =
        estrutura.id
            .toLowerCase();


    // ==================================================
    // TELENCÉFALO
    // ==================================================

    if (
        id.startsWith(
            "giro_"
        )
    ) {

        return "giro";

    }


    if (
        id.startsWith(
            "nucleosdabase_"
        )
    ) {

        return "nucleosdabase";

    }


    if (
        id.startsWith(
            "sulco_"
        )
    ) {

        return "sulco";

    }


    if (
        id.startsWith(
            "trans_"
        )
    ) {

        return "trans";

    }


    if (
        id.startsWith(
            "lobo_"
        ) ||

        id.startsWith(
            "lobulo_"
        )
    ) {

        return "lobo";

    }


    // ==================================================
    // DIENCÉFALO
    // ==================================================

    if (
        id.startsWith(
            "talamo_"
        )
    ) {

        return "talamo";

    }


    if (
        id.startsWith(
            "hipotalamo_"
        )
    ) {

        return "hipotalamo";

    }


    if (
        id.startsWith(
            "epitalamo_"
        )
    ) {

        return "epitalamo";

    }


    if (
        id.startsWith(
            "subtalamo_"
        )
    ) {

        return "subtalamo";

    }


    return "outros";

}


// ======================================================
// 4.1 DESCOBRIR TÓPICO DA ESTRUTURA
// ======================================================

function obterTopicoEstrutura(
    estrutura
) {

    if (
        !estrutura ||
        !estrutura.id
    ) {

        return null;

    }


    const id =
        estrutura.id
            .toLowerCase();


    // ==================================================
    // TELENCÉFALO
    // ==================================================

    if (
        id.startsWith(
            "giro_"
        ) ||

        id.startsWith(
            "sulco_"
        ) ||

        id.startsWith(
            "lobo_"
        ) ||

        id.startsWith(
            "lobulo_"
        ) ||

        id.startsWith(
            "nucleosdabase_"
        ) ||

        id.startsWith(
            "trans_"
        )
    ) {

        return "telencefalo";

    }


    // ==================================================
    // DIENCÉFALO
    // ==================================================

    if (
        id.startsWith(
            "talamo_"
        ) ||

        id.startsWith(
            "hipotalamo_"
        ) ||

        id.startsWith(
            "epitalamo_"
        ) ||

        id.startsWith(
            "subtalamo_"
        )
    ) {

        return "diencefalo";

    }


    return null;

}


// ======================================================
// 4.2 VERIFICAR SE O MAPA PERTENCE AO TÓPICO
// ======================================================

function mapaPertenceAoTopico(
    mapa,
    topico
) {

    if (
        !mapa ||
        !topico
    ) {

        return false;

    }


    // ==================================================
    // PRIMEIRO VERIFICA AS ESTRUTURAS
    //
    // Isso permite mapas mistos.
    // ==================================================

    if (
        Array.isArray(
            mapa.estruturas
        )
    ) {

        const possuiEstruturaDoTopico =
            mapa.estruturas.some(
                function(
                    estrutura
                ) {

                    return (
                        obterTopicoEstrutura(
                            estrutura
                        ) ===
                        topico
                    );

                }
            );


        if (
            possuiEstruturaDoTopico
        ) {

            return true;

        }

    }


    // ==================================================
    // COMPATIBILIDADE COM MAPAS ANTIGOS
    // ==================================================

    return (
        obterTopicoMapa(
            mapa
        ) ===
        topico
    );

}


// ======================================================
// 5. PEGAR ESTRUTURAS QUE DEVEM APARECER
// ======================================================

function obterEstruturasDoMapa(
    mapa
) {

    if (
        !mapa ||
        !Array.isArray(
            mapa.estruturas
        )
    ) {

        return [];

    }


    // ==================================================
    // ESTUDO POR MAPA
    //
    // Se o mapa for misto:
    // mostra apenas as estruturas do tópico escolhido.
    //
    // Se for mapa antigo:
    // mantém compatibilidade.
    // ==================================================

    if (
        tipoEstudo ===
        "mapa"
    ) {

        if (
            topicoSelecionado
        ) {

            const estruturasDoTopico =
                mapa.estruturas.filter(
                    function(
                        estrutura
                    ) {

                        return (
                            obterTopicoEstrutura(
                                estrutura
                            ) ===
                            topicoSelecionado
                        );

                    }
                );


            if (
                estruturasDoTopico.length >
                0
            ) {

                return estruturasDoTopico;

            }

        }


        return mapa.estruturas;

    }


    // ==================================================
    // ESTUDO POR CATEGORIA
    //
    // Filtra:
    // - tópico
    // - categoria
    //
    // Permite mapas mistos.
    // ==================================================

    if (
        tipoEstudo ===
        "categoria"
    ) {

        return mapa.estruturas.filter(
            function(
                estrutura
            ) {

                const topicoEstrutura =
                    obterTopicoEstrutura(
                        estrutura
                    );


                // ==================================================
                // ESTRUTURAS COM PREFIXO NOVO
                // ==================================================

                const pertenceAoTopico =
                    !topicoSelecionado ||

                    topicoEstrutura ===
                    topicoSelecionado ||

                    // ==============================================
                    // FALLBACK PARA ESTRUTURAS ANTIGAS
                    // ==============================================

                    (
                        !topicoEstrutura &&

                        obterTopicoMapa(
                            mapa
                        ) ===
                        topicoSelecionado
                    );


                return (
                    pertenceAoTopico &&

                    obterCategoria(
                        estrutura
                    ) ===
                    categoriaSelecionada
                );

            }
        );

    }


    return [];

}


// ======================================================
// 6. BANCO DE QUESTÕES
// ======================================================

let bancoQuestoes =
    [];


// ======================================================
// 7. POR CATEGORIA
// ======================================================

if (
    tipoEstudo ===
    "categoria"
) {

    catalogoMapas.forEach(
        function(
            mapa
        ) {

            // ==================================================
            // MAPAS MISTOS
            //
            // Não usa apenas mapa.topico.
            // Verifica também as estruturas do mapa.
            // ==================================================

            if (
                topicoSelecionado &&

                !mapaPertenceAoTopico(
                    mapa,
                    topicoSelecionado
                )
            ) {

                return;

            }


            const estruturas =
                obterEstruturasDoMapa(
                    mapa
                );


            estruturas.forEach(
                function(
                    estrutura
                ) {

                    bancoQuestoes.push(
                        {

                            mapa:
                                mapa,

                            estrutura:
                                estrutura

                        }
                    );

                }
            );

        }
    );

}


// ======================================================
// 8. POR MAPA
// ======================================================

else if (
    tipoEstudo ===
    "mapa"
) {

    const mapaEncontrado =
        catalogoMapas.find(
            function(
                mapa
            ) {

                return (
                    mapa.id ===
                    mapaSelecionado &&

                    mapaPertenceAoTopico(
                        mapa,
                        topicoSelecionado
                    )
                );

            }
        );


    if (
        mapaEncontrado
    ) {

        const estruturas =
            obterEstruturasDoMapa(
                mapaEncontrado
            );


        estruturas.forEach(
            function(
                estrutura
            ) {

                bancoQuestoes.push(
                    {

                        mapa:
                            mapaEncontrado,

                        estrutura:
                            estrutura

                    }
                );

            }
        );

    }

}


// ======================================================
// 9. EMBARALHAR
// ======================================================

function embaralhar(
    lista
) {

    const copia =
        [...lista];


    for (
        let i =
            copia.length - 1;

        i > 0;

        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (
                    i + 1
                )
            );


        [
            copia[i],
            copia[j]

        ] = [

            copia[j],
            copia[i]

        ];

    }


    return copia;

}


bancoQuestoes =
    embaralhar(
        bancoQuestoes
    );


// ======================================================
// 10. GUARDAR TOTAL ORIGINAL
// ======================================================

const totalQuestoesInicial =
    bancoQuestoes.length;


// ======================================================
// 11. CONTROLE DE MAPA ANTERIOR
// ======================================================

let mapaAnterior =
    null;


// ======================================================
// 12. PEGAR PRÓXIMA QUESTÃO
// ======================================================

function obterProximaQuestao() {

    if (
        bancoQuestoes.length ===
        0
    ) {

        return null;

    }


    // ==================================================
    // POR MAPA
    // ==================================================

    if (
        tipoEstudo ===
        "mapa"
    ) {

        const questao =
            bancoQuestoes.shift();


        mapaAnterior =
            questao.mapa.id;


        return questao;

    }


    // ==================================================
    // POR CATEGORIA
    //
    // Evita repetir a mesma imagem
    // duas vezes seguidas quando possível.
    // ==================================================

    let indice =
        bancoQuestoes.findIndex(
            function(
                questao
            ) {

                return (
                    !mapaAnterior ||

                    questao.mapa.id !==
                    mapaAnterior
                );

            }
        );


    if (
        indice ===
        -1
    ) {

        indice =
            0;

    }


    const questao =
        bancoQuestoes.splice(
            indice,
            1
        )[0];


    mapaAnterior =
        questao.mapa.id;


    return questao;

}


// ======================================================
// 13. CRIAR HOTSPOTS SVG
// ======================================================

function criarHotspots(
    mapa
) {

    svg.innerHTML =
        "";


    svg.setAttribute(
        "viewBox",
        `0 0 ${imagem.naturalWidth} ${imagem.naturalHeight}`
    );


    const estruturas =
        obterEstruturasDoMapa(
            mapa
        );


    estruturas.forEach(
        function(
            estrutura
        ) {

            let elemento;


            // ==================================================
            // LINHA
            // ==================================================

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
                    "estrutura-linha"
                );


                elemento.setAttribute(
                    "fill",
                    "none"
                );

            }


            // ==================================================
            // ÁREA / POLÍGONO
            // ==================================================

            else {

                elemento =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "polygon"
                    );


                elemento.classList.add(
                    "estrutura",
                    "estrutura-area"
                );

            }


            elemento.setAttribute(
                "points",
                estrutura.pontos
            );


            elemento.setAttribute(
                "id",
                estrutura.id
            );


            elemento.dataset.id =
                estrutura.id;


            elemento.dataset.nome =
                estrutura.nome;


            elemento.dataset.info =
                estrutura.info ||
                "";


            elemento.dataset.tipo =
                estrutura.tipo ||
                "area";


            svg.appendChild(
                elemento
            );


            // ==================================================
            // HITBOX INVISÍVEL PARA LINHAS
            // ==================================================

            if (
                estrutura.tipo ===
                "linha"
            ) {

                const hitbox =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "polyline"
                    );


                hitbox.classList.add(
                    "estrutura-hitbox"
                );


                hitbox.setAttribute(
                    "points",
                    estrutura.pontos
                );


                hitbox.setAttribute(
                    "fill",
                    "none"
                );


                hitbox.setAttribute(
                    "stroke",
                    "rgba(0,0,0,0.001)"
                );


                hitbox.setAttribute(
                    "stroke-width",
                    "18"
                );


                hitbox.setAttribute(
                    "stroke-linecap",
                    "round"
                );


                hitbox.setAttribute(
                    "stroke-linejoin",
                    "round"
                );


                hitbox.setAttribute(
                    "pointer-events",
                    "stroke"
                );


                hitbox.setAttribute(
                    "vector-effect",
                    "non-scaling-stroke"
                );


                hitbox.dataset.id =
                    estrutura.id;


                hitbox.dataset.nome =
                    estrutura.nome;


                hitbox.dataset.info =
                    estrutura.info ||
                    "";


                hitbox.dataset.tipo =
                    "hitbox-linha";


                svg.appendChild(
                    hitbox
                );

            }

        }
    );


    console.log(
        "SVG criado:",
        mapa.id,
        estruturas.length,
        "estruturas"
    );

}


// ======================================================
// 14. NORMALIZAR URL DA IMAGEM
// ======================================================

function normalizarURLImagem(
    endereco
) {

    try {

        return new URL(
            endereco,
            document.baseURI
        ).href;

    }

    catch (
        erro
    ) {

        return endereco;

    }

}


// ======================================================
// 15. CARREGAR QUESTÃO
// ======================================================

function carregarQuestao(
    questao,
    callback
) {

    const mapa =
        questao.mapa;


    const estrutura =
        questao.estrutura;


    const urlMapa =
        normalizarURLImagem(
            mapa.imagem
        );


    const urlImagemAtual =
        normalizarURLImagem(
            imagem.currentSrc ||
            imagem.src
        );


    function prepararQuestao() {

        console.log(
            "Preparando questão:",
            estrutura.nome
        );


        criarHotspots(
            mapa
        );


        const estruturaSVG =
            Array.from(
                svg.querySelectorAll(
                    ".estrutura"
                )
            ).find(
                function(
                    elemento
                ) {

                    return (
                        elemento.dataset.id ===
                        estrutura.id
                    );

                }
            );


        const todasEstruturas =
            Array.from(
                svg.querySelectorAll(
                    ".estrutura"
                )
            );


        if (
            !estruturaSVG
        ) {

            console.error(
                "❌ Estrutura não encontrada:",
                estrutura.id
            );


            pergunta.textContent =
                "Erro ao localizar a estrutura.";


            return;

        }


        callback(
            {

                mapa:
                    mapa,

                estrutura:
                    estrutura,

                estruturaSVG:
                    estruturaSVG,

                estruturasSVG:
                    todasEstruturas

            }
        );

    }


    const mesmaImagem =
        urlImagemAtual ===
        urlMapa;


    // ==================================================
    // IMAGEM JÁ CARREGADA / CACHE
    // ==================================================

    if (
        mesmaImagem &&
        imagem.complete &&
        imagem.naturalWidth > 0
    ) {

        console.log(
            "♻️ Imagem já carregada:",
            mapa.id
        );


        prepararQuestao();


        esconderLoadingJogo();


        return;

    }


    console.log(
        "🖼️ Carregando imagem:",
        mapa.id
    );


    imagem.onload =
        null;


    imagem.onerror =
        null;


    // ==================================================
    // IMAGEM CARREGADA
    // ==================================================

    imagem.onload =
        function() {

            console.log(
                "✅ Imagem carregada:",
                mapa.id
            );


            prepararQuestao();


            esconderLoadingJogo();

        };


    // ==================================================
    // ERRO NA IMAGEM
    // ==================================================

    imagem.onerror =
        function() {

            pergunta.textContent =
                "Erro ao carregar a imagem.";


            console.error(
                "❌ Erro ao carregar:",
                mapa.imagem
            );


            esconderLoadingJogo();


            if (
                typeof mostrarErroAmigavel ===
                "function"
            ) {

                mostrarErroAmigavel(
                    "Não foi possível carregar a imagem",
                    "A imagem anatômica deste mapa não pôde ser carregada. Tente novamente."
                );

            }

        };


    imagem.src =
        urlMapa;

}


// ======================================================
// 16. DISPONIBILIZAR PARA OS MODOS
// ======================================================

window.NeuroGame =
    {

        obterProximaQuestao:
            obterProximaQuestao,

        carregarQuestao:
            carregarQuestao,

        totalQuestoes:
            totalQuestoesInicial,

        tipoEstudo:
            tipoEstudo,

        categoria:
            categoriaSelecionada,

        mapa:
            mapaSelecionado,

        topico:
            topicoSelecionado

    };


// ======================================================
// 17. VALIDAÇÕES
// ======================================================


// ======================================================
// TIPO DE ESTUDO
// ======================================================

if (
    tipoEstudo !==
    "categoria" &&

    tipoEstudo !==
    "mapa"
) {

    pergunta.textContent =
        "Erro: tipo de estudo inválido.";


    esconderLoadingJogo();


    mostrarErroAmigavel(
        "Configuração inválida",
        "Não foi possível identificar o tipo de estudo. Volte ao menu e escolha uma opção novamente."
    );


    throw new Error(
        "Tipo de estudo inválido."
    );

}


// ======================================================
// TÓPICO
// ======================================================

if (
    !topicoSelecionado
) {

    pergunta.textContent =
        "Erro: tópico não selecionado.";


    esconderLoadingJogo();


    mostrarErroAmigavel(
        "Tópico não selecionado",
        "Escolha um tópico antes de iniciar o jogo."
    );


    throw new Error(
        "Tópico não selecionado."
    );

}


// ======================================================
// CATEGORIA
// ======================================================

if (
    tipoEstudo ===
    "categoria" &&

    !categoriaSelecionada
) {

    pergunta.textContent =
        "Erro: categoria não selecionada.";


    esconderLoadingJogo();


    mostrarErroAmigavel(
        "Categoria não selecionada",
        "Escolha uma categoria de estruturas antes de iniciar o jogo."
    );


    throw new Error(
        "Categoria não selecionada."
    );

}


// ======================================================
// MAPA
// ======================================================

if (
    tipoEstudo ===
    "mapa" &&

    !mapaSelecionado
) {

    pergunta.textContent =
        "Erro: mapa não selecionado.";


    esconderLoadingJogo();


    mostrarErroAmigavel(
        "Mapa não selecionado",
        "Escolha um mapa anatômico antes de iniciar o jogo."
    );


    throw new Error(
        "Mapa não selecionado."
    );

}


// ======================================================
// QUESTÕES
// ======================================================

if (
    bancoQuestoes.length ===
    0
) {

    if (
        tipoEstudo ===
        "categoria"
    ) {

        pergunta.textContent =
            "Nenhuma estrutura dessa categoria foi encontrada neste tópico.";


        esconderLoadingJogo();


        mostrarErroAmigavel(
            "Nenhuma estrutura encontrada",
            "Não existem estruturas cadastradas nesta categoria para o tópico selecionado."
        );

    }

    else {

        pergunta.textContent =
            "Nenhuma estrutura foi encontrada nesse mapa.";


        esconderLoadingJogo();


        mostrarErroAmigavel(
            "Mapa sem estruturas",
            "Este mapa ainda não possui estruturas disponíveis para jogar."
        );

    }


    throw new Error(
        "Nenhuma questão encontrada."
    );

}


// ======================================================
// 18. LOGS
// ======================================================

console.log(
    "======================================"
);


console.log(
    "🧠 NEUROGAME"
);


console.log(
    "Tipo:",
    tipoEstudo
);


console.log(
    "Tópico:",
    topicoSelecionado
);


console.log(
    "Categoria:",
    categoriaSelecionada
);


console.log(
    "Mapa:",
    mapaSelecionado
);


console.log(
    "Modo:",
    modoSelecionado
);


console.log(
    "Total de questões:",
    totalQuestoesInicial
);


console.log(
    "======================================"
);


// ======================================================
// 19. INICIAR MODO
// ======================================================

if (
    modoSelecionado ===
    "clicar"
) {

    document.body.classList.add(
        "modo-clicar"
    );


    iniciarModoClicar();

}


else if (
    modoSelecionado ===
    "digitar"
) {

    document.body.classList.add(
        "modo-digitar"
    );


    iniciarModoDigitar();

}


else {

    pergunta.textContent =
        "Modo inválido.";


    console.error(
        "Modo inválido:",
        modoSelecionado
    );


    esconderLoadingJogo();


    mostrarErroAmigavel(
        "Modo de jogo inválido",
        "Não foi possível identificar o modo de jogo. Volte ao menu e tente novamente."
    );

}


// ======================================================
// 20. ERRO AMIGÁVEL
// ======================================================

function mostrarErroAmigavel(
    titulo,
    mensagem
) {

    const antigo =
        document.getElementById(
            "erroAmigavelNeuroGame"
        );


    if (
        antigo
    ) {

        antigo.remove();

    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "erroAmigavelNeuroGame";


    overlay.className =
        "erro-amigavel-overlay";


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "erro-amigavel-card";


    const tituloElemento =
        document.createElement(
            "h2"
        );


    tituloElemento.textContent =
        titulo;


    const texto =
        document.createElement(
            "p"
        );


    texto.textContent =
        mensagem;


    const botoes =
        document.createElement(
            "div"
        );


    botoes.className =
        "erro-amigavel-botoes";


    const tentarNovamente =
        document.createElement(
            "button"
        );


    tentarNovamente.type =
        "button";


    tentarNovamente.textContent =
        "🔄 Tentar novamente";


    tentarNovamente.addEventListener(
        "click",

        function() {

            window.location.reload();

        }
    );


    const voltarMenu =
        document.createElement(
            "button"
        );


    voltarMenu.type =
        "button";


    voltarMenu.textContent =
        "← Voltar ao menu";


    voltarMenu.addEventListener(
        "click",

        function() {

            window.location.href =
                "jogo-menu.html";

        }
    );


    botoes.appendChild(
        tentarNovamente
    );


    botoes.appendChild(
        voltarMenu
    );


    card.appendChild(
        tituloElemento
    );


    card.appendChild(
        texto
    );


    card.appendChild(
        botoes
    );


    overlay.appendChild(
        card
    );


    document.body.appendChild(
        overlay
    );

}