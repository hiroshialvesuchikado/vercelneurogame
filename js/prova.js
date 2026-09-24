// ======================================================
// PROVA — NEUROGAME
// ======================================================

const parametrosProva = new URLSearchParams(window.location.search);

let quantidadeSolicitada =
    parseInt(
        parametrosProva.get(
            "quantidade"
        )
    );

const modoProva =
    parametrosProva.get(
        "modo"
    ) || "clicar";

const parametroTopicos =
    parametrosProva.get(
        "topicos"
    );

let tempoQuestaoSegundos =
    parseInt(
        parametrosProva.get(
            "tempo"
        )
    );


if (
    !Number.isFinite(
        tempoQuestaoSegundos
    ) ||
    tempoQuestaoSegundos < 0
) {

    tempoQuestaoSegundos =
        0;

}


const topicosSelecionados =
    parametroTopicos

        ? parametroTopicos
            .split(",")
            .map(
                topico =>
                    topico.trim()
            )
            .filter(
                Boolean
            )

        : [];


if (
    !quantidadeSolicitada ||
    quantidadeSolicitada < 1
) {

    quantidadeSolicitada =
        10;

}


// ======================================================
// ELEMENTOS HTML
// ======================================================

const imagem =
    document.getElementById(
        "imagemAnatomica"
    );

const svg =
    document.getElementById(
        "camadaHotspots"
    );

const pergunta =
    document.getElementById(
        "pergunta"
    );

const feedback =
    document.getElementById(
        "feedback"
    );

const pontosElemento =
    document.getElementById(
        "pontos"
    );

const errosElemento =
    document.getElementById(
        "erros"
    );

const numeroQuestao =
    document.getElementById(
        "numeroQuestao"
    );

const totalQuestoes =
    document.getElementById(
        "totalQuestoes"
    );

const areaDigitar =
    document.getElementById(
        "areaDigitar"
    );

const campoResposta =
    document.getElementById(
        "respostaDigitada"
    );

const botaoResponder =
    document.getElementById(
        "confirmarResposta"
    );

const caixaInfo =
    document.getElementById(
        "infoEstrutura"
    );

const acoesPartida =
    document.getElementById(
        "acoesPartida"
    );

const botaoReiniciar =
    document.getElementById(
        "reiniciarPartida"
    );

const botaoVoltar =
    document.getElementById(
        "voltarMenu"
    );


// ======================================================
// ESTADO DA PROVA
// ======================================================

let pontos =
    0;

let acertos =
    0;

let erros =
    0;

let questaoAtual =
    0;

let questaoEmAndamento =
    null;

let estruturaAlvoSVG =
    null;

let bloqueado =
    false;

let questaoRespondida =
    false;

let inicioQuestao =
    0;

let tentativasQuestao =
    0;


// Cronômetro

let intervaloCronometro =
    null;

let timeoutQuestao =
    null;

let cronometroElemento =
    null;


// Erros para revisão final

const errosPorEstrutura =
    new Map();


// Histórico completo das respostas

const respostasProva =
    [];


// ======================================================
// CRONÔMETRO
// ======================================================

function criarCronometroProva() {

    cronometroElemento =
        document.getElementById(
            "cronometroProva"
        );


    if (
        cronometroElemento
    ) {

        return;

    }


    cronometroElemento =
        document.createElement(
            "div"
        );


    cronometroElemento.id =
        "cronometroProva";


    cronometroElemento.style.margin =
        "10px auto 16px";


    cronometroElemento.style.width =
        "fit-content";


    cronometroElemento.style.padding =
        "8px 14px";


    cronometroElemento.style.borderRadius =
        "12px";


    cronometroElemento.style.fontWeight =
        "700";


    cronometroElemento.style.fontSize =
        "1rem";


    cronometroElemento.style.background =
        "rgba(255,255,255,0.08)";


    cronometroElemento.style.border =
        "1px solid rgba(255,255,255,0.12)";


    if (
        pergunta &&
        pergunta.parentNode
    ) {

        pergunta.insertAdjacentElement(
            "afterend",
            cronometroElemento
        );

    }

}


// ======================================================
// ATUALIZAR CRONÔMETRO
// ======================================================

function atualizarCronometroProva(
    segundos
) {

    criarCronometroProva();


    if (
        !cronometroElemento
    ) {

        return;

    }


    if (
        tempoQuestaoSegundos ===
        0
    ) {

        cronometroElemento.textContent =
            "⏱️ Sem limite de tempo";


        cronometroElemento.style.display =
            "block";


        return;

    }


    cronometroElemento.textContent =
        `⏱️ ${segundos}s`;


    cronometroElemento.style.display =
        "block";


    cronometroElemento.style.fontWeight =
        segundos <= 10
            ? "800"
            : "700";

}


// ======================================================
// PARAR CRONÔMETRO
// ======================================================

function pararCronometroProva() {

    if (
        intervaloCronometro
    ) {

        clearInterval(
            intervaloCronometro
        );


        intervaloCronometro =
            null;

    }


    if (
        timeoutQuestao
    ) {

        clearTimeout(
            timeoutQuestao
        );


        timeoutQuestao =
            null;

    }

}


// ======================================================
// INICIAR CRONÔMETRO
// ======================================================

function iniciarCronometroProva() {

    pararCronometroProva();


    if (
        tempoQuestaoSegundos ===
        0
    ) {

        atualizarCronometroProva(
            0
        );


        return;

    }


    let segundosRestantes =
        tempoQuestaoSegundos;


    atualizarCronometroProva(
        segundosRestantes
    );


    intervaloCronometro =
        setInterval(
            function() {

                segundosRestantes--;


                atualizarCronometroProva(
                    Math.max(
                        0,
                        segundosRestantes
                    )
                );

            },

            1000
        );


    timeoutQuestao =
        setTimeout(
            function() {

                tempoEsgotadoProva();

            },

            tempoQuestaoSegundos *
            1000
        );

}


// ======================================================
// REGISTRAR RESULTADO DE UMA QUESTÃO
// ======================================================

function registrarResultadoQuestao(
    respostaDada,
    acertou,
    motivo
) {

    if (
        !questaoEmAndamento
    ) {

        return;

    }


    respostasProva.push(
        {

            numero:
                questaoAtual + 1,

            modo:
                modoProva,

            mapa:
                questaoEmAndamento
                    .mapa
                    .id,

            topico:
                obterTopicoQuestaoProva(
                    questaoEmAndamento
                ),

            respostaDada:
                respostaDada ||
                "Sem resposta",

            respostaEsperada:
                questaoEmAndamento
                    .estrutura
                    .nome,

            acertou:
                acertou,

            motivo:
                motivo

        }
    );

}


// ======================================================
// TEMPO ESGOTADO
// ======================================================

function tempoEsgotadoProva() {

    if (
        bloqueado ||
        questaoRespondida ||
        !questaoEmAndamento
    ) {

        return;

    }


    questaoRespondida = true;
    bloqueado = true;

    pararCronometroProva();


    // Conta internamente como erro
    erros++;


    // Não tenta mais atualizar o elemento "Erros"
    // porque ele foi removido do HTML


    registrarErroEstruturaProva();


    registrarResultadoQuestao(
        "Tempo esgotado",
        false,
        "tempo"
    );


    // Feedback neutro
    feedback.textContent =
        "Tempo esgotado. Resposta registrada.";


    // Se estiver no modo digitar,
    // remove apenas o destaque

    if (
        modoProva === "digitar"
    ) {

        if (
            estruturaAlvoSVG
        ) {

            estruturaAlvoSVG
                .classList
                .remove(
                    "destacada"
                );

        }


        if (
            campoResposta
        ) {

            campoResposta.disabled =
                true;

        }


        if (
            botaoResponder
        ) {

            botaoResponder.disabled =
                true;

        }

    }


    try {

        registrarAnalytics(
            "Tempo esgotado",
            false,
            tempoQuestaoSegundos * 1000
        );

    }

    catch (
        erroAnalytics
    ) {

        console.error(
            "⚠️ Erro no analytics da prova:",
            erroAnalytics
        );

    }


    // Vai automaticamente para a próxima questão

    setTimeout(
        function() {

            questaoAtual++;

            novaQuestao();

        },

        800
    );

}

// ======================================================
// NORMALIZAR TEXTO
// ======================================================

function normalizar(
    texto
) {

    return String(
        texto || ""
    )

        .normalize(
            "NFD"
        )

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .toLowerCase()

        .replace(
            /[-_]/g,
            " "
        )

        .replace(
            /\s+/g,
            " "
        )

        .trim();

}


// ======================================================
// TÓPICO DO MAPA
// ======================================================

function obterTopicoMapaProva(
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
// TÓPICO DA ESTRUTURA
// ======================================================

function obterTopicoEstruturaProva(
    estrutura
) {

    if (
        !estrutura ||
        !estrutura.id
    ) {

        return null;

    }


    const id =
        estrutura.id.toLowerCase();


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
// TÓPICO DA QUESTÃO
// ======================================================

function obterTopicoQuestaoProva(
    questao
) {

    if (
        !questao
    ) {

        return null;

    }


    const topicoEstrutura =
        obterTopicoEstruturaProva(
            questao.estrutura
        );


    if (
        topicoEstrutura
    ) {

        return topicoEstrutura;

    }


    return obterTopicoMapaProva(
        questao.mapa
    );

}


// ======================================================
// REGISTRAR ESTRUTURA ERRADA
// ======================================================

function registrarErroEstruturaProva() {

    if (
        !questaoEmAndamento ||
        !questaoEmAndamento.estrutura
    ) {

        return;

    }


    const id =
        questaoEmAndamento
            .estrutura
            .id;


    const nome =
        questaoEmAndamento
            .estrutura
            .nome;


    const mapaId =
        questaoEmAndamento
            .mapa
            .id;


    const topico =
        obterTopicoQuestaoProva(
            questaoEmAndamento
        );


    const chave =
        `${mapaId}::${id}`;


    if (
        errosPorEstrutura.has(
            chave
        )
    ) {

        errosPorEstrutura
            .get(
                chave
            )
            .erros++;

    }

    else {

        errosPorEstrutura.set(
            chave,
            {

                id:
                    id,

                nome:
                    nome,

                erros:
                    1,

                mapa:
                    mapaId,

                topico:
                    topico

            }
        );

    }

}


// ======================================================
// CLASSIFICAÇÃO FINAL
// ======================================================

function obterClassificacaoProva(
    aproveitamento
) {

    if (
        aproveitamento >=
        90
    ) {

        return {

            titulo:
                "🏆 Excelente desempenho!",

            mensagem:
                "Você demonstrou ótimo domínio das estruturas avaliadas."

        };

    }


    if (
        aproveitamento >=
        75
    ) {

        return {

            titulo:
                "🧠 Muito bom!",

            mensagem:
                "Seu desempenho foi muito bom. Revise as estruturas erradas para consolidar o conteúdo."

        };

    }


    if (
        aproveitamento >=
        60
    ) {

        return {

            titulo:
                "👍 Bom progresso!",

            mensagem:
                "Você está avançando bem. Vale revisar os pontos de maior dificuldade."

        };

    }


    if (
        aproveitamento >=
        40
    ) {

        return {

            titulo:
                "📚 Continue revisando",

            mensagem:
                "Revise as estruturas abaixo no Atlas antes de refazer a prova."

        };

    }


    return {

        titulo:
            "🔄 Hora de revisar",

        mensagem:
            "Recomendo revisar as estruturas abaixo no Atlas e tentar novamente."

    };

}


// ======================================================
// EMBARALHAR
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


// ======================================================
// CRIAR BANCO DE QUESTÕES
// ======================================================

function criarBancoQuestoes() {

    const banco =
        [];


    catalogoMapas.forEach(
        function(
            mapa
        ) {

            if (
                !mapa ||
                !Array.isArray(
                    mapa.estruturas
                )
            ) {

                return;

            }


            mapa.estruturas.forEach(
                function(
                    estrutura
                ) {

                    const questao =
                        {

                            mapa:
                                mapa,

                            estrutura:
                                estrutura

                        };


                    const topicoQuestao =
                        obterTopicoQuestaoProva(
                            questao
                        );


                    if (
                        topicosSelecionados.length >
                        0 &&

                        !topicosSelecionados.includes(
                            topicoQuestao
                        )
                    ) {

                        return;

                    }


                    banco.push(
                        questao
                    );

                }
            );

        }
    );


    return banco;

}


// ======================================================
// BANCO
// ======================================================

let bancoQuestoes =
    embaralhar(
        criarBancoQuestoes()
    );


// ======================================================
// DISTRIBUIR MAPAS
// ======================================================

function distribuirMapas(
    banco
) {

    const restantes =
        [...banco];


    const resultado =
        [];


    let ultimoMapa =
        null;


    while (
        restantes.length >
        0
    ) {

        let opcoes =
            restantes

                .map(
                    function(
                        questao,
                        indice
                    ) {

                        return {

                            questao:
                                questao,

                            indice:
                                indice

                        };

                    }
                )

                .filter(
                    function(
                        item
                    ) {

                        return (

                            !ultimoMapa ||

                            item
                                .questao
                                .mapa
                                .id !==
                            ultimoMapa

                        );

                    }
                );


        if (
            opcoes.length ===
            0
        ) {

            opcoes =
                restantes.map(
                    function(
                        questao,
                        indice
                    ) {

                        return {

                            questao:
                                questao,

                            indice:
                                indice

                        };

                    }
                );

        }


        const opcao =
            opcoes[
                Math.floor(
                    Math.random() *
                    opcoes.length
                )
            ];


        const escolhida =
            restantes.splice(
                opcao.indice,
                1
            )[0];


        resultado.push(
            escolhida
        );


        ultimoMapa =
            escolhida
                .mapa
                .id;

    }


    return resultado;

}


// ======================================================
// MONTAR QUESTÕES
// ======================================================

function montarQuestoesProva(
    banco,
    quantidade,
    topicos
) {

    const selecionadas =
        [];


    const chavesSelecionadas =
        new Set();


    if (
        !Array.isArray(
            topicos
        ) ||

        topicos.length ===
        0
    ) {

        return distribuirMapas(
            embaralhar(
                banco
            )
        ).slice(
            0,
            quantidade
        );

    }


    topicos.forEach(
        function(
            topico
        ) {

            const questoesDoTopico =
                banco.filter(
                    function(
                        questao
                    ) {

                        return (
                            obterTopicoQuestaoProva(
                                questao
                            ) ===
                            topico
                        );

                    }
                );


            if (
                questoesDoTopico.length ===
                0
            ) {

                console.warn(
                    "⚠️ Nenhuma questão para:",
                    topico
                );


                return;

            }


            const escolhida =
                questoesDoTopico[
                    Math.floor(
                        Math.random() *
                        questoesDoTopico.length
                    )
                ];


            selecionadas.push(
                escolhida
            );


            chavesSelecionadas.add(
                `${escolhida.mapa.id}::${escolhida.estrutura.id}`
            );

        }
    );


    let restantes =
        banco.filter(
            function(
                questao
            ) {

                const chave =
                    `${questao.mapa.id}::${questao.estrutura.id}`;


                return (
                    !chavesSelecionadas.has(
                        chave
                    )
                );

            }
        );


    restantes =
        embaralhar(
            restantes
        );


    while (
        selecionadas.length <
        quantidade &&

        restantes.length >
        0
    ) {

        selecionadas.push(
            restantes.shift()
        );

    }


    return distribuirMapas(
        embaralhar(
            selecionadas
        )
    );

}


// ======================================================
// TÓPICOS SEM QUESTÕES
// ======================================================

const topicosSemQuestoes =
    topicosSelecionados.filter(
        function(
            topico
        ) {

            return (
                !bancoQuestoes.some(
                    function(
                        questao
                    ) {

                        return (
                            obterTopicoQuestaoProva(
                                questao
                            ) ===
                            topico
                        );

                    }
                )
            );

        }
    );


// ======================================================
// QUANTIDADE REAL
// ======================================================

const quantidadeReal =
    Math.min(
        quantidadeSolicitada,
        bancoQuestoes.length
    );


// ======================================================
// QUESTÕES DA PROVA
// ======================================================

const questoesProva =
    topicosSemQuestoes.length ===
    0

        ? montarQuestoesProva(
            bancoQuestoes,
            quantidadeReal,
            topicosSelecionados
        )

        : [];


if (
    totalQuestoes
) {

    totalQuestoes.textContent =
        questoesProva.length;

}


// ======================================================
// CRIAR HOTSPOTS
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


    mapa.estruturas.forEach(
        function(
            estrutura
        ) {

            let elemento;


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
                "id",
                estrutura.id
            );


            elemento.setAttribute(
                "points",
                estrutura.pontos
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
                    "32"
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


                svg.appendChild(
                    hitbox
                );

            }

        }
    );

}


// ======================================================
// NOVA QUESTÃO
// ======================================================

function novaQuestao() {

    pararCronometroProva();


    questaoRespondida =
        false;


    if (
        questaoAtual >=
        questoesProva.length
    ) {

        finalizarProva();


        return;

    }


    bloqueado =
        true;


    tentativasQuestao =
        0;


    feedback.textContent =
        "";


    if (
        caixaInfo
    ) {

        caixaInfo.textContent =
            "";

    }


    questaoEmAndamento =
        questoesProva[
            questaoAtual
        ];


    numeroQuestao.textContent =
        questaoAtual + 1;


    pergunta.textContent =
        "Carregando questão...";


    svg.innerHTML =
        "";


    function prepararImagem() {

        criarHotspots(
            questaoEmAndamento
                .mapa
        );


        estruturaAlvoSVG =
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
                            questaoEmAndamento
                                .estrutura
                                .id
                        );

                    }
                );


        if (
            !estruturaAlvoSVG
        ) {

            console.error(
                "Estrutura não encontrada:",
                questaoEmAndamento
                    .estrutura
                    .id
            );


            questaoAtual++;


            novaQuestao();


            return;

        }


        if (
            modoProva ===
            "clicar"
        ) {

            prepararModoClicar();

        }

        else if (
            modoProva ===
            "digitar"
        ) {

            prepararModoDigitar();

        }

        else {

            pergunta.textContent =
                "Modo de prova inválido.";


            if (
                typeof esconderLoadingProva ===
                "function"
            ) {

                esconderLoadingProva();

            }


            return;

        }


        inicioQuestao =
            performance.now();


        bloqueado =
            false;


        iniciarCronometroProva();


        if (
            typeof esconderLoadingProva ===
            "function"
        ) {

            esconderLoadingProva();

        }

    }


    const novaURL =
        new URL(
            questaoEmAndamento
                .mapa
                .imagem,

            document.baseURI
        ).href;


    const imagemAtual =
        imagem.currentSrc ||
        imagem.src;


    if (
        imagem.complete &&
        imagem.naturalWidth >
        0 &&
        imagemAtual ===
        novaURL
    ) {

        prepararImagem();


        return;

    }


    imagem.onload =
        prepararImagem;


    imagem.onerror =
        function() {

            console.error(
                "Imagem não carregada:",
                questaoEmAndamento
                    .mapa
                    .imagem
            );


            pergunta.textContent =
                "Erro ao carregar imagem.";


            if (
                typeof esconderLoadingProva ===
                "function"
            ) {

                esconderLoadingProva();

            }

        };


    imagem.src =
        novaURL;

}


// ======================================================
// MODO CLICAR
// ======================================================

function prepararModoClicar() {

    document.body
        .classList
        .add(
            "modo-clicar"
        );


    document.body
        .classList
        .remove(
            "modo-digitar"
        );


    if (
        areaDigitar
    ) {

        areaDigitar
            .classList
            .remove(
                "visivel"
            );

    }


    pergunta.textContent =
        `Clique em: ${
            questaoEmAndamento
                .estrutura
                .nome
        }`;

}


// ======================================================
// VERIFICAR CLIQUE
// ======================================================

function verificarClique(
    estruturaClicada
) {

    if (
        bloqueado ||
        questaoRespondida ||
        modoProva !==
        "clicar"
    ) {

        return;

    }


    bloqueado =
        true;


    questaoRespondida =
        true;


    pararCronometroProva();


    tentativasQuestao++;


    const tempoResposta =
        performance.now() -
        inicioQuestao;


    const acertou =
        estruturaClicada
            .dataset
            .id ===

        questaoEmAndamento
            .estrutura
            .id;


    if (
        acertou
    ) {

        acertos++;


        pontos +=
            100;







        estruturaClicada
            .classList
            .add(
                "correto"
            );

    }

    else {

        erros++;


        errosElemento.textContent =
            erros;


        registrarErroEstruturaProva();



        estruturaClicada
            .classList
            .add(
                "errado"
            );

    }


    registrarResultadoQuestao(
        estruturaClicada
            .dataset
            .nome,

        acertou,

        acertou
            ? "acerto"
            : "erro"
    );


    try {

        registrarAnalytics(
            estruturaClicada
                .dataset
                .nome,

            acertou,

            tempoResposta
        );

    }

    catch (
        erroAnalytics
    ) {

        console.error(
            "⚠️ Erro no analytics da prova:",
            erroAnalytics
        );

    }


    setTimeout(
        function() {

            questaoAtual++;


            novaQuestao();

        },

        1200
    );

}


// ======================================================
// CLIQUE NO SVG
// ======================================================

svg.addEventListener(
    "click",

    function(
        evento
    ) {

        if (
            bloqueado ||
            questaoRespondida ||
            modoProva !==
            "clicar"
        ) {

            return;

        }


        const alvo =
            evento.target;


        if (
            alvo.classList &&
            alvo.classList.contains(
                "estrutura"
            )
        ) {

            evento.preventDefault();


            verificarClique(
                alvo
            );


            return;

        }


        if (
            alvo.classList &&
            alvo.classList.contains(
                "estrutura-hitbox"
            )
        ) {

            evento.preventDefault();


            const id =
                alvo.dataset.id;


            const estruturaReal =
                Array.from(
                    svg.querySelectorAll(
                        ".estrutura"
                    )
                )

                    .find(
                        function(
                            estrutura
                        ) {

                            return (
                                estrutura.dataset.id ===
                                id
                            );

                        }
                    );


            if (
                estruturaReal
            ) {

                verificarClique(
                    estruturaReal
                );

            }

        }

    }
);


// ======================================================
// MODO DIGITAR
// ======================================================

function prepararModoDigitar() {

    document.body
        .classList
        .add(
            "modo-digitar"
        );


    document.body
        .classList
        .remove(
            "modo-clicar"
        );


    if (
        areaDigitar
    ) {

        areaDigitar
            .classList
            .add(
                "visivel"
            );

    }


    estruturaAlvoSVG
        .classList
        .add(
            "destacada"
        );


    pergunta.textContent =
        "Qual é a estrutura destacada?";


    campoResposta.value =
        "";


    campoResposta.disabled =
        false;


    botaoResponder.disabled =
        false;


    setTimeout(
        function() {

            campoResposta.focus();

        },

        50
    );

}


// ======================================================
// VERIFICAR DIGITAÇÃO
// ======================================================

function verificarDigitacao() {

    if (
        bloqueado ||
        questaoRespondida ||
        modoProva !==
        "digitar"
    ) {

        return;

    }


    const resposta =
        campoResposta
            .value
            .trim();


    if (
        !resposta
    ) {

        feedback.textContent =
            "Digite uma resposta.";


        campoResposta.focus();


        return;

    }


    bloqueado =
        true;


    questaoRespondida =
        true;


    pararCronometroProva();


    tentativasQuestao++;


    const tempoResposta =
        performance.now() -
        inicioQuestao;


    const respostaAluno =
        normalizar(
            resposta
        );


    const respostaCorreta =
        normalizar(
            questaoEmAndamento
                .estrutura
                .nome
        );


    const acertou =
        respostaAluno ===
        respostaCorreta;


    if (
        acertou
    ) {

        acertos++;


        pontos +=
            100;





 
    }

    else {

        erros++;


        errosElemento.textContent =
            erros;


        registrarErroEstruturaProva();



 

    }


    registrarResultadoQuestao(
        resposta,
        acertou,
        acertou
            ? "acerto"
            : "erro"
    );


    campoResposta.disabled =
        true;


    botaoResponder.disabled =
        true;


    try {

        registrarAnalytics(
            resposta,
            acertou,
            tempoResposta
        );

    }

    catch (
        erroAnalytics
    ) {

        console.error(
            "⚠️ Erro no analytics da prova:",
            erroAnalytics
        );

    }


    setTimeout(
        function() {

            questaoAtual++;


            novaQuestao();

        },

        1500
    );

}


// ======================================================
// ANALYTICS
// ======================================================

function registrarAnalytics(
    resposta,
    acertou,
    tempoResposta
) {

    if (
        typeof registrarResposta !==
        "function"
    ) {

        return;

    }


    registrarResposta(
        {

            mapa:
                questaoEmAndamento
                    .mapa
                    .id,

            topico:
                obterTopicoQuestaoProva(
                    questaoEmAndamento
                ),

            modo:
                `prova-${modoProva}`,

            estruturaId:
                questaoEmAndamento
                    .estrutura
                    .id,

            estruturaNome:
                questaoEmAndamento
                    .estrutura
                    .nome,

            resposta:
                resposta,

            acertou:
                acertou,

            tentativas:
                tentativasQuestao,

            tempoResposta:
                tempoResposta,

            pontos:
                pontos

        }
    );

}


// ======================================================
// TELA FINAL
// ======================================================

function mostrarTelaFeedbackProva() {

    const totalDaProva =
        questoesProva.length;


    const aproveitamento =
        totalDaProva >
        0

            ? Math.round(
                (
                    acertos /
                    totalDaProva
                ) *
                100
            )

            : 0;


    const nota =
        totalDaProva >
        0

            ? (
                (
                    acertos /
                    totalDaProva
                ) *
                10
            ).toFixed(
                1
            )

            : "0.0";


    const estruturasErradas =
        Array.from(
            errosPorEstrutura.values()
        )

            .sort(
                function(
                    a,
                    b
                ) {

                    return (
                        b.erros -
                        a.erros
                    );

                }
            );


    const classificacao =
        obterClassificacaoProva(
            aproveitamento
        );


    const antiga =
        document.getElementById(
            "feedbackFinalProva"
        );


    if (
        antiga
    ) {

        antiga.remove();

    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "feedbackFinalProva";


    overlay.className =
        "feedback-final-overlay";


    const card =
        document.createElement(
            "section"
        );


    card.className =
        "feedback-final-card";


    // TÍTULO

    const titulo =
        document.createElement(
            "h2"
        );


    titulo.textContent =
        "📝 Prova concluída!";


    card.appendChild(
        titulo
    );


    // CLASSIFICAÇÃO

    const tituloClassificacao =
        document.createElement(
            "h3"
        );


    tituloClassificacao.className =
        "feedback-final-classificacao";


    tituloClassificacao.textContent =
        classificacao.titulo;


    card.appendChild(
        tituloClassificacao
    );


    const mensagem =
        document.createElement(
            "p"
        );


    mensagem.className =
        "feedback-final-mensagem";


    mensagem.textContent =
        classificacao.mensagem;


    card.appendChild(
        mensagem
    );


    // ==================================================
    // RESUMO
    // ==================================================

    const resumo =
        document.createElement(
            "div"
        );


    resumo.className =
        "feedback-final-resumo";


    resumo.innerHTML = `

        <div>

            <strong>
                ${nota}
            </strong>

            <span>
                Nota
            </span>

        </div>


        <div>

            <strong>
                ${acertos} / ${totalDaProva}
            </strong>

            <span>
                Acertos
            </span>

        </div>


        <div>

            <strong>
                ${erros}
            </strong>

            <span>
                Erros
            </span>

        </div>


        <div>

            <strong>
                ${aproveitamento}%
            </strong>

            <span>
                Aproveitamento
            </span>

        </div>

    `;


    card.appendChild(
        resumo
    );


    // ==================================================
    // CORREÇÃO DETALHADA
    // ==================================================

    const secaoCorrecao =
        document.createElement(
            "div"
        );


    secaoCorrecao.className =
        "feedback-final-revisao";


    const tituloCorrecao =
        document.createElement(
            "h3"
        );


    tituloCorrecao.textContent =
        "📋 Correção da prova";


    secaoCorrecao.appendChild(
        tituloCorrecao
    );


    const tabelaContainer =
        document.createElement(
            "div"
        );


    tabelaContainer.className =
        "tabela-correcao-container";


    const tabela =
        document.createElement(
            "table"
        );


    tabela.className =
        "tabela-correcao-prova";


    // Cabeçalho

    const cabecalho =
        document.createElement(
            "thead"
        );


    const linhaCabecalho =
        document.createElement(
            "tr"
        );


    [
        "Questão",
        "Resultado",
        "Resposta dada",
        "Resposta esperada"

    ].forEach(
        function(
            texto
        ) {

            const th =
                document.createElement(
                    "th"
                );


            th.textContent =
                texto;


            linhaCabecalho.appendChild(
                th
            );

        }
    );


    cabecalho.appendChild(
        linhaCabecalho
    );


    tabela.appendChild(
        cabecalho
    );


    // Corpo

    const corpo =
        document.createElement(
            "tbody"
        );


    respostasProva.forEach(
        function(
            resultado
        ) {

            const linha =
                document.createElement(
                    "tr"
                );


            // Questão

            const colunaQuestao =
                document.createElement(
                    "td"
                );


            colunaQuestao.textContent =
                resultado.numero;


            linha.appendChild(
                colunaQuestao
            );


            // Resultado

            const colunaResultado =
                document.createElement(
                    "td"
                );


            if (
                resultado.acertou
            ) {

                colunaResultado.textContent =
                    "✅ Correta";


                colunaResultado.classList.add(
                    "resultado-correto"
                );

            }

            else if (
                resultado.motivo ===
                "tempo"
            ) {

                colunaResultado.textContent =
                    "⏰ Tempo";


                colunaResultado.classList.add(
                    "resultado-tempo"
                );

            }

            else {

                colunaResultado.textContent =
                    "❌ Incorreta";


                colunaResultado.classList.add(
                    "resultado-errado"
                );

            }


            linha.appendChild(
                colunaResultado
            );


            // Resposta dada

            const colunaRespostaDada =
                document.createElement(
                    "td"
                );


            colunaRespostaDada.textContent =
                resultado.respostaDada;


            linha.appendChild(
                colunaRespostaDada
            );


            // Resposta esperada

            const colunaRespostaEsperada =
                document.createElement(
                    "td"
                );


            colunaRespostaEsperada.textContent =
                resultado.respostaEsperada;


            linha.appendChild(
                colunaRespostaEsperada
            );


            corpo.appendChild(
                linha
            );

        }
    );


    tabela.appendChild(
        corpo
    );


    tabelaContainer.appendChild(
        tabela
    );


    secaoCorrecao.appendChild(
        tabelaContainer
    );


    card.appendChild(
        secaoCorrecao
    );


    // ==================================================
    // ESTRUTURAS PARA REVISAR
    // ==================================================

    const revisao =
        document.createElement(
            "div"
        );


    revisao.className =
        "feedback-final-revisao";


    const tituloRevisao =
        document.createElement(
            "h3"
        );


    tituloRevisao.textContent =
        estruturasErradas.length >
        0

            ? "Estruturas para revisar"

            : "Resultado perfeito";


    revisao.appendChild(
        tituloRevisao
    );


    if (
        estruturasErradas.length ===
        0
    ) {

        const perfeito =
            document.createElement(
                "p"
            );


        perfeito.className =
            "feedback-final-perfeito";


        perfeito.textContent =
            "🏆 Você concluiu a prova sem erros.";


        revisao.appendChild(
            perfeito
        );

    }

    else {

        const lista =
            document.createElement(
                "div"
            );


        lista.className =
            "feedback-final-lista";


        estruturasErradas.forEach(
            function(
                item
            ) {

                const linha =
                    document.createElement(
                        "div"
                    );


                linha.className =
                    "feedback-final-item";


                const nome =
                    document.createElement(
                        "span"
                    );


                nome.textContent =
                    item.nome;


                const quantidade =
                    document.createElement(
                        "strong"
                    );


                quantidade.textContent =
                    item.erros ===
                    1

                        ? "1 erro"

                        : `${item.erros} erros`;


                linha.appendChild(
                    nome
                );


                linha.appendChild(
                    quantidade
                );


                lista.appendChild(
                    linha
                );

            }
        );


        revisao.appendChild(
            lista
        );

    }


    card.appendChild(
        revisao
    );


    // ==================================================
    // BOTÕES
    // ==================================================

    const botoes =
        document.createElement(
            "div"
        );


    botoes.className =
        "feedback-final-botoes";


    const refazer =
        document.createElement(
            "button"
        );


    refazer.type =
        "button";


    refazer.textContent =
        "🔄 Refazer prova";


    refazer.addEventListener(
        "click",

        function() {

            window.location.reload();

        }
    );


    const atlas =
        document.createElement(
            "button"
        );


    atlas.type =
        "button";


    atlas.textContent =
        "🔍 Revisar no Atlas";


    atlas.addEventListener(
        "click",

        function() {

            window.location.href =
                "atlas.html";

        }
    );


    const voltar =
        document.createElement(
            "button"
        );


    voltar.type =
        "button";


    voltar.textContent =
        "← Voltar ao menu";


    voltar.addEventListener(
        "click",

        function() {

            window.location.href =
                "jogo-menu.html";

        }
    );


    botoes.appendChild(
        refazer
    );


    botoes.appendChild(
        atlas
    );


    botoes.appendChild(
        voltar
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


// ======================================================
// BOTÃO RESPONDER
// ======================================================

if (
    botaoResponder
) {

    botaoResponder.addEventListener(
        "click",
        verificarDigitacao
    );

}


// ======================================================
// ENTER
// ======================================================

if (
    campoResposta
) {

    campoResposta.addEventListener(
        "keydown",

        function(
            evento
        ) {

            if (
                evento.key ===
                "Enter"
            ) {

                evento.preventDefault();


                verificarDigitacao();

            }

        }
    );

}


// ======================================================
// FINALIZAR PROVA
// ======================================================

function finalizarProva() {

    pararCronometroProva();


    bloqueado =
        true;


    questaoRespondida =
        true;


    if (
        cronometroElemento
    ) {

        cronometroElemento.style.display =
            "none";

    }


    pergunta.textContent =
        "🎉 Prova concluída!";


    feedback.textContent =
        `Acertos: ${acertos} | Erros: ${erros}`;


    svg.innerHTML =
        "";


    if (
        areaDigitar
    ) {

        areaDigitar
            .classList
            .remove(
                "visivel"
            );

    }


    if (
        campoResposta
    ) {

        campoResposta.disabled =
            true;

    }


    if (
        botaoResponder
    ) {

        botaoResponder.disabled =
            true;

    }


    if (
        acoesPartida
    ) {

        acoesPartida
            .classList
            .add(
                "visivel"
            );

    }


    mostrarTelaFeedbackProva();

}


// ======================================================
// REINICIAR
// ======================================================

if (
    botaoReiniciar
) {

    botaoReiniciar.addEventListener(
        "click",

        function() {

            window.location.reload();

        }
    );

}


// ======================================================
// VOLTAR
// ======================================================

if (
    botaoVoltar
) {

    botaoVoltar.addEventListener(
        "click",

        function() {

            window.location.href =
                "jogo-menu.html";

        }
    );

}


// ======================================================
// LOGS
// ======================================================

console.log(
    "======================================"
);


console.log(
    "📝 NEUROGAME — MODO PROVA"
);


console.log(
    "Modo:",
    modoProva
);


console.log(
    "Quantidade solicitada:",
    quantidadeSolicitada
);


console.log(
    "Tempo por questão:",

    tempoQuestaoSegundos >
    0

        ? `${tempoQuestaoSegundos} segundos`

        : "Sem limite"
);


console.log(
    "Tópicos selecionados:",

    topicosSelecionados.length >
    0

        ? topicosSelecionados

        : "Todos"
);


console.log(
    "Mapas totais:",

    typeof catalogoMapas !==
    "undefined"

        ? catalogoMapas.length

        : 0
);


console.log(
    "Questões disponíveis:",
    bancoQuestoes.length
);


console.log(
    "Questões da prova:",
    questoesProva.length
);


console.log(
    "Tópicos sem questões:",
    topicosSemQuestoes
);


console.log(
    "======================================"
);


// ======================================================
// INICIAR
// ======================================================

if (
    typeof catalogoMapas ===
    "undefined" ||

    catalogoMapas.length ===
    0
) {

    pergunta.textContent =
        "Erro: nenhum mapa disponível.";


    if (
        typeof esconderLoadingProva ===
        "function"
    ) {

        esconderLoadingProva();

    }

}


else if (
    topicosSemQuestoes.length >
    0
) {

    pergunta.textContent =
        "Erro: um dos tópicos selecionados não possui questões disponíveis.";


    console.error(
        "❌ Tópicos sem questões:",
        topicosSemQuestoes
    );


    if (
        typeof esconderLoadingProva ===
        "function"
    ) {

        esconderLoadingProva();

    }

}


else if (
    topicosSelecionados.length ===
    0
) {

    console.warn(
        "⚠️ Nenhum tópico informado. A prova utilizará todos os mapas."
    );


    if (
        questoesProva.length ===
        0
    ) {

        pergunta.textContent =
            "Erro: nenhuma questão disponível.";


        if (
            typeof esconderLoadingProva ===
            "function"
        ) {

            esconderLoadingProva();

        }

    }

    else {

        novaQuestao();

    }

}


else if (
    questoesProva.length ===
    0
) {

    pergunta.textContent =
        "Erro: nenhuma questão disponível para os tópicos selecionados.";


    console.error(
        "Nenhuma questão encontrada para:",
        topicosSelecionados
    );


    if (
        typeof esconderLoadingProva ===
        "function"
    ) {

        esconderLoadingProva();

    }

}


else {

    novaQuestao();

}