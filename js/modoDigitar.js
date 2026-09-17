function iniciarModoDigitar() {

    const VALOR_QUESTAO =
        100;


    const PENALIDADE_ERRO =
        10;


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


    // ==================================================
    // BOTÃO PULAR QUESTÃO
    // ==================================================

    const botaoPular =
        document.createElement(
            "button"
        );


    botaoPular.id =
        "pularQuestao";


    botaoPular.type =
        "button";


    botaoPular.textContent =
        "⏭️ Pular questão";


    if (
        areaDigitar &&
        botaoResponder
    ) {

        areaDigitar.appendChild(
            botaoPular
        );

    }


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
        acoesPartida
    ) {

        acoesPartida
            .classList
            .add(
                "visivel"
            );

    }


    let pontos =
        0;


    let erros =
        0;


    let questaoAtual =
        0;


    let estruturaAtual =
        null;


    let mapaAtual =
        null;


    let bloqueado =
        false;


    let inicioQuestao =
        0;


    let tentativasQuestao =
        0;


    let pontosQuestao =
        VALOR_QUESTAO;


    const errosPorEstrutura =
        new Map();


    // ==================================================
    // ESTRUTURAS PULADAS
    // ==================================================

    const estruturasPuladas =
        new Map();


    const total =
        window.NeuroGame.totalQuestoes;


    totalQuestoes.textContent =
        total;


    // ==================================================
    // NORMALIZAR TEXTO
    // ==================================================

   function normalizar(
    texto
) {

    return String(
        texto ||
        ""
    )
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()

        // Ignora hífen, underline e espaços
        .replace(
            /[-_\s]/g,
            ""
        )

        .trim();

}

    // ==================================================
    // LIMPAR DESTAQUES
    // ==================================================

    function limparDestaques() {

        document
            .querySelectorAll(
                ".estrutura"
            )
            .forEach(
                function(
                    estrutura
                ) {

                    estrutura
                        .classList
                        .remove(
                            "destacada",
                            "correto",
                            "errado"
                        );

                }
            );

    }


    // ==================================================
    // REGISTRAR ERRO
    // ==================================================

    function registrarErroEstrutura() {

        if (
            !estruturaAtual
        ) {

            return;

        }


        const id =
            estruturaAtual.dataset.id;


        const nome =
            estruturaAtual.dataset.nome;


        if (
            errosPorEstrutura.has(
                id
            )
        ) {

            errosPorEstrutura
                .get(
                    id
                )
                .erros++;

        } else {

            errosPorEstrutura.set(
                id,
                {

                    id:
                        id,

                    nome:
                        nome,

                    erros:
                        1,

                    mapa:
                        mapaAtual
                            ? mapaAtual.id
                            : null

                }
            );

        }

    }


    // ==================================================
    // REGISTRAR ESTRUTURA PULADA
    // ==================================================

    function registrarEstruturaPulada() {

        if (
            !estruturaAtual
        ) {

            return;

        }


        const mapaId =
            mapaAtual
                ? mapaAtual.id
                : "desconhecido";


        const id =
            estruturaAtual.dataset.id;


        const nome =
            estruturaAtual.dataset.nome;


        const chave =
            `${mapaId}::${id}`;


        if (
            estruturasPuladas.has(
                chave
            )
        ) {

            estruturasPuladas
                .get(
                    chave
                )
                .pulos++;

        } else {

            estruturasPuladas.set(
                chave,
                {

                    id:
                        id,

                    nome:
                        nome,

                    mapa:
                        mapaId,

                    pulos:
                        1

                }
            );

        }

    }


    // ==================================================
    // CLASSIFICAÇÃO
    // ==================================================

    function obterClassificacao(
        aproveitamento
    ) {

        if (
            aproveitamento >=
            90
        ) {

            return {

                titulo:
                    "🏆 Excelente domínio!",

                mensagem:
                    "Você apresentou ótimo desempenho nesta partida."

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
                    "Seu desempenho foi muito bom. Revise os pontos em que teve dificuldade."

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
                    "Você está avançando bem. Uma revisão das estruturas erradas pode consolidar o conteúdo."

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
                    "Vale a pena revisar as estruturas abaixo no Atlas antes da próxima tentativa."

            };

        }


        return {

            titulo:
                "🔄 Hora de revisar",

            mensagem:
                "Recomendo revisar as estruturas abaixo no Atlas e tentar novamente."

        };

    }


    // ==================================================
    // TELA FINAL
    // ==================================================

    function mostrarTelaFeedback() {

        const pontuacaoMaxima =
            total *
            VALOR_QUESTAO;


        const aproveitamento =
            pontuacaoMaxima > 0

                ? Math.round(
                    (
                        pontos /
                        pontuacaoMaxima
                    ) *
                    100
                )

                : 0;


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


        const estruturasPuladasLista =
            Array.from(
                estruturasPuladas.values()
            );


        const estruturasSemErro =
            Math.max(

                0,

                total -
                estruturasErradas.length

            );


        const classificacao =
            obterClassificacao(
                aproveitamento
            );


        const antiga =
            document.getElementById(
                "feedbackFinalPartida"
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
            "feedbackFinalPartida";


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
            "🧠 Partida concluída!";


        card.appendChild(
            titulo
        );


        const classificacaoTitulo =
            document.createElement(
                "h3"
            );


        classificacaoTitulo.className =
            "feedback-final-classificacao";


        classificacaoTitulo.textContent =
            classificacao.titulo;


        card.appendChild(
            classificacaoTitulo
        );


        const classificacaoTexto =
            document.createElement(
                "p"
            );


        classificacaoTexto.className =
            "feedback-final-mensagem";


        classificacaoTexto.textContent =
            classificacao.mensagem;


        card.appendChild(
            classificacaoTexto
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
                    ${pontos} / ${pontuacaoMaxima}
                </strong>

                <span>
                    Pontuação
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


            <div>

                <strong>
                    ${erros}
                </strong>

                <span>
                    Erros totais
                </span>

            </div>


            <div>

                <strong>
                    ${estruturasSemErro}
                </strong>

                <span>
                    Estruturas sem erro
                </span>

            </div>

        `;


        card.appendChild(
            resumo
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
                "🏆 Você concluiu a partida sem errar nenhuma estrutura.";


            revisao.appendChild(
                perfeito
            );

        } else {

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


        // ==================================================
        // ESTRUTURAS PULADAS
        // ==================================================

        if (
            estruturasPuladasLista.length >
            0
        ) {

            const secaoPuladas =
                document.createElement(
                    "div"
                );


            secaoPuladas.className =
                "feedback-final-revisao";


            const tituloPuladas =
                document.createElement(
                    "h3"
                );


            tituloPuladas.textContent =
                "Estruturas puladas";


            secaoPuladas.appendChild(
                tituloPuladas
            );


            const listaPuladas =
                document.createElement(
                    "div"
                );


            listaPuladas.className =
                "feedback-final-lista";


            estruturasPuladasLista.forEach(
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
                        item.pulos === 1
                            ? "Pulada"
                            : `${item.pulos} pulos`;


                    linha.appendChild(
                        nome
                    );


                    linha.appendChild(
                        quantidade
                    );


                    listaPuladas.appendChild(
                        linha
                    );

                }
            );


            secaoPuladas.appendChild(
                listaPuladas
            );


            card.appendChild(
                secaoPuladas
            );

        }


        // ==================================================
        // BOTÕES
        // ==================================================

        const botoes =
            document.createElement(
                "div"
            );


        botoes.className =
            "feedback-final-botoes";


        const jogarNovamente =
            document.createElement(
                "button"
            );


        jogarNovamente.type =
            "button";


        jogarNovamente.textContent =
            "🔄 Jogar novamente";


        jogarNovamente.addEventListener(
            "click",

            function() {

                window.location.reload();

            }
        );


        const revisarAtlas =
            document.createElement(
                "button"
            );


        revisarAtlas.type =
            "button";


        revisarAtlas.textContent =
            "🔍 Revisar no Atlas";


        revisarAtlas.addEventListener(
            "click",

            function() {

                window.location.href =
                    "atlas.html";

            }
        );


        const voltarMenuFinal =
            document.createElement(
                "button"
            );


        voltarMenuFinal.type =
            "button";


        voltarMenuFinal.textContent =
            "← Voltar ao menu";


        voltarMenuFinal.addEventListener(
            "click",

            function() {

                window.location.href =
                    "jogo-menu.html";

            }
        );


        botoes.appendChild(
            jogarNovamente
        );


        botoes.appendChild(
            revisarAtlas
        );


        botoes.appendChild(
            voltarMenuFinal
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


    // ==================================================
    // NOVA QUESTÃO
    // ==================================================

    function novaQuestao() {

        const questao =
            window.NeuroGame
                .obterProximaQuestao();


        if (
            !questao
        ) {

            finalizarJogo();

            return;

        }


        bloqueado =
            true;


        tentativasQuestao =
            0;


        pontosQuestao =
            VALOR_QUESTAO;


        feedback.textContent =
            "";


        if (
            caixaInfo
        ) {

            caixaInfo.textContent =
                "";

        }


        window.NeuroGame
            .carregarQuestao(

                questao,

                function(
                    dados
                ) {

                    mapaAtual =
                        dados.mapa;


                    estruturaAtual =
                        dados.estruturaSVG;


                    if (
                        !estruturaAtual
                    ) {

                        pergunta.textContent =
                            "Erro ao carregar a estrutura.";


                        bloqueado =
                            true;


                        return;

                    }


                    limparDestaques();


                    estruturaAtual
                        .classList
                        .add(
                            "destacada"
                        );


                    questaoAtual++;


                    pergunta.textContent =
                        "Qual é a estrutura destacada?";


                    numeroQuestao.textContent =
                        questaoAtual;


                    campoResposta.value =
                        "";


                    campoResposta.disabled =
                        false;


                    botaoResponder.disabled =
                        false;


                    botaoPular.disabled =
                        false;


                    bloqueado =
                        false;


                    inicioQuestao =
                        performance.now();


                    setTimeout(
                        function() {

                            campoResposta.focus();

                        },
                        50
                    );

                }

            );

    }


    // ==================================================
    // PULAR QUESTÃO
    // ==================================================

    function pularQuestao() {

        if (
            bloqueado ||
            !estruturaAtual
        ) {

            return;

        }


        bloqueado =
            true;


        registrarEstruturaPulada();


        const nomePulada =
            estruturaAtual.dataset.nome;


        estruturaAtual
            .classList
            .remove(
                "destacada"
            );


        feedback.textContent =
            `⏭️ Questão pulada: ${nomePulada}`;


        campoResposta.value =
            "";


        campoResposta.disabled =
            true;


        botaoResponder.disabled =
            true;


        botaoPular.disabled =
            true;


        setTimeout(
            novaQuestao,
            700
        );

    }


    // ==================================================
    // VERIFICAR RESPOSTA
    // ==================================================

    function verificarResposta() {

        if (
            bloqueado ||
            !estruturaAtual
        ) {

            return;

        }


        const respostaAluno =
            normalizar(
                campoResposta.value
            );


        if (
            !respostaAluno
        ) {

            feedback.textContent =
                "Digite uma resposta.";


            campoResposta.focus();


            return;

        }


        tentativasQuestao++;


        const tempoResposta =
            performance.now() -
            inicioQuestao;


        const respostaCorreta =
            normalizar(
                estruturaAtual.dataset.nome
            );


        // ==================================================
        // ACERTO
        // ==================================================

        if (
            respostaAluno ===
            respostaCorreta
        ) {

            bloqueado =
                true;


            pontos +=
                pontosQuestao;


            pontosElemento.textContent =
                pontos;


            feedback.textContent =
                `✅ Correto! +${pontosQuestao} pontos`;


            estruturaAtual
                .classList
                .remove(
                    "destacada"
                );


            estruturaAtual
                .classList
                .add(
                    "correto"
                );


            if (
                caixaInfo &&
                estruturaAtual.dataset.info
            ) {

                caixaInfo.textContent =
                    estruturaAtual.dataset.info;

            }


            campoResposta.disabled =
                true;


            botaoResponder.disabled =
                true;


            try {

                if (
                    typeof registrarResposta ===
                    "function"
                ) {

                    registrarResposta(
                        {

                            mapa:
                                mapaAtual
                                    ? mapaAtual.id
                                    : "desconhecido",

                            modo:
                                "digitar",

                            estruturaId:
                                estruturaAtual.dataset.id,

                            estruturaNome:
                                estruturaAtual.dataset.nome,

                            resposta:
                                campoResposta.value,

                            acertou:
                                true,

                            tentativas:
                                tentativasQuestao,

                            tempoResposta:
                                tempoResposta,

                            pontosQuestao:
                                pontosQuestao,

                            pontos:
                                pontos

                        }
                    );

                }

            } catch (
                erro
            ) {

                console.error(
                    "⚠️ Erro no analytics:",
                    erro
                );

            }


            setTimeout(
                novaQuestao,
                1500
            );

        }


        // ==================================================
        // ERRO
        // ==================================================

        else {

            erros++;


            errosElemento.textContent =
                erros;


            registrarErroEstrutura();


            pontosQuestao =
                Math.max(
                    0,
                    pontosQuestao -
                    PENALIDADE_ERRO
                );


            feedback.textContent =
                `❌ Resposta incorreta. Tente novamente. Esta questão agora vale ${pontosQuestao} pontos.`;


            try {

                if (
                    typeof registrarResposta ===
                    "function"
                ) {

                    registrarResposta(
                        {

                            mapa:
                                mapaAtual
                                    ? mapaAtual.id
                                    : "desconhecido",

                            modo:
                                "digitar",

                            estruturaId:
                                estruturaAtual.dataset.id,

                            estruturaNome:
                                estruturaAtual.dataset.nome,

                            resposta:
                                campoResposta.value,

                            acertou:
                                false,

                            tentativas:
                                tentativasQuestao,

                            tempoResposta:
                                tempoResposta,

                            pontosQuestao:
                                pontosQuestao,

                            pontos:
                                pontos

                        }
                    );

                }

            } catch (
                erro
            ) {

                console.error(
                    "⚠️ Erro no analytics:",
                    erro
                );

            }


            campoResposta.select();

        }

    }


    // ==================================================
    // BOTÃO RESPONDER
    // ==================================================

    if (
        botaoResponder
    ) {

        botaoResponder.addEventListener(
            "click",
            verificarResposta
        );

    }


    // ==================================================
    // BOTÃO PULAR
    // ==================================================

    if (
        botaoPular
    ) {

        botaoPular.addEventListener(
            "click",
            pularQuestao
        );

    }


    // ==================================================
    // ENTER
    // ==================================================

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


                    verificarResposta();

                }

            }
        );

    }


    // ==================================================
    // REINICIAR
    // ==================================================

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


    // ==================================================
    // VOLTAR
    // ==================================================

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


    // ==================================================
    // FINALIZAR JOGO
    // ==================================================

    function finalizarJogo() {

        bloqueado =
            true;


        estruturaAtual =
            null;


        limparDestaques();


        pergunta.textContent =
            "🎉 Fim da rodada!";


        const pontuacaoMaxima =
            total *
            VALOR_QUESTAO;


        feedback.textContent =
            `Pontuação: ${pontos} / ${pontuacaoMaxima} | Erros: ${erros}`;


        campoResposta.disabled =
            true;


        botaoResponder.disabled =
            true;


        botaoPular.disabled =
            true;


        mostrarTelaFeedback();

    }


    // ==================================================
    // INICIAR
    // ==================================================

    novaQuestao();

}