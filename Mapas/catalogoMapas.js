// ======================================================
// CATÁLOGO CENTRAL DE MAPAS — NEUROGAME
//
// Utilizado por:
// - Atlas
// - Jogo
// - Prova
// ======================================================


// ======================================================
// CATÁLOGO
// ======================================================

const catalogoMapas = [];


// ======================================================
// FUNÇÃO PARA REGISTRAR UM MAPA
// ======================================================

function registrarMapa(
    configuracao
) {

    // --------------------------------------
    // Verificar estruturas
    // --------------------------------------

    if (
        !Array.isArray(
            configuracao.estruturas
        )
    ) {

        console.warn(
            "⚠️ Mapa não registrado:",
            configuracao.id,
            "Estruturas não encontradas."
        );

        return;

    }


    // --------------------------------------
    // Evitar ID duplicado
    // --------------------------------------

    const jaExiste =
        catalogoMapas.some(
            function(mapa) {

                return (
                    mapa.id ===
                    configuracao.id
                );

            }
        );


    if (
        jaExiste
    ) {

        console.warn(
            "⚠️ Mapa duplicado ignorado:",
            configuracao.id
        );

        return;

    }


    // --------------------------------------
    // Adicionar ao catálogo
    // --------------------------------------

    catalogoMapas.push(
        {

            id:
                configuracao.id,

            topico:
                configuracao.topico ||
                null,

            titulo:
                configuracao.titulo,

            imagem:
                configuracao.imagem,

            estruturas:
                configuracao.estruturas

        }
    );


    console.log(
        "✅ Mapa registrado:",
        configuracao.titulo,
        configuracao.estruturas.length,
        "estruturas"
    );

}


// ======================================================
// TELENCÉFALO — VISTA LATERAL
// ======================================================

if (
    typeof mapaTelencefaloLateral !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "telencefalo-lateral",

            topico:
                "telencefalo",

            titulo:
                "Telencéfalo — Vista Lateral",

            imagem:
                "imagens/PalcoTelencefalo.webp",

            estruturas:
                mapaTelencefaloLateral

        }
    );

}

else {

    console.warn(
        "⚠️ mapaTelencefaloLateral não foi carregado."
    );

}


// ======================================================
// TELENCÉFALO — VISTA MEDIAL
// ======================================================

if (
    typeof mapaTelencefaloMedial !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "telencefalo-medial",

            topico:
                "telencefalo",

            titulo:
                "Telencéfalo — Vista Medial",

            imagem:
                "imagens/PalcoTelencefaloMedial.webp",

            estruturas:
                mapaTelencefaloMedial

        }
    );

}

else {

    console.warn(
        "⚠️ mapaTelencefaloMedial não foi carregado."
    );

}


// ======================================================
// TELENCÉFALO — LOBO INSULAR
// ======================================================

if (
    typeof mapaLoboInsular !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "telencefalo-lobo-insular",

            topico:
                "telencefalo",

            titulo:
                "Telencéfalo — Vista Lobo Insular",

            imagem:
                "imagens/LoboInsular.webp",

            estruturas:
                mapaLoboInsular

        }
    );

}

else {

    console.warn(
        "⚠️ mapaLoboInsular não foi carregado."
    );

}


// ======================================================
// TELENCÉFALO — BOLACHA 01
// ======================================================

if (
    typeof mapaTelencefaloBolacha01 !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "telencefalo-bolacha01",

            topico:
                "telencefalo",

            titulo:
                "Telencéfalo — Vista Transversal 01",

            imagem:
                "imagens/TelencefaloBolacha01.webp",

            estruturas:
                mapaTelencefaloBolacha01

        }
    );

}

else {

    console.warn(
        "⚠️ mapaTelencefaloBolacha01 não foi carregado."
    );

}


// ======================================================
// TELENCÉFALO — BOLACHA 02
// ======================================================

if (
    typeof mapaTelencefaloBolacha02 !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "telencefalo-bolacha02",

            topico:
                "telencefalo",

            titulo:
                "Telencéfalo — Vista Coronal 02",

            imagem:
                "imagens/TelencefaloBolacha02.webp",

            estruturas:
                mapaTelencefaloBolacha02

        }
    );

}

else {

    console.warn(
        "⚠️ mapaTelencefaloBolacha02 não foi carregado."
    );

}


// ======================================================
// TELENCÉFALO — BOLACHA 03
// ======================================================

if (
    typeof mapaTelencefaloBolacha03 !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "telencefalo-bolacha03",

            topico:
                "telencefalo",

            titulo:
                "Telencéfalo — Vista Coronal 03",

            imagem:
                "imagens/TelencefaloBolacha03.webp",

            estruturas:
                mapaTelencefaloBolacha03

        }
    );

}

else {

    console.warn(
        "⚠️ mapaTelencefaloBolacha03 não foi carregado."
    );

}


// ======================================================
// DIENCÉFALO — VISTA LATERAL 01
// ======================================================

if (
    typeof mapaCadaverDiencefalo01 !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "diencefalo-01",

            topico:
                "diencefalo",

            titulo:
                "Diencéfalo e Tálamo — Vista Lateral 01",

            imagem:
                "imagens/Diencefalo01.webp",

            estruturas:
                mapaCadaverDiencefalo01

        }
    );

}

else {

    console.warn(
        "⚠️ mapaCadaverDiencefalo01 não foi carregado."
    );

}


// ======================================================
// DIENCÉFALO — VISTA POSTERIOR
// ======================================================

if (
    typeof mapaDiencefaloPosterior !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "diencefalo-posterior-01",

            topico:
                "diencefalo",

            titulo:
                "Diencéfalo — Vista Posterior 01",

            imagem:
                "imagens/DiencefaloPosterior.webp",

            estruturas:
                mapaDiencefaloPosterior

        }
    );

}

else {

    console.warn(
        "⚠️ mapaDiencefaloPosterior não foi carregado."
    );

}


// ======================================================
// TELENCÉFALO — VISTA SUPERIOR
// ======================================================

if (
    typeof mapaCadaverTelencefaloSuperior !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "cadaver-telencefalo-vista-superior",

            topico:
                "telencefalo",

            titulo:
                "Telencéfalo — Vista Superior",

            imagem:
                "imagens/TelencefaloVistaSuperiorCadaver.webp",

            estruturas:
                mapaCadaverTelencefaloSuperior

        }
    );

}

else {

    console.warn(
        "⚠️ mapaCadaverTelencefaloSuperior não foi carregado."
    );

}


// ======================================================
// TELENCÉFALO — GIROS INFERIORES
// ======================================================

if (
    typeof mapaTelencefaloGiroInferior01 !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "telencefalo-giros-inferiores-01",

            topico:
                "telencefalo",

            titulo:
                "Telencéfalo — Giros Inferiores 01",

            imagem:
                "imagens/TelencefaloGirosInferiores.webp",

            estruturas:
                mapaTelencefaloGiroInferior01

        }
    );

}

else {

    console.warn(
        "⚠️ mapaTelencefaloGiroInferior01 não foi carregado."
    );

}


// ======================================================
// TELENCÉFALO — VISÃO INFERIOR
// ======================================================

if (
    typeof mapaCadaverTelencefaloInferior !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "telencefalo-visao-inferior",

            topico:
                "telencefalo",

            titulo:
                "Telencéfalo — Visão Inferior",

            imagem:
                "imagens/TelencefaloCadaverVisaoInferiores.webp",

            estruturas:
                mapaCadaverTelencefaloInferior

        }
    );

}

else {

    console.warn(
        "⚠️ mapaCadaverTelencefaloInferior não foi carregado."
    );

}


// ======================================================
// TELENCÉFALO E VIAS OPTICAS 
//
// Este mapa utiliza a foto:
// CadaverTelencefaloeViasOpticasTrasnversal.webp
// ======================================================

if (
    typeof mapaCadaverTelencefaloViasOpticasTrasnversal !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "telencefaloviaspticas",

            topico:
                "telencefalo",

            titulo:
                "Telencefalo e Vias Ópticas",

            imagem:
                "imagens/CadaverTelencefaloeViasOpticasTransversal.webp",

            estruturas:
                mapaCadaverTelencefaloViasOpticasTrasnversal

        }
    );

}

else {

    console.warn(
        "⚠️ mapaCadaverTelencefaloLateral02 não foi carregado."
    );

}


// ======================================================
// TELENCÉFALO — GIROS LATERAIS 02
//
// USA A MESMA FOTO DO MAPA ACIMA,
// MAS POSSUI OUTRO CONJUNTO DE HOTSPOTS.
// ======================================================

if (
    typeof CadaverTelencefaloLateralGiros !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "telencefalo-giros-lateral-02",

            topico:
                "telencefalo",

            titulo:
                "Telencéfalo — Giros 02",

            imagem:
                "imagens/CadaverTelencefaloLateral02.webp",

            estruturas:
                CadaverTelencefaloLateralGiros

        }
    );

}

else {

    console.warn(
        "⚠️ CadaverTelencefaloLateralGiros não foi carregado."
    );

}


// ======================================================
// CADÁVER — TELENCÉFALO LATERAL
//
// Aceita os dois nomes utilizados durante
// o desenvolvimento do NeuroGame:
//
// mapaCadaverSulcosTelencefaloLateral
//
// ou
//
// mapaCadaverTelencefaloLateral
// ======================================================





// ======================================================
// VERIFICAÇÃO FINAL
// ======================================================

console.log(
    "===================================="
);


console.log(
    "🧠 Catálogo NeuroGame carregado"
);


console.log(
    "Quantidade de mapas:",
    catalogoMapas.length
);


console.table(
    catalogoMapas.map(
        function(mapa) {

            return {

                id:
                    mapa.id,

                topico:
                    mapa.topico,

                titulo:
                    mapa.titulo,

                estruturas:
                    mapa.estruturas.length,

                imagem:
                    mapa.imagem

            };

        }
    )
);


console.log(
    "===================================="
);