// ======================================================
// MENU DO JOGO — NEUROGAME
//
// SUPORTA:
// - Seleção por tópico
// - Estudo por estruturas
// - Estudo por mapa
// - Mapas mistos
// - Prova com múltiplos tópicos
// ======================================================


// ======================================================
// 1. NOMES DOS TÓPICOS
// ======================================================

const TOPICOS_NEUROGAME = {

    medula:
        "Medula Espinhal",

    tronco:
        "Tronco Encefálico",

    cerebelo:
        "Cerebelo",

    diencefalo:
        "Diencéfalo",

    telencefalo:
        "Telencéfalo",

    vascularizacao:
        "Vascularização do SN",

    nucleosdabase:
        "Núcleos da Base e Regiões Capsulares"

};


// ======================================================
// 2. CATEGORIAS POR TÓPICO
// ======================================================

const CATEGORIAS_POR_TOPICO = {

    telencefalo: [

        {
            id: "giro",
            nome: "🧠 Giros"
        },

        {
            id: "sulco",
            nome: "➰ Sulcos"
        },

        {
            id: "lobo",
            nome: "🧩 Lobos e Lóbulos"
        },

        {
            id: "nucleosdabase",
            nome: "🧠 Núcleos da Base e Regiões Capsulares"
        }

    ],


    diencefalo: [

        {
            id: "talamo",
            nome: "🧠 Tálamo"
        },

        {
            id: "hipotalamo",
            nome: "🧠 Hipotálamo"
        },

        {
            id: "epitalamo",
            nome: "🧠 Epitálamo"
        },

        {
            id: "subtalamo",
            nome: "🧠 Subtálamo"
        }

    ]

};


// ======================================================
// 3. ELEMENTOS — MENU PRINCIPAL
// ======================================================

const botaoPorEstrutura =
    document.getElementById(
        "escolherPorEstrutura"
    );


const botaoPorMapa =
    document.getElementById(
        "escolherPorMapa"
    );


const menuTipoEstudo =
    document.getElementById(
        "menuTipoEstudo"
    );


// ======================================================
// 4. ELEMENTOS — CATEGORIAS
// ======================================================

const menuCategorias =
    document.getElementById(
        "menuCategorias"
    );


const botaoVoltarTipoEstrutura =
    document.getElementById(
        "voltarTipoEstrutura"
    );


// ======================================================
// 5. ELEMENTOS — MAPAS
// ======================================================

const menuMapas =
    document.getElementById(
        "menuMapas"
    );


const listaMapasJogo =
    document.getElementById(
        "listaMapasJogo"
    );


const botaoVoltarTipoMapa =
    document.getElementById(
        "voltarTipoMapa"
    );


// ======================================================
// 6. ELEMENTOS — MODOS
// ======================================================

const menuModos =
    document.getElementById(
        "menuModos"
    );


const botoesModo =
    document.querySelectorAll(
        ".botao-modo"
    );


const botaoVoltarEscolha =
    document.getElementById(
        "voltarEscolha"
    );


// ======================================================
// 7. ELEMENTOS — PROVA
// ======================================================

const botaoEscolherModoProva =
    document.getElementById(
        "escolherModoProva"
    );


const menuProvaInicial =
    document.getElementById(
        "menuProvaInicial"
    );


const menuConfiguracaoProva =
    document.getElementById(
        "menuConfiguracaoProva"
    );


const botaoVoltarModoProva =
    document.getElementById(
        "voltarModoProva"
    );


const botaoIniciarProva =
    document.getElementById(
        "iniciarProva"
    );


const quantidadeProva =
    document.getElementById(
        "quantidadeProva"
    );


const modoRespostaProva =
    document.getElementById(
        "modoRespostaProva"
    );

    const tempoQuestaoProva =
    document.getElementById(
        "tempoQuestaoProva"
    );


// ======================================================
// 8. ESTADO
// ======================================================

let tipoEstudoSelecionado =
    null;


let topicoSelecionado =
    null;


let categoriaSelecionada =
    null;


let mapaSelecionado =
    null;


let areaTopicosProva =
    null;


// ======================================================
// 9. DESCOBRIR TÓPICO CADASTRADO NO MAPA
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
// 10. DESCOBRIR TÓPICO DA ESTRUTURA
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
        id.startsWith("giro_") ||
        id.startsWith("sulco_") ||
        id.startsWith("lobo_") ||
        id.startsWith("lobulo_") ||
        id.startsWith("nucleosdabase_") ||
        id.startsWith("trans_")
    ) {

        return "telencefalo";

    }


    // ==================================================
    // DIENCÉFALO
    // ==================================================

    if (
        id.startsWith("talamo_") ||
        id.startsWith("hipotalamo_") ||
        id.startsWith("epitalamo_") ||
        id.startsWith("subtalamo_")
    ) {

        return "diencefalo";

    }


    return null;

}


// ======================================================
// 11. VERIFICAR SE UM MAPA PERTENCE AO TÓPICO
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
    // VERIFICAR ESTRUTURAS
    //
    // Isso permite que o mesmo mapa pertença
    // a mais de um tópico.
    // ==================================================

    if (
        Array.isArray(
            mapa.estruturas
        )
    ) {

        const encontrou =
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
            encontrou
        ) {

            return true;

        }

    }


    // ==================================================
    // FALLBACK PARA MAPAS ANTIGOS
    // ==================================================

    return (
        obterTopicoMapa(
            mapa
        ) ===
        topico
    );

}


// ======================================================
// 12. DESCOBRIR TÓPICOS DISPONÍVEIS
// ======================================================

function obterTopicosDisponiveis() {

    const conjunto =
        new Set();


    if (
        typeof catalogoMapas ===
        "undefined"
    ) {

        return [];

    }


    catalogoMapas.forEach(
        function(mapa) {

            // ==========================================
            // TÓPICO DO MAPA
            // ==========================================

            const topicoMapa =
                obterTopicoMapa(
                    mapa
                );


            if (
                topicoMapa
            ) {

                conjunto.add(
                    topicoMapa
                );

            }


            // ==========================================
            // TÓPICOS ENCONTRADOS NAS ESTRUTURAS
            // ==========================================

            if (
                Array.isArray(
                    mapa.estruturas
                )
            ) {

                mapa.estruturas.forEach(
                    function(
                        estrutura
                    ) {

                        const topicoEstrutura =
                            obterTopicoEstrutura(
                                estrutura
                            );


                        if (
                            topicoEstrutura
                        ) {

                            conjunto.add(
                                topicoEstrutura
                            );

                        }

                    }
                );

            }

        }
    );


    return Array.from(
        conjunto
    );

}


// ======================================================
// 13. CRIAR MENU DE TÓPICOS
// ======================================================

const menuTopicos =
    document.createElement(
        "section"
    );


menuTopicos.id =
    "menuTopicos";


menuTopicos.classList.add(
    "menu-secundario"
);


menuTopicos.style.display =
    "none";


const tituloMenuTopicos =
    document.createElement(
        "h2"
    );


tituloMenuTopicos.textContent =
    "Escolha o conteúdo";


menuTopicos.appendChild(
    tituloMenuTopicos
);


const subtituloMenuTopicos =
    document.createElement(
        "p"
    );


subtituloMenuTopicos.textContent =
    "Selecione o tópico que você deseja estudar.";


menuTopicos.appendChild(
    subtituloMenuTopicos
);


const listaTopicos =
    document.createElement(
        "div"
    );


listaTopicos.id =
    "listaTopicos";


listaTopicos.classList.add(
    "lista-topicos"
);


menuTopicos.appendChild(
    listaTopicos
);


const botaoVoltarTopicos =
    document.createElement(
        "button"
    );


botaoVoltarTopicos.type =
    "button";


botaoVoltarTopicos.classList.add(
    "botao-voltar"
);


botaoVoltarTopicos.textContent =
    "← Voltar";


menuTopicos.appendChild(
    botaoVoltarTopicos
);


if (
    menuTipoEstudo &&
    menuTipoEstudo.parentNode
) {

    menuTipoEstudo
        .parentNode
        .appendChild(
            menuTopicos
        );

}


// ======================================================
// 14. CRIAR BOTÕES DOS TÓPICOS
// ======================================================

function criarBotoesTopicos() {

    listaTopicos.innerHTML =
        "";


    const topicosDisponiveis =
        obterTopicosDisponiveis();


    if (
        topicosDisponiveis.length ===
        0
    ) {

        const mensagem =
            document.createElement(
                "p"
            );


        mensagem.textContent =
            "Nenhum tópico disponível.";


        listaTopicos.appendChild(
            mensagem
        );


        return;

    }


    topicosDisponiveis.forEach(
        function(topico) {

            const botao =
                document.createElement(
                    "button"
                );


            botao.type =
                "button";


            botao.classList.add(
                "botao-categoria",
                "botao-topico"
            );


            botao.dataset.topico =
                topico;


            botao.textContent =
                TOPICOS_NEUROGAME[
                    topico
                ] ||
                topico;


            botao.addEventListener(
                "click",

                function() {

                    topicoSelecionado =
                        topico;


                    categoriaSelecionada =
                        null;


                    mapaSelecionado =
                        null;


                    console.log(
                        "📚 Tópico selecionado:",
                        topicoSelecionado
                    );


                    esconderMenuTopicos();


                    // ==================================
                    // POR ESTRUTURAS
                    // ==================================

                    if (
                        tipoEstudoSelecionado ===
                        "categoria"
                    ) {

                        criarCategoriasDoTopico();


                        if (
                            menuCategorias
                        ) {

                            menuCategorias
                                .classList
                                .add(
                                    "visivel"
                                );

                        }

                    }


                    // ==================================
                    // POR MAPA
                    // ==================================

                    else if (
                        tipoEstudoSelecionado ===
                        "mapa"
                    ) {

                        criarListaMapasJogo();


                        if (
                            menuMapas
                        ) {

                            menuMapas
                                .classList
                                .add(
                                    "visivel"
                                );

                        }

                    }

                }
            );


            listaTopicos.appendChild(
                botao
            );

        }
    );

}


// ======================================================
// 15. MOSTRAR MENU DE TÓPICOS
// ======================================================

function mostrarMenuTopicos() {

    esconderMenusSecundarios();


    criarBotoesTopicos();


    menuTopicos.style.display =
        "flex";

}


// ======================================================
// 16. ESCONDER MENU DE TÓPICOS
// ======================================================

function esconderMenuTopicos() {

    menuTopicos.style.display =
        "none";

}


// ======================================================
// 17. ESCONDER MENUS SECUNDÁRIOS
// ======================================================

function esconderMenusSecundarios() {

    esconderMenuTopicos();


    if (
        menuCategorias
    ) {

        menuCategorias
            .classList
            .remove(
                "visivel"
            );

    }


    if (
        menuMapas
    ) {

        menuMapas
            .classList
            .remove(
                "visivel"
            );

    }


    if (
        menuModos
    ) {

        menuModos
            .classList
            .remove(
                "visivel"
            );

    }


    if (
        menuConfiguracaoProva
    ) {

        menuConfiguracaoProva
            .classList
            .remove(
                "visivel"
            );

    }

}


// ======================================================
// 18. MOSTRAR MENU INICIAL
// ======================================================

function mostrarMenuInicial() {

    esconderMenusSecundarios();


    if (
        menuTipoEstudo
    ) {

        menuTipoEstudo.style.display =
            "flex";

    }


    if (
        menuProvaInicial
    ) {

        menuProvaInicial.style.display =
            "flex";

    }


    tipoEstudoSelecionado =
        null;


    topicoSelecionado =
        null;


    categoriaSelecionada =
        null;


    mapaSelecionado =
        null;


    if (
        menuCategorias
    ) {

        menuCategorias
            .querySelectorAll(
                ".botao-categoria[data-categoria]"
            )
            .forEach(
                function(botao) {

                    botao.classList.remove(
                        "selecionado"
                    );

                }
            );

    }

}


// ======================================================
// 19. POR ESTRUTURAS
// ======================================================

if (
    botaoPorEstrutura
) {

    botaoPorEstrutura.addEventListener(
        "click",

        function() {

            tipoEstudoSelecionado =
                "categoria";


            topicoSelecionado =
                null;


            categoriaSelecionada =
                null;


            mapaSelecionado =
                null;


            if (
                menuTipoEstudo
            ) {

                menuTipoEstudo.style.display =
                    "none";

            }


            if (
                menuProvaInicial
            ) {

                menuProvaInicial.style.display =
                    "none";

            }


            mostrarMenuTopicos();

        }
    );

}


// ======================================================
// 20. POR MAPA
// ======================================================

if (
    botaoPorMapa
) {

    botaoPorMapa.addEventListener(
        "click",

        function() {

            tipoEstudoSelecionado =
                "mapa";


            topicoSelecionado =
                null;


            categoriaSelecionada =
                null;


            mapaSelecionado =
                null;


            if (
                menuTipoEstudo
            ) {

                menuTipoEstudo.style.display =
                    "none";

            }


            if (
                menuProvaInicial
            ) {

                menuProvaInicial.style.display =
                    "none";

            }


            mostrarMenuTopicos();

        }
    );

}


// ======================================================
// 21. VOLTAR DOS TÓPICOS
// ======================================================

botaoVoltarTopicos.addEventListener(
    "click",

    function() {

        mostrarMenuInicial();

    }
);


// ======================================================
// 22. CRIAR CATEGORIAS DO TÓPICO
// ======================================================

function criarCategoriasDoTopico() {

    if (
        !menuCategorias ||
        !topicoSelecionado
    ) {

        return;

    }


    const avisoAntigo =
        menuCategorias.querySelector(
            ".aviso-sem-categorias"
        );


    if (
        avisoAntigo
    ) {

        avisoAntigo.remove();

    }


    const botoesAntigos =
        menuCategorias.querySelectorAll(
            ".botao-categoria[data-categoria]"
        );


    botoesAntigos.forEach(
        function(botao) {

            botao.remove();

        }
    );


    const categorias =
        CATEGORIAS_POR_TOPICO[
            topicoSelecionado
        ] || [];


    console.log(
        "📚 Categorias do tópico:",
        topicoSelecionado,
        categorias
    );


    if (
        categorias.length ===
        0
    ) {

        const aviso =
            document.createElement(
                "p"
            );


        aviso.className =
            "aviso-sem-categorias";


        aviso.textContent =
            "Ainda não existem categorias cadastradas para este conteúdo.";


        if (
            botaoVoltarTipoEstrutura
        ) {

            menuCategorias.insertBefore(
                aviso,
                botaoVoltarTipoEstrutura
            );

        }

        else {

            menuCategorias.appendChild(
                aviso
            );

        }


        return;

    }


    categorias.forEach(
        function(categoria) {

            const botao =
                document.createElement(
                    "button"
                );


            botao.type =
                "button";


            botao.classList.add(
                "botao-categoria"
            );


            botao.dataset.categoria =
                categoria.id;


            botao.textContent =
                categoria.nome;


            botao.addEventListener(
                "click",

                function() {

                    categoriaSelecionada =
                        categoria.id;


                    mapaSelecionado =
                        null;


                    console.log(
                        "🧠 Categoria selecionada:",
                        categoriaSelecionada
                    );


                    const todosBotoes =
                        menuCategorias.querySelectorAll(
                            ".botao-categoria[data-categoria]"
                        );


                    todosBotoes.forEach(
                        function(outroBotao) {

                            outroBotao
                                .classList
                                .remove(
                                    "selecionado"
                                );

                        }
                    );


                    botao.classList.add(
                        "selecionado"
                    );


                    menuCategorias
                        .classList
                        .remove(
                            "visivel"
                        );


                    if (
                        menuModos
                    ) {

                        menuModos
                            .classList
                            .add(
                                "visivel"
                            );

                    }

                }
            );


            if (
                botaoVoltarTipoEstrutura
            ) {

                menuCategorias.insertBefore(
                    botao,
                    botaoVoltarTipoEstrutura
                );

            }

            else {

                menuCategorias.appendChild(
                    botao
                );

            }

        }
    );

}


// ======================================================
// 23. CRIAR LISTA DE MAPAS
// ======================================================

function criarListaMapasJogo() {

    if (
        !listaMapasJogo
    ) {

        return;

    }


    listaMapasJogo.innerHTML =
        "";


    if (
        typeof catalogoMapas ===
        "undefined"
    ) {

        console.error(
            "❌ catalogoMapas não encontrado."
        );


        return;

    }


    // ==================================================
    // MAPAS PODEM PERTENCER A MAIS DE UM TÓPICO
    // ==================================================

    const mapasFiltrados =
        catalogoMapas.filter(
            function(mapa) {

                if (
                    !topicoSelecionado
                ) {

                    return true;

                }


                return mapaPertenceAoTopico(
                    mapa,
                    topicoSelecionado
                );

            }
        );


    if (
        mapasFiltrados.length ===
        0
    ) {

        const mensagem =
            document.createElement(
                "p"
            );


        mensagem.textContent =
            "Nenhum mapa disponível para este tópico.";


        listaMapasJogo.appendChild(
            mensagem
        );


        return;

    }


    mapasFiltrados.forEach(
        function(mapa) {

            const botao =
                document.createElement(
                    "button"
                );


            botao.type =
                "button";


            botao.classList.add(
                "card-atlas"
            );


            botao.dataset.mapa =
                mapa.id;


            const imagemMapa =
                document.createElement(
                    "img"
                );


            imagemMapa.src =
                mapa.imagem;


            imagemMapa.alt =
                mapa.titulo;


            const titulo =
                document.createElement(
                    "span"
                );


            titulo.textContent =
                mapa.titulo;


            botao.appendChild(
                imagemMapa
            );


            botao.appendChild(
                titulo
            );


            botao.addEventListener(
                "click",

                function() {

                    mapaSelecionado =
                        mapa.id;


                    categoriaSelecionada =
                        null;


                    const cards =
                        listaMapasJogo
                            .querySelectorAll(
                                ".card-atlas"
                            );


                    cards.forEach(
                        function(card) {

                            card.classList.remove(
                                "selecionado"
                            );

                        }
                    );


                    botao.classList.add(
                        "selecionado"
                    );


                    if (
                        menuMapas
                    ) {

                        menuMapas
                            .classList
                            .remove(
                                "visivel"
                            );

                    }


                    if (
                        menuModos
                    ) {

                        menuModos
                            .classList
                            .add(
                                "visivel"
                            );

                    }

                }
            );


            listaMapasJogo.appendChild(
                botao
            );

        }
    );


    console.log(
        "🗺️ Mapas disponíveis para:",
        topicoSelecionado,
        mapasFiltrados.length
    );

}


// ======================================================
// 24. ESCOLHER MODO
// ======================================================

botoesModo.forEach(
    function(botao) {

        botao.addEventListener(
            "click",

            function() {

                const modo =
                    botao.dataset.modo;


                // ======================================
                // POR CATEGORIA
                // ======================================

                if (
                    tipoEstudoSelecionado ===
                    "categoria"
                ) {

                    if (
                        !topicoSelecionado
                    ) {

                        alert(
                            "Escolha um tópico primeiro."
                        );


                        return;

                    }


                    if (
                        !categoriaSelecionada
                    ) {

                        alert(
                            "Escolha uma categoria."
                        );


                        return;

                    }


                    window.location.href =
                        `jogo.html?tipo=categoria&categoria=${encodeURIComponent(
                            categoriaSelecionada
                        )}&topico=${encodeURIComponent(
                            topicoSelecionado
                        )}&modo=${encodeURIComponent(
                            modo
                        )}`;


                    return;

                }


                // ======================================
                // POR MAPA
                // ======================================

                if (
                    tipoEstudoSelecionado ===
                    "mapa"
                ) {

                    if (
                        !topicoSelecionado
                    ) {

                        alert(
                            "Escolha um tópico primeiro."
                        );


                        return;

                    }


                    if (
                        !mapaSelecionado
                    ) {

                        alert(
                            "Escolha um mapa."
                        );


                        return;

                    }


                    window.location.href =
                        `jogo.html?tipo=mapa&mapa=${encodeURIComponent(
                            mapaSelecionado
                        )}&topico=${encodeURIComponent(
                            topicoSelecionado
                        )}&modo=${encodeURIComponent(
                            modo
                        )}`;


                    return;

                }


                alert(
                    "Escolha como você quer estudar."
                );

            }
        );

    }
);


// ======================================================
// 25. VOLTAR — CATEGORIA
// ======================================================

if (
    botaoVoltarTipoEstrutura
) {

    botaoVoltarTipoEstrutura.addEventListener(
        "click",

        function() {

            if (
                menuCategorias
            ) {

                menuCategorias
                    .classList
                    .remove(
                        "visivel"
                    );

            }


            topicoSelecionado =
                null;


            categoriaSelecionada =
                null;


            mostrarMenuTopicos();

        }
    );

}


// ======================================================
// 26. VOLTAR — MAPA
// ======================================================

if (
    botaoVoltarTipoMapa
) {

    botaoVoltarTipoMapa.addEventListener(
        "click",

        function() {

            if (
                menuMapas
            ) {

                menuMapas
                    .classList
                    .remove(
                        "visivel"
                    );

            }


            mapaSelecionado =
                null;


            topicoSelecionado =
                null;


            mostrarMenuTopicos();

        }
    );

}


// ======================================================
// 27. VOLTAR DA ESCOLHA CLICAR / DIGITAR
// ======================================================

if (
    botaoVoltarEscolha
) {

    botaoVoltarEscolha.addEventListener(
        "click",

        function() {

            if (
                menuModos
            ) {

                menuModos
                    .classList
                    .remove(
                        "visivel"
                    );

            }


            if (
                tipoEstudoSelecionado ===
                "categoria"
            ) {

                categoriaSelecionada =
                    null;


                criarCategoriasDoTopico();


                if (
                    menuCategorias
                ) {

                    menuCategorias
                        .classList
                        .add(
                            "visivel"
                        );

                }

            }


            else if (
                tipoEstudoSelecionado ===
                "mapa"
            ) {

                mapaSelecionado =
                    null;


                criarListaMapasJogo();


                if (
                    menuMapas
                ) {

                    menuMapas
                        .classList
                        .add(
                            "visivel"
                        );

                }

            }

        }
    );

}


// ======================================================
// 28. CRIAR SELEÇÃO DE TÓPICOS DA PROVA
// ======================================================

function criarSelecaoTopicosProva() {

    if (
        !menuConfiguracaoProva
    ) {

        return;

    }


    const existente =
        document.getElementById(
            "areaTopicosProva"
        );


    if (
        existente
    ) {

        existente.remove();

    }


    areaTopicosProva =
        document.createElement(
            "div"
        );


    areaTopicosProva.id =
        "areaTopicosProva";


    areaTopicosProva.classList.add(
        "area-topicos-prova"
    );


    const titulo =
        document.createElement(
            "h3"
        );


    titulo.textContent =
        "Conteúdos da prova";


    areaTopicosProva.appendChild(
        titulo
    );


    const descricao =
        document.createElement(
            "p"
        );


    descricao.textContent =
        "Selecione um ou mais tópicos para incluir na prova.";


    areaTopicosProva.appendChild(
        descricao
    );


    const lista =
        document.createElement(
            "div"
        );


    lista.classList.add(
        "lista-topicos-prova"
    );


    const topicos =
        obterTopicosDisponiveis();


    if (
        topicos.length ===
        0
    ) {

        const aviso =
            document.createElement(
                "p"
            );


        aviso.textContent =
            "Nenhum conteúdo disponível.";


        lista.appendChild(
            aviso
        );

    }


    topicos.forEach(
        function(topico) {

            const label =
                document.createElement(
                    "label"
                );


            label.classList.add(
                "opcao-topico-prova"
            );


            const checkbox =
                document.createElement(
                    "input"
                );


            checkbox.type =
                "checkbox";


            checkbox.value =
                topico;


            checkbox.classList.add(
                "checkbox-topico-prova"
            );


            const texto =
                document.createElement(
                    "span"
                );


            texto.textContent =
                TOPICOS_NEUROGAME[
                    topico
                ] ||
                topico;


            label.appendChild(
                checkbox
            );


            label.appendChild(
                texto
            );


            lista.appendChild(
                label
            );

        }
    );


    areaTopicosProva.appendChild(
        lista
    );


    if (
        botaoIniciarProva &&
        botaoIniciarProva.parentNode ===
        menuConfiguracaoProva
    ) {

        menuConfiguracaoProva
            .insertBefore(
                areaTopicosProva,
                botaoIniciarProva
            );

    }

    else {

        menuConfiguracaoProva
            .appendChild(
                areaTopicosProva
            );

    }

}


// ======================================================
// 29. ABRIR MODO PROVA
// ======================================================

if (
    botaoEscolherModoProva
) {

    botaoEscolherModoProva.addEventListener(
        "click",

        function() {

            console.log(
                "📝 Abrindo configuração da prova"
            );


            if (
                menuTipoEstudo
            ) {

                menuTipoEstudo.style.display =
                    "none";

            }


            if (
                menuProvaInicial
            ) {

                menuProvaInicial.style.display =
                    "none";

            }


            esconderMenusSecundarios();


            criarSelecaoTopicosProva();


            if (
                menuConfiguracaoProva
            ) {

                menuConfiguracaoProva
                    .classList
                    .add(
                        "visivel"
                    );

            }

        }
    );

}


// ======================================================
// 30. VOLTAR DO MODO PROVA
// ======================================================

if (
    botaoVoltarModoProva
) {

    botaoVoltarModoProva.addEventListener(
        "click",

        function() {

            mostrarMenuInicial();

        }
    );

}


// ======================================================
// 31. INICIAR PROVA
// ======================================================

if (
    botaoIniciarProva
) {

    botaoIniciarProva.addEventListener(
        "click",

        function() {

            const quantidade =
                parseInt(
                    quantidadeProva.value
                );


            const modo =
                modoRespostaProva.value;
            const tempo =
    tempoQuestaoProva
        ? parseInt(
            tempoQuestaoProva.value
        ) || 0
        : 0;


            if (
                !quantidade ||
                quantidade < 1
            ) {

                alert(
                    "Informe uma quantidade válida de questões."
                );


                return;

            }


            const checkboxes =
                document.querySelectorAll(
                    ".checkbox-topico-prova:checked"
                );


            const topicosSelecionados =
                Array.from(
                    checkboxes
                ).map(
                    function(checkbox) {

                        return checkbox.value;

                    }
                );


            if (
                topicosSelecionados.length ===
                0
            ) {

                alert(
                    "Selecione pelo menos um conteúdo para a prova."
                );


                return;

            }


            // ==================================================
            // MÍNIMO DE 1 QUESTÃO PARA CADA TÓPICO
            // ==================================================

            if (
                quantidade <
                topicosSelecionados.length
            ) {

                alert(
                    "A quantidade de questões precisa ser igual ou maior que o número de conteúdos selecionados."
                );


                return;

            }


            const topicosURL =
                topicosSelecionados.join(
                    ","
                );


            console.log(
                "📝 Iniciando prova"
            );


            console.log(
                "Quantidade:",
                quantidade
            );


            console.log(
                "Modo:",
                modo
            );


            console.log(
                "Tópicos:",
                topicosSelecionados
            );


window.location.href =
    `prova.html?quantidade=${quantidade}&modo=${encodeURIComponent(
        modo
    )}&topicos=${encodeURIComponent(
        topicosURL
    )}&tempo=${tempo}`;

        }
    );

}


// ======================================================
// 32. INICIAR MENU
// ======================================================

criarBotoesTopicos();


criarListaMapasJogo();


mostrarMenuInicial();


console.log(
    "✅ Menu do NeuroGame iniciado."
);