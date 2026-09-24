function iniciarModoClicar() {

    const VALOR_QUESTAO = 100;
    const PENALIDADE_ERRO = 10;

    const pontosElemento =
        document.getElementById("pontos");

    const errosElemento =
        document.getElementById("erros");

    const numeroQuestao =
        document.getElementById("numeroQuestao");

    const totalQuestoes =
        document.getElementById("totalQuestoes");

    const pergunta =
        document.getElementById("pergunta");

    const feedback =
        document.getElementById("feedback");

    const acoesPartida =
        document.getElementById("acoesPartida");

    const botaoReiniciar =
        document.getElementById("reiniciarPartida");

    const botaoVoltar =
        document.getElementById("voltarMenu");

    const svg =
        document.getElementById("camadaHotspots");


    if (acoesPartida) {

        acoesPartida.classList.add(
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


    const total =
        window.NeuroGame.totalQuestoes;


    totalQuestoes.textContent =
        total;


    // ======================================================
    // REGISTRAR ERRO POR ESTRUTURA
    // ======================================================

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

        }

        else {

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


    // ======================================================
    // CLASSIFICAÇÃO FINAL
    // ======================================================

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


    // ======================================================
    // TELA FINAL
    // ======================================================

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
        // BOTÕES DA TELA FINAL
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


    // ======================================================
    // NOVA QUESTÃO
    // ======================================================

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


                    questaoAtual++;


                    pergunta.textContent =
                        `Clique em: ${dados.estrutura.nome}`;


                    numeroQuestao.textContent =
                        questaoAtual;


                    bloqueado =
                        false;


                    inicioQuestao =
                        performance.now();

                }

            );

    }


    // ======================================================
    // VERIFICAR RESPOSTA
    // ======================================================

    function verificarResposta(
        estruturaClicada
    ) {

        if (
            bloqueado ||
            !estruturaAtual ||
            !estruturaClicada
        ) {

            return;

        }


        tentativasQuestao++;


        const tempoResposta =
            performance.now() -
            inicioQuestao;


        const acertou =
            estruturaClicada.dataset.id ===
            estruturaAtual.dataset.id;


        // ==================================================
        // ACERTO
        // ==================================================

        if (
            acertou
        ) {

            bloqueado =
                true;


            pontos +=
                pontosQuestao;


            pontosElemento.textContent =
                pontos;


            feedback.innerHTML = `
                <div class="feedback-didatico feedback-correto">

                    <div class="feedback-titulo">
                        ✅ Correto!
                    </div>

                    <div class="feedback-bloco">
                        <span class="feedback-label">
                            Estrutura:
                        </span>

                        <span class="feedback-valor">
                            ${estruturaClicada.dataset.nome}
                        </span>
                    </div>

                    <div class="feedback-pontos">
                        +${pontosQuestao} pontos
                    </div>

                </div>
            `;


            estruturaClicada
                .classList
                .add(
                    "correto"
                );


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
                                "clicar",

                            estruturaId:
                                estruturaAtual.dataset.id,

                            estruturaNome:
                                estruturaAtual.dataset.nome,

                            resposta:
                                estruturaClicada.dataset.nome,

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

            }

            catch (
                erro
            ) {

                console.error(
                    "⚠️ Erro no analytics:",
                    erro
                );

            }


            setTimeout(

                novaQuestao,

                1000

            );

        }


        // ==================================================
        // ERRO
        // ==================================================

        else {

            // Bloqueia novos cliques durante o feedback do erro

            bloqueado =
                true;


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


            feedback.innerHTML = `
                <div class="feedback-didatico feedback-erro">

                    <div class="feedback-titulo">
                        ❌ Resposta incorreta
                    </div>

                    <div class="feedback-bloco">
                        <span class="feedback-label">
                            Você clicou em:
                        </span>

                        <span class="feedback-valor">
                            ${estruturaClicada.dataset.nome}
                        </span>
                    </div>

                    <div class="feedback-bloco">
                        <span class="feedback-label">
                            Procure por:
                        </span>

                        <span class="feedback-valor">
                            ${estruturaAtual.dataset.nome}
                        </span>
                    </div>

                    <div class="feedback-pontos">
                        Nova tentativa em 2 segundos...
                    </div>

                </div>
            `;


            estruturaClicada
                .classList
                .add(
                    "errado"
                );


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
                                "clicar",

                            estruturaId:
                                estruturaAtual.dataset.id,

                            estruturaNome:
                                estruturaAtual.dataset.nome,

                            resposta:
                                estruturaClicada.dataset.nome,

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

            }

            catch (
                erro
            ) {

                console.error(
                    "⚠️ Erro no analytics:",
                    erro
                );

            }


            // Mantém o erro visível por 2 segundos
            // e depois libera nova tentativa
            // na mesma questão.

            setTimeout(

                function() {

                    estruturaClicada
                        .classList
                        .remove(
                            "errado"
                        );


                    feedback.innerHTML =
                        "";


                    bloqueado =
                        false;

                },

                2000

            );

        }

    }


    // ======================================================
    // TOQUE PRECISO NO MOBILE
    // ======================================================

    /*
        Quando NÃO existe polígono sob o dedo,
        aceitamos a linha se ela estiver até
        10 pixels visuais do toque.
    */

    const RAIO_LINHA_SEM_POLIGONO =
        10;


    /*
        Quando existe um polígono sob o dedo,
        somos mais rigorosos.

        A linha só vence o polígono se estiver
        realmente muito próxima do toque.
    */

    const RAIO_LINHA_SOBRE_POLIGONO =
        5;


    // ======================================================
    // CONVERTER PONTO DA TELA PARA O SVG
    // ======================================================

    function obterPontoSVG(
        evento
    ) {

        const matriz =
            svg.getScreenCTM();


        if (
            !matriz
        ) {

            return null;

        }


        const ponto =
            svg.createSVGPoint();


        ponto.x =
            evento.clientX;


        ponto.y =
            evento.clientY;


        return ponto.matrixTransform(
            matriz.inverse()
        );

    }


    // ======================================================
    // DISTÂNCIA ENTRE UM PONTO E UM SEGMENTO
    // ======================================================

    function distanciaPontoSegmento(
        px,
        py,
        x1,
        y1,
        x2,
        y2
    ) {

        const dx =
            x2 - x1;


        const dy =
            y2 - y1;


        if (
            dx === 0 &&
            dy === 0
        ) {

            return Math.hypot(
                px - x1,
                py - y1
            );

        }


        let t =
            (
                (
                    px - x1
                ) *
                dx
                +
                (
                    py - y1
                ) *
                dy
            )
            /
            (
                dx * dx +
                dy * dy
            );


        t =
            Math.max(

                0,

                Math.min(
                    1,
                    t
                )

            );


        const x =
            x1 +
            t * dx;


        const y =
            y1 +
            t * dy;


        return Math.hypot(

            px - x,

            py - y

        );

    }


    // ======================================================
    // OBTER PONTOS DA POLYLINE
    // ======================================================

    function obterPontosLinha(
        elemento
    ) {

        const atributo =
            elemento.getAttribute(
                "points"
            );


        if (
            !atributo
        ) {

            return [];

        }


        /*
            Aceita:

            100,200 150,250
            ou
            100 200 150 250
        */

        const numeros =
            atributo
                .trim()
                .split(
                    /[\s,]+/
                )
                .map(
                    Number
                )
                .filter(

                    function(
                        valor
                    ) {

                        return Number.isFinite(
                            valor
                        );

                    }

                );


        const pontos =
            [];


        for (

            let i =
                0;

            i <
            numeros.length - 1;

            i +=
                2

        ) {

            pontos.push(
                {

                    x:
                        numeros[i],

                    y:
                        numeros[
                            i + 1
                        ]

                }
            );

        }


        return pontos;

    }


    // ======================================================
    // DISTÂNCIA DO TOQUE ATÉ UMA LINHA
    // ======================================================

    function distanciaAteLinha(
        linha,
        ponto
    ) {

        if (
            !linha ||
            !ponto
        ) {

            return Infinity;

        }


        const pontos =
            obterPontosLinha(
                linha
            );


        if (
            pontos.length <
            2
        ) {

            return Infinity;

        }


        let menor =
            Infinity;


        for (

            let i =
                0;

            i <
            pontos.length - 1;

            i++

        ) {

            const atual =
                pontos[i];


            const proximo =
                pontos[
                    i + 1
                ];


            const distancia =
                distanciaPontoSegmento(

                    ponto.x,
                    ponto.y,

                    atual.x,
                    atual.y,

                    proximo.x,
                    proximo.y

                );


            if (
                distancia <
                menor
            ) {

                menor =
                    distancia;

            }

        }


        return menor;

    }


    // ======================================================
    // ENCONTRAR LINHA MAIS PRÓXIMA
    // ======================================================

    function encontrarLinhaMaisProxima(
        evento
    ) {

        const ponto =
            obterPontoSVG(
                evento
            );


        if (
            !ponto
        ) {

            return null;

        }


        /*
            Procuramos apenas as linhas reais.

            Não usamos as hitboxes invisíveis
            para decidir qual estrutura venceu.
        */

        const linhas =
            Array.from(

                svg.querySelectorAll(
                    ".estrutura-linha"
                )

            );


        if (
            linhas.length ===
            0
        ) {

            return null;

        }


        const larguraTela =
            svg
                .getBoundingClientRect()
                .width;


        const viewBox =
            svg.viewBox.baseVal;


        if (
            !larguraTela ||
            !viewBox.width
        ) {

            return null;

        }


        /*
            Conversão das unidades internas
            do SVG para pixels visuais da tela.
        */

        const escala =
            viewBox.width /
            larguraTela;


        let melhorLinha =
            null;


        let menorDistancia =
            Infinity;


        linhas.forEach(

            function(
                linha
            ) {

                const distancia =
                    distanciaAteLinha(
                        linha,
                        ponto
                    );


                if (
                    distancia <
                    menorDistancia
                ) {

                    menorDistancia =
                        distancia;


                    melhorLinha =
                        linha;

                }

            }

        );


        if (
            !melhorLinha
        ) {

            return null;

        }


        return {

            elemento:
                melhorLinha,

            distanciaPixels:
                menorDistancia /
                escala

        };

    }


    // ======================================================
    // DESCOBRIR POLÍGONO SOB O TOQUE
    // ======================================================

    function encontrarPoligonoNoPonto(
        evento
    ) {

        /*
            elementsFromPoint permite enxergar
            todos os elementos existentes abaixo
            do local tocado.

            Isso é importante quando uma linha ou
            hitbox está visualmente por cima do polígono.
        */

        const elementosNoPonto =
            document.elementsFromPoint(

                evento.clientX,
                evento.clientY

            );


        const poligono =
            elementosNoPonto.find(

                function(
                    elemento
                ) {

                    return (

                        elemento &&

                        elemento.classList &&

                        elemento.classList.contains(
                            "estrutura-area"
                        ) &&

                        svg.contains(
                            elemento
                        )

                    );

                }

            );


        return (
            poligono ||
            null
        );

    }


    // ======================================================
    // RESOLVER QUAL ESTRUTURA O USUÁRIO QUIS TOCAR
    // ======================================================

    function resolverToqueMobile(
        evento
    ) {

        const linha =
            encontrarLinhaMaisProxima(
                evento
            );


        const poligono =
            encontrarPoligonoNoPonto(
                evento
            );


        // ==================================================
        // EXISTE POLÍGONO SOB O TOQUE
        // ==================================================

        if (
            poligono
        ) {

            /*
                A linha só recebe prioridade
                se estiver até 5 px do dedo.

                Isso reduz situações em que uma
                linha próxima "rouba" um clique
                destinado ao polígono.
            */

            if (
                linha &&
                linha.elemento &&
                linha.distanciaPixels <=
                RAIO_LINHA_SOBRE_POLIGONO
            ) {

                return linha.elemento;

            }


            return poligono;

        }


        // ==================================================
        // NÃO EXISTE POLÍGONO
        // ==================================================

        /*
            Fora de polígonos podemos aceitar uma
            tolerância maior para facilitar o toque
            em sulcos e outras estruturas lineares.
        */

        if (
            linha &&
            linha.elemento &&
            linha.distanciaPixels <=
            RAIO_LINHA_SEM_POLIGONO
        ) {

            return linha.elemento;

        }


        return null;

    }


    // ======================================================
    // CLIQUE / TOQUE NAS ESTRUTURAS
    // ======================================================

    svg.addEventListener(

        "pointerup",

        function(
            evento
        ) {

            if (
                bloqueado
            ) {

                return;

            }


            // ==============================================
            // MOUSE / COMPUTADOR
            // ==============================================

            if (
                evento.pointerType ===
                "mouse"
            ) {

                const alvo =
                    evento.target;


                // ==========================================
                // ESTRUTURA REAL
                // ==========================================

                if (
                    alvo.classList &&
                    alvo.classList.contains(
                        "estrutura"
                    )
                ) {

                    evento.preventDefault();


                    verificarResposta(
                        alvo
                    );


                    return;

                }


                // ==========================================
                // HITBOX INVISÍVEL DAS LINHAS
                // ==========================================

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
                                elemento
                            ) {

                                return (

                                    elemento.dataset.id ===
                                    id

                                );

                            }

                        );


                    if (
                        estruturaReal
                    ) {

                        verificarResposta(
                            estruturaReal
                        );

                    }


                    return;

                }


                return;

            }


            // ==============================================
            // TOUCH / MOBILE / CANETA
            // ==============================================

            evento.preventDefault();


            const estruturaEscolhida =
                resolverToqueMobile(
                    evento
                );


            if (
                estruturaEscolhida
            ) {

                verificarResposta(
                    estruturaEscolhida
                );

            }

        }

    );


    // ======================================================
    // REINICIAR PARTIDA
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
    // VOLTAR AO MENU
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
    // FINALIZAR JOGO
    // ======================================================

    function finalizarJogo() {

        bloqueado =
            true;


        estruturaAtual =
            null;


        pergunta.textContent =
            "🎉 Fim da rodada!";


        const pontuacaoMaxima =
            total *
            VALOR_QUESTAO;


        feedback.textContent =
            `Pontuação: ${pontos} / ${pontuacaoMaxima} | Erros: ${erros}`;


        mostrarTelaFeedback();

    }


    // ======================================================
    // INICIAR PRIMEIRA QUESTÃO
    // ======================================================

    novaQuestao();

}