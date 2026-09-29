// ======================================================
// GAME — NEUROGAME
//
// SUPORTA:
//
// - ESTUDO POR CATEGORIA
// - ESTUDO POR MAPA
// - ESTUDO POR TÓPICO
// - MAPAS MISTOS
// - TROCA AUTOMÁTICA DE IMAGENS
// - REUTILIZAÇÃO DA MESMA IMAGEM ENTRE QUESTÕES
// ======================================================


// ======================================================
// 1. PARÂMETROS DA URL
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
// 3. NOMES DOS TÓPICOS
// ======================================================

const NOMES_TOPICOS_NEUROGAME = {

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
        "Vascularização do SN"

};


// ======================================================
// 4. DESCOBRIR TÓPICO DO MAPA
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
                function(
                    item
                ) {

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
// 5. DESCOBRIR CATEGORIA DA ESTRUTURA
// ======================================================

function obterCategoria(
    estrutura
) {

    if (
        !estrutura ||
        !estrutura.id
    ) {

        return "outros";

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
// 6. DESCOBRIR TÓPICO DA ESTRUTURA
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


    /*
        Para estruturas que ainda não usam
        prefixos específicos, retornamos null.

        Depois usamos o tópico do mapa
        como fallback.
    */

    return null;

}


// ======================================================
// 7. TÓPICO REAL DE UMA ESTRUTURA
//
// Primeiro tenta pela estrutura.
// Se não conseguir, usa o tópico do mapa.
// ======================================================

function obterTopicoRealEstrutura(
    estrutura,
    mapa
) {

    const topicoEstrutura =
        obterTopicoEstrutura(
            estrutura
        );


    if (
        topicoEstrutura
    ) {

        return topicoEstrutura;

    }


    return obterTopicoMapa(
        mapa
    );

}


// ======================================================
// 8. VERIFICAR SE MAPA POSSUI O TÓPICO
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


    if (
        Array.isArray(
            mapa.estruturas
        )
    ) {

        const possui =
            mapa.estruturas.some(
                function(
                    estrutura
                ) {

                    return (

                        obterTopicoRealEstrutura(
                            estrutura,
                            mapa
                        ) ===
                        topico

                    );

                }
            );


        if (
            possui
        ) {

            return true;

        }

    }


    return (

        obterTopicoMapa(
            mapa
        ) ===
        topico

    );

}


// ======================================================
// 9. ESTRUTURAS DO MAPA
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
    // MODO TÓPICO
    //
    // PEGA SOMENTE AS ESTRUTURAS DO TÓPICO
    // ==================================================

    if (
        tipoEstudo ===
        "topico"
    ) {

        return mapa
            .estruturas
            .filter(
                function(
                    estrutura
                ) {

                    return (

                        obterTopicoRealEstrutura(
                            estrutura,
                            mapa
                        ) ===
                        topicoSelecionado

                    );

                }
            );

    }


    // ==================================================
    // MODO MAPA
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

                            obterTopicoRealEstrutura(
                                estrutura,
                                mapa
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
    // MODO CATEGORIA
    // ==================================================

    if (
        tipoEstudo ===
        "categoria"
    ) {

        return mapa
            .estruturas
            .filter(
                function(
                    estrutura
                ) {

                    const pertenceAoTopico =

                        !topicoSelecionado ||

                        obterTopicoRealEstrutura(
                            estrutura,
                            mapa
                        ) ===
                        topicoSelecionado;


                    const pertenceCategoria =

                        obterCategoria(
                            estrutura
                        ) ===
                        categoriaSelecionada;


                    return (

                        pertenceAoTopico &&
                        pertenceCategoria

                    );

                }
            );

    }


    return [];

}


// ======================================================
// 10. BANCO DE QUESTÕES
// ======================================================

let bancoQuestoes =
    [];


// ======================================================
// 11. MODO — CATEGORIA
// ======================================================

if (
    tipoEstudo ===
    "categoria"
) {

    catalogoMapas.forEach(
        function(
            mapa
        ) {

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
// 12. MODO — MAPA
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

                if (
                    mapa.id !==
                    mapaSelecionado
                ) {

                    return false;

                }


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
// 13. MODO — TÓPICO
//
// NOVO MODO.
//
// Exemplo:
//
// tipo=topico
// topico=diencefalo
//
// Percorre TODOS os mapas e adiciona TODAS
// as estruturas pertencentes ao Diencéfalo.
// ======================================================

else if (
    tipoEstudo ===
    "topico"
) {

    catalogoMapas.forEach(
        function(
            mapa
        ) {

            if (
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
// 14. REMOVER QUESTÕES DUPLICADAS
//
// Evita a mesma estrutura do mesmo mapa
// entrar duas vezes.
// ======================================================

function removerQuestoesDuplicadas(
    lista
) {

    const vistos =
        new Set();


    return lista.filter(
        function(
            questao
        ) {

            const chave =
                `${questao.mapa.id}::${questao.estrutura.id}`;


            if (
                vistos.has(
                    chave
                )
            ) {

                return false;

            }


            vistos.add(
                chave
            );


            return true;

        }
    );

}


bancoQuestoes =
    removerQuestoesDuplicadas(
        bancoQuestoes
    );


// ======================================================
// 15. EMBARALHAR
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
// 16. TOTAL ORIGINAL
// ======================================================

const totalQuestoesInicial =
    bancoQuestoes.length;


// ======================================================
// 17. MAPA ANTERIOR
//
// Usado para evitar repetir a mesma imagem
// consecutivamente quando existem alternativas.
// ======================================================

let mapaAnterior =
    null;


// ======================================================
// 18. PEGAR PRÓXIMA QUESTÃO
// ======================================================

function obterProximaQuestao() {

    if (
        bancoQuestoes.length ===
        0
    ) {

        return null;

    }


    // ==================================================
    // MODO MAPA
    //
    // Só existe uma imagem.
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
    // CATEGORIA OU TÓPICO
    //
    // Tenta variar a imagem entre perguntas.
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
// 19. CRIAR HOTSPOTS SVG
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
            // ÁREA
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
            // HITBOX PARA LINHAS
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
// 20. NORMALIZAR URL DA IMAGEM
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
// 21. CARREGAR QUESTÃO
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
            )
                .find(
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
    // IMAGEM JÁ CARREGADA
    // ==================================================

    if (
        mesmaImagem &&
        imagem.complete &&
        imagem.naturalWidth > 0
    ) {

        prepararQuestao();


        if (
            typeof esconderLoadingJogo ===
            "function"
        ) {

            esconderLoadingJogo();

        }


        return;

    }


    // ==================================================
    // CARREGAR NOVA IMAGEM
    // ==================================================

    imagem.onload =
        null;


    imagem.onerror =
        null;


    imagem.onload =
        function() {

            prepararQuestao();


            if (
                typeof esconderLoadingJogo ===
                "function"
            ) {

                esconderLoadingJogo();

            }

        };


    imagem.onerror =
        function() {

            pergunta.textContent =
                "Erro ao carregar a imagem.";


            console.error(
                "❌ Erro ao carregar:",
                mapa.imagem
            );


            if (
                typeof esconderLoadingJogo ===
                "function"
            ) {

                esconderLoadingJogo();

            }


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
// 22. DISPONIBILIZAR PARA OS MODOS
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
            topicoSelecionado,

        nomeTopico:
            NOMES_TOPICOS_NEUROGAME[
                topicoSelecionado
            ] ||
            topicoSelecionado

    };


// ======================================================
// 23. VALIDAÇÕES
// ======================================================


// ======================================================
// TIPO
// ======================================================

if (
    tipoEstudo !==
    "categoria" &&

    tipoEstudo !==
    "mapa" &&

    tipoEstudo !==
    "topico"
) {

    pergunta.textContent =
        "Erro: tipo de estudo inválido.";


    if (
        typeof esconderLoadingJogo ===
        "function"
    ) {

        esconderLoadingJogo();

    }


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
//
// Categoria e o novo modo tópico exigem tópico.
// ======================================================

if (
    (
        tipoEstudo ===
        "categoria" ||

        tipoEstudo ===
        "topico"
    ) &&

    !topicoSelecionado
) {

    pergunta.textContent =
        "Erro: tópico não selecionado.";


    if (
        typeof esconderLoadingJogo ===
        "function"
    ) {

        esconderLoadingJogo();

    }


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


    if (
        typeof esconderLoadingJogo ===
        "function"
    ) {

        esconderLoadingJogo();

    }


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


    if (
        typeof esconderLoadingJogo ===
        "function"
    ) {

        esconderLoadingJogo();

    }


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
        "topico"
    ) {

        pergunta.textContent =
            "Nenhuma estrutura encontrada neste tópico.";


        mostrarErroAmigavel(

            "Tópico sem estruturas",

            `Não existem estruturas cadastradas para ${
                NOMES_TOPICOS_NEUROGAME[
                    topicoSelecionado
                ] ||
                topicoSelecionado
            }.`

        );

    }


    else if (
        tipoEstudo ===
        "categoria"
    ) {

        pergunta.textContent =
            "Nenhuma estrutura dessa categoria foi encontrada neste tópico.";


        mostrarErroAmigavel(

            "Nenhuma estrutura encontrada",

            "Não existem estruturas cadastradas nesta categoria para o tópico selecionado."

        );

    }


    else {

        pergunta.textContent =
            "Nenhuma estrutura foi encontrada nesse mapa.";


        mostrarErroAmigavel(

            "Mapa sem estruturas",

            "Este mapa ainda não possui estruturas disponíveis para jogar."

        );

    }


    if (
        typeof esconderLoadingJogo ===
        "function"
    ) {

        esconderLoadingJogo();

    }


    throw new Error(
        "Nenhuma questão encontrada."
    );

}


// ======================================================
// 24. LOGS
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


if (
    tipoEstudo ===
    "topico"
) {

    console.log(
        "🎮 Jogando todas as estruturas de:",
        NOMES_TOPICOS_NEUROGAME[
            topicoSelecionado
        ] ||
        topicoSelecionado
    );

}


console.log(
    "======================================"
);


// ======================================================
// 25. INICIAR
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


    if (
        typeof esconderLoadingJogo ===
        "function"
    ) {

        esconderLoadingJogo();

    }


    mostrarErroAmigavel(

        "Modo de jogo inválido",

        "Não foi possível identificar o modo de jogo. Volte ao menu e tente novamente."

    );

}


// ======================================================
// 26. ERRO AMIGÁVEL
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