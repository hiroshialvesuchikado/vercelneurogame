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
            "Mapa não registrado:",
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
            "Mapa duplicado ignorado:",
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
// CADÁVER — TELENCÉFALO LOBO INSULAR
// ======================================================
if (
    typeof mapaLoboInsular !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "telencefalo-lobo-insular",

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
// CADÁVER — Bolacha 01
// ======================================================
if (
    typeof mapaTelencefaloBolacha01 !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "telencefalo-bolacha01",

            titulo:
                "Telencéfalo — Vista transversal 01",

            imagem:
                "imagens/TelencefaloBolacha01.webp",

            estruturas:
                mapaTelencefaloBolacha01,

        }
    );
}


// ======================================================
// CADÁVER — Bolacha 02
// ======================================================
if (
    typeof mapaTelencefaloBolacha02 !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "telencefalo-bolacha02",

            titulo:
                "Telencéfalo — Vista transversal 02",

            imagem:
                "imagens/TelencefaloBolacha02.webp",

            estruturas:
                mapaTelencefaloBolacha02,

        }
    );
}

    // ======================================================
// CADÁVER — TELENCEFALO VISTA SUPERIOR
// ======================================================
if (
    typeof mapaCadaverTelencefaloSuperior !==
    "undefined"
) {

    registrarMapa(
        {

            id:
                "Cadavertelencefalo-vistasuperior",


            titulo:
                "Telencéfalo — Vista Superior",

            imagem:
                "imagens/TelencefaloVistaSuperiorCadaver.webp",
            
            estruturas:
                mapaCadaverTelencefaloSuperior,

        }
    );

}

else {

    console.warn(
        "⚠️ mapaLoboInsular não foi carregado."
    );

}



// ======================================================
// CADÁVER — TELENCÉFALO LATERAL
// ======================================================
//
// Esta parte aceita os DOIS nomes que apareceram
// durante o desenvolvimento do NeuroGame:
//
// mapaCadaverSulcosTelencefaloLateral
//
// ou
//
// mapaCadaverTelencefaloLateral
//
// Assim você não quebra o projeto enquanto organiza
// seus arquivos.
// ======================================================

let estruturasCadaverLateral =
    null;


if (
    typeof mapaCadaverSulcosTelencefaloLateral !==
    "undefined"
) {

    estruturasCadaverLateral =
        mapaCadaverSulcosTelencefaloLateral;

}

else if (
    typeof mapaCadaverTelencefaloLateral !==
    "undefined"
) {

    estruturasCadaverLateral =
        mapaCadaverTelencefaloLateral;

}


if (
    estruturasCadaverLateral
) {

    registrarMapa(
        {

            id:
                "cadavertelencefalo-lateral",

            titulo:
                "Sulcos Telencéfalo — Vista Lateral",

            imagem:
                "imagens/CadaverTelencefaloLateral.webp",

            estruturas:
                estruturasCadaverLateral

        }
    );

}

else {

    console.warn(
        "⚠️ Mapa do cadáver lateral não foi carregado."
    );

}


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