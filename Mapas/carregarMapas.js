// ======================================================
// CARREGADOR CENTRAL DE MAPAS — NEUROGAME
// ======================================================


// ======================================================
// 1. DESCOBRIR CAMINHO DA PASTA MAPAS
// ======================================================

const scriptCarregador =
    document.currentScript;


const urlCarregador =
    new URL(
        scriptCarregador.src
    );


const pastaMapas =
    new URL(
        "./",
        urlCarregador
    );


// Raiz do projeto:
//
// /Mapas/
//    ↑
// ../
//    ↑
// raiz

const raizProjeto =
    new URL(
        "../",
        pastaMapas
    );


// ======================================================
// 2. CARREGAR SCRIPT
// ======================================================

function carregarScriptNeuroGame(
    caminho
) {

    return new Promise(
        function(resolve, reject) {


            let caminhoLimpo =
                caminho;


            // Permite manifesto antigo com:
            //
            // Mapas/mapaX.js
            //
            // ou novo:
            //
            // mapaX.js

            if (
                caminhoLimpo.startsWith(
                    "Mapas/"
                )
            ) {

                caminhoLimpo =
                    caminhoLimpo.replace(
                        "Mapas/",
                        ""
                    );

            }


            const urlFinal =
                new URL(
                    caminhoLimpo,
                    pastaMapas
                ).href;


            const existente =
                document.querySelector(
                    `script[data-neurogame="${urlFinal}"]`
                );


            if (
                existente
            ) {

                resolve();

                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                urlFinal;


            script.dataset.neurogame =
                urlFinal;


            script.onload =
                function() {

                    console.log(
                        "✅ Carregado:",
                        caminhoLimpo
                    );


                    resolve();

                };


            script.onerror =
                function() {

                    console.error(
                        "❌ Erro ao carregar:",
                        urlFinal
                    );


                    reject(
                        new Error(
                            `Erro ao carregar ${urlFinal}`
                        )
                    );

                };


            document.head.appendChild(
                script
            );

        }
    );

}


// ======================================================
// 3. CARREGAR TODOS OS MAPAS
// ======================================================

window.mapasProntos =
    new Promise(
        async function(resolve, reject) {

            try {


                // ======================================
                // MANIFESTO
                // ======================================

                await carregarScriptNeuroGame(
                    "manifestoMapas.js"
                );


                if (
                    !Array.isArray(
                        window.definicoesMapas
                    )
                ) {

                    throw new Error(
                        "Manifesto de mapas não encontrado."
                    );

                }


                // ======================================
                // ARQUIVOS DOS MAPAS
                // ======================================

                for (
                    const definicao
                    of window.definicoesMapas
                ) {

                    await carregarScriptNeuroGame(
                        definicao.arquivo
                    );

                }


                // ======================================
                // CRIAR CATÁLOGO
                // ======================================

                window.catalogoMapas =
                    [];


                window.definicoesMapas.forEach(
                    function(definicao) {


                        let estruturas;


                        try {

                            estruturas =
                                definicao
                                    .obterEstruturas();

                        }

                        catch (
                            erro
                        ) {

                            console.error(
                                "Erro nas estruturas:",
                                definicao.id,
                                erro
                            );


                            return;

                        }


                        if (
                            !Array.isArray(
                                estruturas
                            )
                        ) {

                            console.warn(
                                "Mapa ignorado:",
                                definicao.id
                            );


                            return;

                        }


                        // URL absoluta da imagem

                        const imagemResolvida =
                            new URL(
                                definicao.imagem,
                                raizProjeto
                            ).href;


                        window.catalogoMapas.push(
                            {

                                id:
                                    definicao.id,

                                titulo:
                                    definicao.titulo,

                                imagem:
                                    imagemResolvida,

                                estruturas:
                                    estruturas

                            }
                        );

                    }
                );


                // ======================================
                // FINAL
                // ======================================

                console.log(
                    "🧠 Catálogo carregado:",
                    window.catalogoMapas
                );


                console.log(
                    "Total de mapas:",
                    window.catalogoMapas.length
                );


                document.dispatchEvent(
                    new CustomEvent(
                        "neurogame:mapas-prontos"
                    )
                );


                resolve(
                    window.catalogoMapas
                );

            }


            catch (
                erro
            ) {

                console.error(
                    "❌ Falha no carregador:",
                    erro
                );


                reject(
                    erro
                );

            }

        }
    );