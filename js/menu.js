// ======================================================
// MENU DO JOGO — NEUROGAME
//
// SUPORTA:
// - Seleção por tópico
// - Estudo por estruturas
// - Estudo por mapa
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
        "Núcleos da Base e Regiões Capsulares",

};


// ======================================================
// 2. ELEMENTOS — MENU PRINCIPAL
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
// 3. ELEMENTOS — CATEGORIAS
// ======================================================

const menuCategorias =
    document.getElementById(
        "menuCategorias"
    );


const botoesCategoria =
    document.querySelectorAll(
        ".botao-categoria[data-categoria]"
    );


const botaoVoltarTipoEstrutura =
    document.getElementById(
        "voltarTipoEstrutura"
    );


// ======================================================
// 4. ELEMENTOS — MAPAS
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
// 5. ELEMENTOS — MODOS
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
// 6. ELEMENTOS — PROVA
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


// ======================================================
// 7. ESTADO
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
// 8. DESCOBRIR TÓPICO DO MAPA
// ======================================================

function obterTopicoMapa(
    mapa
) {

    // Se carregarMapas.js já copiou o tópico

    if (
        mapa &&
        mapa.topico
    ) {

        return mapa.topico;

    }


    // Caso contrário, procura no manifesto

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
// 9. DESCOBRIR TÓPICOS DISPONÍVEIS
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

            const topico =
                obterTopicoMapa(
                    mapa
                );


            if (
                topico
            ) {

                conjunto.add(
                    topico
                );

            }

        }
    );


    return Array.from(
        conjunto
    );

}


// ======================================================
// 10. CRIAR MENU DE TÓPICOS
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


// Título

const tituloMenuTopicos =
    document.createElement(
        "h2"
    );


tituloMenuTopicos.textContent =
    "Escolha o conteúdo";


menuTopicos.appendChild(
    tituloMenuTopicos
);


// Descrição

const subtituloMenuTopicos =
    document.createElement(
        "p"
    );


subtituloMenuTopicos.textContent =
    "Selecione o tópico que você deseja estudar.";


menuTopicos.appendChild(
    subtituloMenuTopicos
);


// Lista

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


// Botão voltar

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


// Inserir no HTML

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
// 11. CRIAR BOTÕES DOS TÓPICOS
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
// 12. MOSTRAR MENU DE TÓPICOS
// ======================================================

function mostrarMenuTopicos() {

    esconderMenusSecundarios();


    criarBotoesTopicos();


    menuTopicos.style.display =
        "flex";

}


// ======================================================
// 13. ESCONDER MENU DE TÓPICOS
// ======================================================

function esconderMenuTopicos() {

    menuTopicos.style.display =
        "none";

}


// ======================================================
// 14. ESCONDER MENUS SECUNDÁRIOS
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
// 15. MOSTRAR MENU INICIAL
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


    botoesCategoria.forEach(
        function(botao) {

            botao.classList.remove(
                "selecionado"
            );

        }
    );

}


// ======================================================
// 16. POR ESTRUTURAS
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
// 17. POR MAPA
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
// 18. VOLTAR DOS TÓPICOS
// ======================================================

botaoVoltarTopicos.addEventListener(
    "click",

    function() {

        mostrarMenuInicial();

    }
);


// ======================================================
// 19. ESCOLHER CATEGORIA
// ======================================================

botoesCategoria.forEach(
    function(botao) {

        botao.addEventListener(
            "click",

            function() {

                categoriaSelecionada =
                    botao.dataset.categoria;


                mapaSelecionado =
                    null;


                botoesCategoria.forEach(
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

    }
);


// ======================================================
// 20. CRIAR LISTA DE MAPAS
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


    const mapasFiltrados =
        catalogoMapas.filter(
            function(mapa) {

                const topicoMapa =
                    obterTopicoMapa(
                        mapa
                    );


                return (
                    !topicoSelecionado ||
                    topicoMapa ===
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


            // ==========================================
            // IMAGEM
            // ==========================================

            const imagemMapa =
                document.createElement(
                    "img"
                );


            imagemMapa.src =
                mapa.imagem;


            imagemMapa.alt =
                mapa.titulo;


            // ==========================================
            // TÍTULO
            // ==========================================

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


            // ==========================================
            // CLIQUE
            // ==========================================

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
        "🗺️ Mapas disponíveis:",
        mapasFiltrados.length
    );

}


// ======================================================
// 21. ESCOLHER MODO — CLICAR / DIGITAR
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
// 22. VOLTAR — CATEGORIA
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


            mostrarMenuTopicos();

        }
    );

}


// ======================================================
// 23. VOLTAR — MAPA
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
// 24. VOLTAR DA ESCOLHA CLICAR / DIGITAR
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
// 25. CRIAR SELEÇÃO DE TÓPICOS DA PROVA
// ======================================================

function criarSelecaoTopicosProva() {

    if (
        !menuConfiguracaoProva
    ) {

        return;

    }


    // ==========================================
    // SE JÁ EXISTIR, ATUALIZA
    // ==========================================

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


    // ==========================================
    // TÍTULO
    // ==========================================

    const titulo =
        document.createElement(
            "h3"
        );


    titulo.textContent =
        "Conteúdos da prova";


    areaTopicosProva.appendChild(
        titulo
    );


    // ==========================================
    // DESCRIÇÃO
    // ==========================================

    const descricao =
        document.createElement(
            "p"
        );


    descricao.textContent =
        "Selecione um ou mais tópicos para incluir na prova.";


    areaTopicosProva.appendChild(
        descricao
    );


    // ==========================================
    // LISTA
    // ==========================================

    const lista =
        document.createElement(
            "div"
        );


    lista.classList.add(
        "lista-topicos-prova"
    );


    const topicos =
        obterTopicosDisponiveis();


    // ==========================================
    // NENHUM TÓPICO
    // ==========================================

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


    // ==========================================
    // CRIAR CHECKBOXES
    // ==========================================

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


    // ==========================================
    // INSERIR ANTES DO BOTÃO INICIAR
    // ==========================================

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
// 26. ABRIR MODO PROVA
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


            // ==========================================
            // CRIAR TÓPICOS DA PROVA
            // ==========================================

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
// 27. VOLTAR DO MODO PROVA
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
// 28. INICIAR PROVA
// ======================================================

if (
    botaoIniciarProva
) {

    botaoIniciarProva.addEventListener(
        "click",

        function() {

            // ==========================================
            // QUANTIDADE
            // ==========================================

            const quantidade =
                parseInt(
                    quantidadeProva.value
                );


            // ==========================================
            // MODO
            // ==========================================

            const modo =
                modoRespostaProva.value;


            if (
                !quantidade ||
                quantidade < 1
            ) {

                alert(
                    "Informe uma quantidade válida de questões."
                );


                return;

            }


            // ==========================================
            // PEGAR TÓPICOS SELECIONADOS
            // ==========================================

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


            // ==========================================
            // EXIGIR PELO MENOS UM TÓPICO
            // ==========================================

            if (
                topicosSelecionados.length ===
                0
            ) {

                alert(
                    "Selecione pelo menos um conteúdo para a prova."
                );


                return;

            }


            // ==========================================
            // TRANSFORMAR EM TEXTO
            // ==========================================

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


            // ==========================================
            // ABRIR PROVA
            // ==========================================

            window.location.href =
                `prova.html?quantidade=${quantidade}&modo=${encodeURIComponent(
                    modo
                )}&topicos=${encodeURIComponent(
                    topicosURL
                )}`;

        }
    );

}


// ======================================================
// 29. INICIAR MENU
// ======================================================

criarBotoesTopicos();


criarListaMapasJogo();


mostrarMenuInicial();


console.log(
    "✅ Menu do NeuroGame iniciado."
);