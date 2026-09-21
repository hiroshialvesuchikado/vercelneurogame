// ======================================================
// PROVA — NEUROGAME
//
// SUPORTA:
// - Modo clicar
// - Modo digitar
// - Seleção de quantidade de questões
// - Seleção de um ou vários tópicos
// - Feedback final
// - Registro de estruturas erradas
// ======================================================


// ======================================================
// 1. PARÂMETROS DA URL
// ======================================================

const parametrosProva =
    new URLSearchParams(
        window.location.search
    );


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


const topicosSelecionados =
    parametroTopicos
        ? parametroTopicos
            .split(",")
            .map(
                function(topico) {

                    return topico.trim();

                }
            )
            .filter(
                function(topico) {

                    return topico !== "";

                }
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
// 2. ELEMENTOS HTML
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
// 3. ESTADO
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


let inicioQuestao =
    0;


let tentativasQuestao =
    0;


const errosPorEstrutura =
    new Map();


// ======================================================
// 4. NORMALIZAR TEXTO
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
// 5. DESCOBRIR TÓPICO DE UM MAPA
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
// 6. REGISTRAR ESTRUTURA ERRADA
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
        obterTopicoMapaProva(
            questaoEmAndamento
                .mapa
        );


    const chave =
        `${mapaId}::${id}`;


    if (
        errosPorEstrutura.has(
            chave
        )
    ) {

        errosPorEstrutura
            .get(chave)
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
// 7. CLASSIFICAÇÃO
// ======================================================

function obterClassificacaoProva(
    aproveitamento
) {

    if (
        aproveitamento >= 90
    ) {

        return {

            titulo:
                "🏆 Excelente desempenho!",

            mensagem:
                "Você demonstrou ótimo domínio das estruturas avaliadas."

        };

    }


    if (
        aproveitamento >= 75
    ) {

        return {

            titulo:
                "🧠 Muito bom!",

            mensagem:
                "Seu desempenho foi muito bom. Revise as estruturas erradas para consolidar o conteúdo."

        };

    }


    if (
        aproveitamento >= 60
    ) {

        return {

            titulo:
                "👍 Bom progresso!",

            mensagem:
                "Você está avançando bem. Vale revisar os pontos de maior dificuldade."

        };

    }


    if (
        aproveitamento >= 40
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
// 8. EMBARALHAR
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
// 9. CRIAR BANCO DE QUESTÕES
// ======================================================

function criarBancoQuestoes() {

    const banco =
        [];


    catalogoMapas.forEach(
        function(mapa) {

            const topicoMapa =
                obterTopicoMapaProva(
                    mapa
                );


            if (
                topicosSelecionados.length > 0 &&
                !topicosSelecionados.includes(
                    topicoMapa
                )
            ) {

                return;

            }


            mapa.estruturas.forEach(
                function(estrutura) {

                    banco.push(
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


    return banco;

}


// ======================================================
// 10. CRIAR BANCO
// ======================================================

let bancoQuestoes =
    criarBancoQuestoes();


bancoQuestoes =
    embaralhar(
        bancoQuestoes
    );


// ======================================================
// 11. DISTRIBUIR MAPAS
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
        restantes.length > 0
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
                    function(item) {

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
            opcoes.length === 0
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
// 12. ORGANIZAR BANCO
// ======================================================

bancoQuestoes =
    distribuirMapas(
        bancoQuestoes
    );


// ======================================================
// 13. DEFINIR QUANTIDADE
// ======================================================

const quantidadeReal =
    Math.min(
        quantidadeSolicitada,
        bancoQuestoes.length
    );


const questoesProva =
    bancoQuestoes.slice(
        0,
        quantidadeReal
    );


totalQuestoes.textContent =
    questoesProva.length;


// ======================================================
// 14. CRIAR HOTSPOTS
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
        function(estrutura) {

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
                estrutura.info || "";


            elemento.dataset.tipo =
                estrutura.tipo || "area";


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
                    estrutura.info || "";


                svg.appendChild(
                    hitbox
                );

            }

        }
    );

}


// ======================================================
// 15. NOVA QUESTÃO
// ======================================================

function novaQuestao() {

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
            ).find(
                function(elemento) {

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
        imagem.naturalWidth > 0 &&
        imagemAtual === novaURL
    ) {

        prepararImagem();

        return;

    }


    imagem.onload =
        function() {

            prepararImagem();

        };


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
// 16. MODO CLICAR
// ======================================================

function prepararModoClicar() {

    document.body.classList.add(
        "modo-clicar"
    );


    document.body.classList.remove(
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
// 17. VERIFICAR CLIQUE
// ======================================================

function verificarClique(
    estruturaClicada
) {

    if (
        bloqueado ||
        modoProva !== "clicar"
    ) {

        return;

    }


    bloqueado =
        true;


    tentativasQuestao++;


    const tempoResposta =
        performance.now() -
        inicioQuestao;


    const acertou =
        estruturaClicada.dataset.id ===
        questaoEmAndamento
            .estrutura
            .id;


    if (
        acertou
    ) {

        acertos++;


        pontos +=
            100;


        pontosElemento.textContent =
            pontos;


        feedback.textContent =
            "✅ Correto!";


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


        feedback.textContent =
            `❌ Errado! Resposta: ${
                questaoEmAndamento
                    .estrutura
                    .nome
            }`;


        estruturaClicada
            .classList
            .add(
                "errado"
            );


        if (
            estruturaAlvoSVG
        ) {

            estruturaAlvoSVG
                .classList
                .add(
                    "correto"
                );

        }

    }


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
// 18. CLIQUES NO SVG
// ======================================================

svg.addEventListener(
    "click",

    function(evento) {

        if (
            bloqueado ||
            modoProva !== "clicar"
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
                ).find(
                    function(estrutura) {

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
// 19. MODO DIGITAR
// ======================================================

function prepararModoDigitar() {

    document.body.classList.add(
        "modo-digitar"
    );


    document.body.classList.remove(
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
// 20. VERIFICAR DIGITAÇÃO
// ======================================================

function verificarDigitacao() {

    if (
        bloqueado ||
        modoProva !== "digitar"
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


        return;

    }


    bloqueado =
        true;


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


        pontosElemento.textContent =
            pontos;


        feedback.textContent =
            "✅ Correto!";


        estruturaAlvoSVG
            .classList
            .remove(
                "destacada"
            );


        estruturaAlvoSVG
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


        feedback.textContent =
            `❌ Errado! Resposta: ${
                questaoEmAndamento
                    .estrutura
                    .nome
            }`;


        estruturaAlvoSVG
            .classList
            .remove(
                "destacada"
            );


        estruturaAlvoSVG
            .classList
            .add(
                "errado"
            );

    }


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
// 21. ANALYTICS
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
                obterTopicoMapaProva(
                    questaoEmAndamento
                        .mapa
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
// 22. TELA FINAL
// ======================================================

function mostrarTelaFeedbackProva() {

    const totalDaProva =
        questoesProva.length;


    const aproveitamento =
        totalDaProva > 0
            ? Math.round(
                (
                    acertos /
                    totalDaProva
                ) *
                100
            )
            : 0;


    const nota =
        totalDaProva > 0
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
        ).sort(
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


    const titulo =
        document.createElement(
            "h2"
        );


    titulo.textContent =
        "📝 Prova concluída!";


    card.appendChild(
        titulo
    );


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


    const resumo =
        document.createElement(
            "div"
        );


    resumo.className =
        "feedback-final-resumo";


    resumo.innerHTML = `
        <div>
            <strong>${nota}</strong>
            <span>Nota</span>
        </div>

        <div>
            <strong>${acertos} / ${totalDaProva}</strong>
            <span>Acertos</span>
        </div>

        <div>
            <strong>${erros}</strong>
            <span>Erros</span>
        </div>

        <div>
            <strong>${aproveitamento}%</strong>
            <span>Aproveitamento</span>
        </div>
    `;


    card.appendChild(
        resumo
    );


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
        estruturasErradas.length > 0
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
            function(item) {

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
                    item.erros === 1
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
// 23. BOTÃO RESPONDER
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
// 24. ENTER
// ======================================================

if (
    campoResposta
) {

    campoResposta.addEventListener(
        "keydown",
        function(evento) {

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
// 25. FINALIZAR
// ======================================================

function finalizarProva() {

    bloqueado =
        true;


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
// 26. REINICIAR
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
// 27. VOLTAR
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
// 28. LOGS
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
    "Tópicos selecionados:",
    topicosSelecionados.length > 0
        ? topicosSelecionados
        : "Todos"
);


console.log(
    "Mapas totais:",
    catalogoMapas.length
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
    "======================================"
);


// ======================================================
// 29. INICIAR
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
    topicosSelecionados.length === 0
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