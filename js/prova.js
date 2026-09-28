// ======================================================
// PROVA — NEUROGAME
//
// SUPORTA:
// - Modo clicar
// - Modo digitar
// - Seleção de quantidade
// - Seleção de tópicos
// - Cronômetro
// - Correção final
// - Respostas parciais
// - Revisão visual das questões
// ======================================================


// ======================================================
// 1. PARÂMETROS
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

    tempoQuestaoSegundos = 0;

}


const topicosSelecionados =
    parametroTopicos

        ? parametroTopicos
            .split(",")
            .map(
                topico =>
                    topico.trim()
            )
            .filter(Boolean)

        : [];


if (
    !quantidadeSolicitada ||
    quantidadeSolicitada < 1
) {

    quantidadeSolicitada = 10;

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

let pontos = 0;

let acertos = 0;

let erros = 0;

let parciais = 0;

let questaoAtual = 0;

let questaoEmAndamento = null;

let estruturaAlvoSVG = null;

let bloqueado = false;

let questaoRespondida = false;

let inicioQuestao = 0;

let tentativasQuestao = 0;


// Cronômetro

let intervaloCronometro = null;

let timeoutQuestao = null;

let cronometroElemento = null;


// Revisão

const errosPorEstrutura =
    new Map();


const respostasProva =
    [];


// ======================================================
// 4. NORMALIZAÇÃO DA RESPOSTA
// ======================================================


// Palavras que podem ser esquecidas sem perder pontos.

const PALAVRAS_IGNORADAS_PROVA =
    new Set(
        [
            "da",
            "do",
            "de"
        ]
    );


// ======================================================
// NORMALIZAR TEXTO
// ======================================================

function normalizarTextoProva(
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
            /[^a-z0-9\s]/g,
            " "
        )

        .replace(
            /\s+/g,
            " "
        )

        .trim();

}


// ======================================================
// PEGAR SOMENTE PALAVRAS IMPORTANTES
// ======================================================

function obterPalavrasSignificativasProva(
    texto
) {

    const textoNormalizado =
        normalizarTextoProva(
            texto
        );


    if (
        !textoNormalizado
    ) {

        return [];

    }


    return textoNormalizado
        .split(" ")
        .filter(
            function(
                palavra
            ) {

                return (

                    palavra &&

                    !PALAVRAS_IGNORADAS_PROVA
                        .has(
                            palavra
                        )

                );

            }
        );

}


// ======================================================
// NORMALIZAR
//
// Mantida para compatibilidade.
// ======================================================

function normalizar(
    texto
) {

    return obterPalavrasSignificativasProva(
        texto
    )
        .join(
            " "
        );

}


// ======================================================
// AVALIAR RESPOSTA DIGITADA
//
// 1,0 = correta
// 0,5 = mesmas palavras em ordem diferente
// 0,0 = incorreta
//
// da / do / de são ignorados.
// ======================================================

function avaliarRespostaDigitada(
    respostaAluno,
    respostaEsperada
) {

    const palavrasAluno =
        obterPalavrasSignificativasProva(
            respostaAluno
        );


    const palavrasEsperadas =
        obterPalavrasSignificativasProva(
            respostaEsperada
        );


    if (
        palavrasAluno.length === 0 ||
        palavrasEsperadas.length === 0
    ) {

        return {

            valorAcerto:
                0,

            acertou:
                false,

            parcialmenteCorreta:
                false,

            tipo:
                "erro"

        };

    }


    const alunoNaOrdem =
        palavrasAluno
            .join(
                " "
            );


    const corretaNaOrdem =
        palavrasEsperadas
            .join(
                " "
            );


    // ==================================================
    // CORRETA — 1 PONTO
    // ==================================================

    if (
        alunoNaOrdem ===
        corretaNaOrdem
    ) {

        return {

            valorAcerto:
                1,

            acertou:
                true,

            parcialmenteCorreta:
                false,

            tipo:
                "acerto"

        };

    }


    // ==================================================
    // TESTAR INVERSÃO / MUDANÇA DE ORDEM
    // ==================================================

    const alunoSemOrdem =
        [...palavrasAluno]
            .sort()
            .join(
                " "
            );


    const corretaSemOrdem =
        [...palavrasEsperadas]
            .sort()
            .join(
                " "
            );


    if (
        alunoSemOrdem ===
        corretaSemOrdem
    ) {

        return {

            valorAcerto:
                0.5,

            acertou:
                false,

            parcialmenteCorreta:
                true,

            tipo:
                "parcial"

        };

    }


    // ==================================================
    // ERRADA
    // ==================================================

    return {

        valorAcerto:
            0,

        acertou:
            false,

        parcialmenteCorreta:
            false,

        tipo:
            "erro"

    };

}


// ======================================================
// 5. CRONÔMETRO
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
        tempoQuestaoSegundos === 0
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
        tempoQuestaoSegundos === 0
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
// 6. TÓPICOS
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
            window.definicoesMapas
                .find(
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
// 7. REGISTRAR RESULTADO
// ======================================================

function registrarResultadoQuestao(
    respostaDada,
    acertou,
    motivo,
    dadosExtras = {}
) {

    if (
        !questaoEmAndamento
    ) {

        return;

    }


    const valorAcerto =
        typeof dadosExtras.valorAcerto ===
        "number"

            ? dadosExtras.valorAcerto

            : (
                acertou
                    ? 1
                    : 0
            );


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


            imagemMapa:
                questaoEmAndamento
                    .mapa
                    .imagem ||
                null,


            topico:
                obterTopicoQuestaoProva(
                    questaoEmAndamento
                ),


            estruturaEsperadaId:
                questaoEmAndamento
                    .estrutura
                    .id,


            respostaDada:
                respostaDada ||
                "Sem resposta",


            respostaEsperada:
                questaoEmAndamento
                    .estrutura
                    .nome,


            estruturaClicadaId:
                dadosExtras
                    .estruturaClicadaId ||
                null,


            parcialmenteCorreta:
                dadosExtras
                    .parcialmenteCorreta ===
                true,


            valorAcerto:
                valorAcerto,


            acertou:
                acertou,


            motivo:
                motivo

        }
    );

}


// ======================================================
// 8. TEMPO ESGOTADO
// ======================================================

function tempoEsgotadoProva() {

    if (
        bloqueado ||
        questaoRespondida ||
        !questaoEmAndamento
    ) {

        return;

    }


    questaoRespondida =
        true;


    bloqueado =
        true;


    pararCronometroProva();


    erros++;


    registrarErroEstruturaProva(
        "erro"
    );


    registrarResultadoQuestao(
        "Tempo esgotado",
        false,
        "tempo",
        {

            valorAcerto:
                0

        }
    );


    if (
        feedback
    ) {

        feedback.textContent =
            "Tempo esgotado. Resposta registrada.";

    }


    if (
        modoProva ===
        "digitar"
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
            tempoQuestaoSegundos *
            1000
        );

    }

    catch (
        erroAnalytics
    ) {

        console.error(
            "⚠️ Erro no analytics:",
            erroAnalytics
        );

    }


    setTimeout(
        function() {

            questaoAtual++;

            novaQuestao();

        },

        800
    );

}


// ======================================================
// 9. ESTRUTURAS PARA REVISÃO
// ======================================================

function registrarErroEstruturaProva(
    tipo = "erro"
) {

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

        const registro =
            errosPorEstrutura.get(
                chave
            );


        if (
            tipo ===
            "parcial"
        ) {

            registro.parciais++;

        }

        else {

            registro.erros++;

        }

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
                    tipo === "erro"
                        ? 1
                        : 0,

                parciais:
                    tipo === "parcial"
                        ? 1
                        : 0,

                mapa:
                    mapaId,

                topico:
                    topico

            }
        );

    }

}


// ======================================================
// 10. CLASSIFICAÇÃO
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
// 11. EMBARALHAR
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
// 12. BANCO DE QUESTÕES
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

                    const questao = {

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


let bancoQuestoes =
    embaralhar(
        criarBancoQuestoes()
    );


// ======================================================
// 13. DISTRIBUIR MAPAS
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
// 14. MONTAR PROVA
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
        )
            .slice(
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
// 15. QUESTÕES DA PROVA
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


const quantidadeReal =
    Math.min(
        quantidadeSolicitada,
        bancoQuestoes.length
    );


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
// 16. HOTSPOTS
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


                svg.appendChild(
                    hitbox
                );

            }

        }
    );

}


// ======================================================
// 17. NOVA QUESTÃO
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


    if (
        feedback
    ) {

        feedback.textContent =
            "";

    }


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


    if (
        numeroQuestao
    ) {

        numeroQuestao.textContent =
            questaoAtual + 1;

    }


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
        imagem.naturalWidth > 0 &&
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
                novaURL
            );


            pergunta.textContent =
                "Erro ao carregar imagem.";

        };


    imagem.src =
        novaURL;

}


// ======================================================
// 18. MODO CLICAR
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

        acertos +=
            1;


        pontos +=
            100;

    }

    else {

        erros++;


        registrarErroEstruturaProva(
            "erro"
        );

    }


    registrarResultadoQuestao(

        estruturaClicada
            .dataset
            .nome,

        acertou,

        acertou
            ? "acerto"
            : "erro",

        {

            estruturaClicadaId:
                estruturaClicada
                    .dataset
                    .id,

            valorAcerto:
                acertou
                    ? 1
                    : 0

        }

    );


    if (
        feedback
    ) {

        feedback.textContent =
            "Resposta registrada.";

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
            "⚠️ Erro no analytics:",
            erroAnalytics
        );

    }


    setTimeout(
        function() {

            questaoAtual++;


            novaQuestao();

        },

        800
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
// 19. MODO DIGITAR
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


    if (
        estruturaAlvoSVG
    ) {

        estruturaAlvoSVG
            .classList
            .add(
                "destacada"
            );

    }


    pergunta.textContent =
        "Qual é a estrutura destacada?";


    if (
        campoResposta
    ) {

        campoResposta.value =
            "";


        campoResposta.disabled =
            false;

    }


    if (
        botaoResponder
    ) {

        botaoResponder.disabled =
            false;

    }


    setTimeout(
        function() {

            if (
                campoResposta
            ) {

                campoResposta.focus();

            }

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


    const avaliacao =
        avaliarRespostaDigitada(

            resposta,

            questaoEmAndamento
                .estrutura
                .nome

        );


    // ==================================================
    // ACERTO COMPLETO
    // 1 ACERTO
    // ==================================================

    if (
        avaliacao.valorAcerto ===
        1
    ) {

        acertos +=
            1;


        pontos +=
            100;

    }


    // ==================================================
    // ACERTO PARCIAL
    // 0,5 ACERTO
    // ==================================================

    else if (
        avaliacao.valorAcerto ===
        0.5
    ) {

        acertos +=
            0.5;


        parciais++;


        pontos +=
            50;


        registrarErroEstruturaProva(
            "parcial"
        );

    }


    // ==================================================
    // ERRO COMPLETO
    // ==================================================

    else {

        erros++;


        registrarErroEstruturaProva(
            "erro"
        );

    }


    // ==================================================
    // SALVAR RESULTADO
    // ==================================================

    registrarResultadoQuestao(

        resposta,

        avaliacao.acertou,

        avaliacao.tipo,

        {

            parcialmenteCorreta:
                avaliacao
                    .parcialmenteCorreta,

            valorAcerto:
                avaliacao
                    .valorAcerto

        }

    );


    if (
        estruturaAlvoSVG
    ) {

        estruturaAlvoSVG
            .classList
            .remove(
                "destacada"
            );

    }


    // Não revela o resultado durante a prova.

    feedback.textContent =
        "Resposta registrada.";


    campoResposta.disabled =
        true;


    botaoResponder.disabled =
        true;


    try {

        registrarAnalytics(

            resposta,

            avaliacao.acertou,

            tempoResposta

        );

    }

    catch (
        erroAnalytics
    ) {

        console.error(
            "⚠️ Erro no analytics:",
            erroAnalytics
        );

    }


    setTimeout(
        function() {

            questaoAtual++;


            novaQuestao();

        },

        800
    );

}


// ======================================================
// 20. ANALYTICS
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
// 21. ESTILOS DA REVISÃO
// ======================================================

function adicionarEstilosRevisaoProva() {

    if (
        document.getElementById(
            "estilosRevisaoProva"
        )
    ) {

        return;

    }


    const estilo =
        document.createElement(
            "style"
        );


    estilo.id =
        "estilosRevisaoProva";


    estilo.textContent =
        `

        .botao-revisar-questao {
            border: 0;
            border-radius: 10px;
            padding: 8px 12px;
            cursor: pointer;
            font-weight: 700;
        }

        .linha-revisavel {
            cursor: pointer;
        }

        .linha-revisavel:hover {
            background:
                rgba(99, 102, 241, 0.08);
        }

        .revisao-prova-overlay {
            position: fixed;
            inset: 0;
            z-index: 20000;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 20px;

            background:
                rgba(0, 0, 0, 0.72);
        }

        .revisao-prova-card {
            width: min(900px, 96vw);
            max-height: 92vh;

            overflow-y: auto;

            padding: 22px;

            border-radius: 18px;

            background: #ffffff;
            color: #111827;
        }

        html.tema-escuro
        .revisao-prova-card {
            background: #111827;
            color: #f8fafc;
        }

        .revisao-prova-respostas {
            display: grid;
            gap: 10px;

            margin: 18px 0;
        }

        .revisao-prova-resposta {
            padding: 12px 14px;

            border-radius: 12px;

            border:
                1px solid rgba(
                    148,
                    163,
                    184,
                    0.35
                );
        }

        .revisao-prova-legenda {
            display: flex;
            flex-wrap: wrap;
            gap: 14px;

            margin: 14px 0;

            font-weight: 700;
        }

        .revisao-prova-imagem {
            position: relative;

            width: 100%;

            margin-top: 14px;
        }

        .revisao-prova-imagem img {
            display: block;

            width: 100%;
            height: auto;

            border-radius: 12px;
        }

        .revisao-prova-imagem svg {
            position: absolute;
            inset: 0;

            width: 100%;
            height: 100%;

            pointer-events: none;
        }

        .revisao-prova-fechar {
            width: 100%;

            margin-top: 20px;

            padding: 12px 16px;

            border: 0;
            border-radius: 12px;

            cursor: pointer;

            font-weight: 700;
        }

        `;


    document.head.appendChild(
        estilo
    );

}


adicionarEstilosRevisaoProva();


// ======================================================
// 22. CRIAR ESTRUTURA NA REVISÃO
// ======================================================

function criarEstruturaRevisao(
    estrutura,
    svgRevisao
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


        elemento.setAttribute(
            "fill",
            "none"
        );


        elemento.setAttribute(
            "stroke-width",
            "5"
        );


        elemento.setAttribute(
            "stroke-linecap",
            "round"
        );


        elemento.setAttribute(
            "stroke-linejoin",
            "round"
        );

    }

    else {

        elemento =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "polygon"
            );

    }


    elemento.setAttribute(
        "points",
        estrutura.pontos
    );


    elemento.dataset.id =
        estrutura.id;


    svgRevisao.appendChild(
        elemento
    );


    return elemento;

}


// ======================================================
// 23. ABRIR REVISÃO
// ======================================================

function abrirRevisaoResultadoProva(
    resultado
) {

    const anterior =
        document.getElementById(
            "revisaoResultadoProva"
        );


    if (
        anterior
    ) {

        anterior.remove();

    }


    const mapa =
        catalogoMapas.find(
            function(
                item
            ) {

                return (
                    item.id ===
                    resultado.mapa
                );

            }
        );


    if (
        !mapa
    ) {

        alert(
            "Não foi possível localizar o mapa desta questão."
        );


        return;

    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "revisaoResultadoProva";


    overlay.className =
        "revisao-prova-overlay";


    const card =
        document.createElement(
            "section"
        );


    card.className =
        "revisao-prova-card";


    const titulo =
        document.createElement(
            "h2"
        );


    titulo.textContent =
        `🔎 Revisão — Questão ${resultado.numero}`;


    card.appendChild(
        titulo
    );


    // ==================================================
    // RESULTADO DA QUESTÃO
    // ==================================================

    const resultadoTexto =
        document.createElement(
            "p"
        );


    if (
        resultado.parcialmenteCorreta
    ) {

        resultadoTexto.textContent =
            "🟡 Resposta parcialmente correta — 0,5 acerto";

    }

    else if (
        resultado.acertou
    ) {

        resultadoTexto.textContent =
            "✅ Resposta correta — 1 acerto";

    }

    else {

        resultadoTexto.textContent =
            "❌ Resposta incorreta — 0 acerto";

    }


    card.appendChild(
        resultadoTexto
    );


    const respostas =
        document.createElement(
            "div"
        );


    respostas.className =
        "revisao-prova-respostas";


    const respostaAluno =
        document.createElement(
            "div"
        );


    respostaAluno.className =
        "revisao-prova-resposta";


    respostaAluno.innerHTML =
        `
        <strong>
            Sua resposta:
        </strong>

        <br>

        ${resultado.respostaDada}
        `;


    respostas.appendChild(
        respostaAluno
    );


    const respostaCorreta =
        document.createElement(
            "div"
        );


    respostaCorreta.className =
        "revisao-prova-resposta";


    respostaCorreta.innerHTML =
        `
        <strong>
            Resposta correta:
        </strong>

        <br>

        ${resultado.respostaEsperada}
        `;


    respostas.appendChild(
        respostaCorreta
    );


    card.appendChild(
        respostas
    );


    const legenda =
        document.createElement(
            "div"
        );


    legenda.className =
        "revisao-prova-legenda";


    if (
        resultado.modo ===
        "clicar" &&

        resultado.estruturaClicadaId &&

        !resultado.acertou
    ) {

        legenda.innerHTML =
            `
            <span>
                🔴 Onde você clicou
            </span>

            <span>
                🟢 Onde deveria clicar
            </span>
            `;

    }

    else {

        legenda.innerHTML =
            `
            <span>
                🟢 Estrutura correta
            </span>
            `;

    }


    card.appendChild(
        legenda
    );


    const areaImagem =
        document.createElement(
            "div"
        );


    areaImagem.className =
        "revisao-prova-imagem";


    const imagemRevisao =
        document.createElement(
            "img"
        );


    imagemRevisao.alt =
        "Imagem da questão revisada";


    const svgRevisao =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );


    areaImagem.appendChild(
        imagemRevisao
    );


    areaImagem.appendChild(
        svgRevisao
    );


    card.appendChild(
        areaImagem
    );


    imagemRevisao.onload =
        function() {

            svgRevisao.setAttribute(
                "viewBox",
                `0 0 ${
                    imagemRevisao.naturalWidth
                } ${
                    imagemRevisao.naturalHeight
                }`
            );


            const correta =
                mapa.estruturas.find(
                    function(
                        estrutura
                    ) {

                        return (
                            estrutura.id ===
                            resultado
                                .estruturaEsperadaId
                        );

                    }
                );


            const clicada =
                mapa.estruturas.find(
                    function(
                        estrutura
                    ) {

                        return (
                            estrutura.id ===
                            resultado
                                .estruturaClicadaId
                        );

                    }
                );


            // ==================================================
            // CORRETA — VERDE
            // ==================================================

            if (
                correta
            ) {

                const elementoCorreto =
                    criarEstruturaRevisao(
                        correta,
                        svgRevisao
                    );


                if (
                    correta.tipo ===
                    "linha"
                ) {

                    elementoCorreto.style.stroke =
                        "#16a34a";

                }

                else {

                    elementoCorreto.style.fill =
                        "rgba(22,163,74,0.28)";


                    elementoCorreto.style.stroke =
                        "#16a34a";


                    elementoCorreto.style.strokeWidth =
                        "4";

                }

            }


            // ==================================================
            // CLICADA ERRADA — VERMELHO
            // ==================================================

            if (
                resultado.modo ===
                "clicar" &&

                clicada &&

                clicada.id !==
                resultado
                    .estruturaEsperadaId
            ) {

                const elementoErrado =
                    criarEstruturaRevisao(
                        clicada,
                        svgRevisao
                    );


                if (
                    clicada.tipo ===
                    "linha"
                ) {

                    elementoErrado.style.stroke =
                        "#dc2626";

                }

                else {

                    elementoErrado.style.fill =
                        "rgba(220,38,38,0.28)";


                    elementoErrado.style.stroke =
                        "#dc2626";


                    elementoErrado.style.strokeWidth =
                        "4";

                }

            }

        };


    imagemRevisao.src =
        new URL(
            mapa.imagem,
            document.baseURI
        ).href;


    const fechar =
        document.createElement(
            "button"
        );


    fechar.type =
        "button";


    fechar.className =
        "revisao-prova-fechar";


    fechar.textContent =
        "← Voltar para a correção";


    fechar.addEventListener(
        "click",
        function() {

            overlay.remove();

        }
    );


    card.appendChild(
        fechar
    );


    overlay.appendChild(
        card
    );


    overlay.addEventListener(
        "click",
        function(
            evento
        ) {

            if (
                evento.target ===
                overlay
            ) {

                overlay.remove();

            }

        }
    );


    document.body.appendChild(
        overlay
    );

}


// ======================================================
// 24. TELA FINAL
// ======================================================

function mostrarTelaFeedbackProva() {

    const totalDaProva =
        questoesProva.length;


    // Como acertos pode ser 0,5,
    // ele já entra naturalmente no cálculo.

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
            )
                .toFixed(
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

                        (
                            b.erros +
                            b.parciais
                        ) -

                        (
                            a.erros +
                            a.parciais
                        )

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


    // ==================================================
    // TÍTULO
    // ==================================================

    const titulo =
        document.createElement(
            "h2"
        );


    titulo.textContent =
        "📝 Prova concluída!";


    card.appendChild(
        titulo
    );


    // ==================================================
    // CLASSIFICAÇÃO
    // ==================================================

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


    resumo.innerHTML =
        `

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
                ${parciais}
            </strong>

            <span>
                Parciais
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
    // CORREÇÃO
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


    const instrucao =
        document.createElement(
            "p"
        );


    instrucao.textContent =
        "Clique em Revisar para ver a resposta dada e a resposta correta.";


    secaoCorrecao.appendChild(
        instrucao
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


    // ==================================================
    // CABEÇALHO
    // ==================================================

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
        "Resposta esperada",
        "Revisão"

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


    // ==================================================
    // CORPO
    // ==================================================

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


            // ==================================================
            // QUESTÃO
            // ==================================================

            const colunaQuestao =
                document.createElement(
                    "td"
                );


            colunaQuestao.textContent =
                resultado.numero;


            linha.appendChild(
                colunaQuestao
            );


            // ==================================================
            // RESULTADO
            // ==================================================

            const colunaResultado =
                document.createElement(
                    "td"
                );


            if (
                resultado.acertou &&
                !resultado.parcialmenteCorreta
            ) {

                colunaResultado.textContent =
                    "✅ Correta — 1";


                colunaResultado.classList.add(
                    "resultado-correto"
                );

            }

            else if (
                resultado.parcialmenteCorreta
            ) {

                colunaResultado.textContent =
                    "🟡 Parcial — 0,5";


                colunaResultado.classList.add(
                    "resultado-parcial"
                );

            }

            else if (
                resultado.motivo ===
                "tempo"
            ) {

                colunaResultado.textContent =
                    "⏰ Tempo — 0";


                colunaResultado.classList.add(
                    "resultado-tempo"
                );

            }

            else {

                colunaResultado.textContent =
                    "❌ Incorreta — 0";


                colunaResultado.classList.add(
                    "resultado-errado"
                );

            }


            linha.appendChild(
                colunaResultado
            );


            // ==================================================
            // RESPOSTA DADA
            // ==================================================

            const colunaRespostaDada =
                document.createElement(
                    "td"
                );


            colunaRespostaDada.textContent =
                resultado.respostaDada;


            linha.appendChild(
                colunaRespostaDada
            );


            // ==================================================
            // RESPOSTA ESPERADA
            // ==================================================

            const colunaRespostaEsperada =
                document.createElement(
                    "td"
                );


            colunaRespostaEsperada.textContent =
                resultado.respostaEsperada;


            linha.appendChild(
                colunaRespostaEsperada
            );


            // ==================================================
            // REVISÃO
            // ==================================================

            const colunaRevisao =
                document.createElement(
                    "td"
                );


            const deveRevisar =

                !resultado.acertou ||

                resultado
                    .parcialmenteCorreta;


            if (
                deveRevisar
            ) {

                const botaoRevisar =
                    document.createElement(
                        "button"
                    );


                botaoRevisar.type =
                    "button";


                botaoRevisar.className =
                    "botao-revisar-questao";


                botaoRevisar.textContent =
                    "🔎 Revisar";


                botaoRevisar.addEventListener(
                    "click",
                    function(
                        evento
                    ) {

                        evento.stopPropagation();


                        abrirRevisaoResultadoProva(
                            resultado
                        );

                    }
                );


                colunaRevisao.appendChild(
                    botaoRevisar
                );


                linha.classList.add(
                    "linha-revisavel"
                );


                linha.addEventListener(
                    "click",
                    function() {

                        abrirRevisaoResultadoProva(
                            resultado
                        );

                    }
                );

            }

            else {

                colunaRevisao.textContent =
                    "—";

            }


            linha.appendChild(
                colunaRevisao
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


                const partesRevisao =
                    [];


                if (
                    item.erros >
                    0
                ) {

                    partesRevisao.push(

                        item.erros ===
                        1

                            ? "1 erro"

                            : `${item.erros} erros`

                    );

                }


                if (
                    item.parciais >
                    0
                ) {

                    partesRevisao.push(

                        item.parciais ===
                        1

                            ? "1 parcial"

                            : `${item.parciais} parciais`

                    );

                }


                quantidade.textContent =
                    partesRevisao.join(
                        " • "
                    );


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
// 25. BOTÃO RESPONDER
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
// 26. FINALIZAR PROVA
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


    if (
        feedback
    ) {

        feedback.textContent =
            "";

    }


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
// 27. REINICIAR
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