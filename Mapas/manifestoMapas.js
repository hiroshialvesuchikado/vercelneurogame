// ======================================================
// MANIFESTO CENTRAL DE MAPAS — NEUROGAME
//
// Para adicionar um novo mapa futuramente,
// cadastre-o SOMENTE aqui.
// ======================================================

window.definicoesMapas = [

    // ==================================================
    // TELENCÉFALO — VISTA LATERAL
    // ==================================================

    {
        id:
            "telencefalo-lateral",

        topico:
            "telencefalo",

        titulo:
            "Telencéfalo — Vista Lateral",

        imagem:
            "imagens/PalcoTelencefalo.webp",

        arquivo:
            "Mapas/mapaPalcoTelencefalo.js",

        obterEstruturas:
            function() {

                return mapaTelencefaloLateral;

            }
    },


    // ==================================================
    // TELENCÉFALO — VISTA MEDIAL
    // ==================================================

    {
        id:
            "telencefalo-medial",

        topico:
            "telencefalo",

        titulo:
            "Telencéfalo — Vista Medial",

        imagem:
            "imagens/PalcoTelencefaloMedial.webp",

        arquivo:
            "Mapas/mapaPalcoTelencefaloMedial.js",

        obterEstruturas:
            function() {

                return mapaTelencefaloMedial;

            }
    },


    // ==================================================
    // CADÁVER — TELENCÉFALO LATERAL
    // ==================================================

    {
        id:
            "cadavertelencefalo-lateral",

        topico:
            "telencefalo",

        titulo:
            "Telencéfalo — Vista Lateral",

        imagem:
            "imagens/CadaverTelencefaloLateral.webp",

        arquivo:
            "Mapas/mapaCadaverSulcosTelencefaloLateral.js",

        obterEstruturas:
            function() {

                return mapaCadaverTelencefaloLateral;

            }
    },


    // ==================================================
    // CADÁVER — TELENCÉFALO MEDIAL
    // ==================================================

    {
        id:
            "cadavertelencefalo-medial",

        topico:
            "telencefalo",

        titulo:
            "Telencéfalo — Vista Medial",

        imagem:
            "imagens/TelencefaloMedial.webp",

        arquivo:
            "Mapas/mapaTelencefaloMedial.js",

        obterEstruturas:
            function() {

                return mapaCadaverTelencefaloMedial;

            }
    },

    // ==================================================
    // CADÁVER — TELENCÉFALO MEDIAL
    // ==================================================

    {
        id:
            "telencefalo-lobo-insular",

        topico:
            "telencefalo",

        titulo:
            "Telencéfalo — Vista Lobo Insular",

        imagem:
            "imagens/LoboInsular.webp",

        arquivo:
            "Mapas/mapaLoboInsular.js",

        obterEstruturas:
            function() {

                return mapaLoboInsular;

            }
    },

        // ==================================================
    // CADÁVER — TELENCÉFALO BOLACHA 01
    // ==================================================

            {

            id:
                "telencefalo-bolacha01",

                        topico:
            "telencefalo",

            titulo:
                "Telencéfalo — Vista transversal 01",

            imagem:
                "imagens/TelencefaloBolacha01.webp",
            
            arquivo:
                "Mapas/mapaTelencefaloBolacha01.js",

                        obterEstruturas:
            function() {

                return  mapaTelencefaloBolacha01;

            }

        },


                // ==================================================
    // CADÁVER — TELENCÉFALO BOLACHA 02
    // ==================================================

            {

            id:
                "telencefalo-bolacha02",

                        topico:
            "telencefalo",

            titulo:
                "Telencéfalo — Vista Coronal 02",

            imagem:
                "imagens/TelencefaloBolacha02.webp",
            
            arquivo:
                "Mapas/mapaTelencefaloBolacha02.js",

                        obterEstruturas:
            function() {

                return  mapaTelencefaloBolacha02;

            }

        },

        
                // ==================================================
    // CADÁVER — TELENCÉFALO BOLACHA 03
    // ==================================================

            {

            id:
                "telencefalo-bolacha03",

                        topico:
            "telencefalo",

            titulo:
                "Telencéfalo — Vista Coronal 03",

            imagem:
                "imagens/TelencefaloBolacha03.webp",
            
            arquivo:
                "Mapas/mapaTelencefaloBolacha03.js",

                        obterEstruturas:
            function() {

                return  mapaTelencefaloBolacha03;

            }

        },



    // ==================================================
    // CADÁVER — DIENCÉFALO 01
    // ==================================================

            {
                

            id:
            "diencefalo-01",

            topico:
            "diencefalo",

            titulo:
            "Diencéfalo e Tálamo — Vista Lateral 01",

            imagem:
                "imagens/Diencefalo01.webp",
            
            arquivo:
                "Mapas/mapaCadaverDiencefalo01.js",

                        obterEstruturas:
            function() {

                return  mapaCadaverDiencefalo01;

            }

        },



// ==================================================
    // CADÁVER — DIENCÉFALO POSTERIOR
    // ==================================================

            {
                

            id:
            "diencefalopsoterior-01",

            topico:
            "diencefalo",

            titulo:
            "Diencéfalo— Vista Posterior 01",

            imagem:
                "imagens/DiencefaloPosterior.webp",
            
            arquivo:
                "Mapas/mapaDiencefaloPosterior.js",

                        obterEstruturas:
            function() {

                return  mapaDiencefaloPosterior;

            }

        },


    // ==================================================
    // CADÁVER — TELENCÉFALO SUPERIOR
    // ==================================================

            {

            id:
                "Cadavertelencefalo-vistasuperior",

                        topico:
            "telencefalo",

            titulo:
                "Telencéfalo — Vista Superior",

            imagem:
                "imagens/TelencefaloVistaSuperiorCadaver.webp",
            
            arquivo:
                "Mapas/mapaCadaverTelencefaloVistaSuperior.js",

                        obterEstruturas:
            function() {

                return  mapaCadaverTelencefaloSuperior;

            }

        },



];