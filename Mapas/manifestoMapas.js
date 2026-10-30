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

    // ==================================================
    // CADÁVER — TELENCÉFALO GIRO INFERIOR
    // ==================================================

            {

            id:
                "telencefaloInferior-01",

                        topico:
            "telencefalo",

            titulo:
                "Telencefalo Giros Inferiores 01",

            imagem:
                "imagens/TelencefaloGirosInferiores.webp",
            
            arquivo:
                "Mapas/mapaTelencefaloGiroInferior.js",

                        obterEstruturas:
            function() {

                return  mapaTelencefaloGiroInferior01;

            }

        },
            

    // ==================================================
    // CADÁVER — TELENCÉFALO VISÃO INFERIOR
    // ==================================================

            {

            id:
                "telencefaloGiorInferior-01",

                        topico:
            "telencefalo",

            titulo:
                "Telencefalo Visão Inferior",

            imagem:
                "imagens/TelencefaloCadaverVisaoInferior.webp",
            
            arquivo:
                "Mapas/mapaCadaverTelencefaloVistaInferior.js",

                        obterEstruturas:
            function() {

                return  mapaCadaverTelencefaloInferior;

            }

        },
            

    // ==================================================
    // CADÁVER — TELENCÉFALO lateral 02
    // ==================================================

            {

            id:
                "telencefaloLateral-02",

                        topico:
            "telencefalo",

            titulo:
                "Telencefalo Lateral 02",

            imagem:
                "imagens/CadaverTelencefaloLateral02.webp",
            
            arquivo:
                "Mapas/mapaCadaverTelencefaloLateral02.js",

                        obterEstruturas:
            function() {

                return  mapaCadaverTelencefaloLateral02;

            }

        },


        
        // ==================================================
    // CADÁVER — TELENCÉFALO e VIASOPTICAS
    // ==================================================

            {

            id:
                "telencefaloviaspticas",

                        topico:
            "telencefalo",

            titulo:
                "Telencefalo e Vias Ópticas",

            imagem:
                "imagens/CadaverTelencefaloeViasOpticasTransversal.webp",
            
            arquivo:
                "Mapas/mapaCadaverTelencefaloViasOpticasTransversal.js",

                        obterEstruturas:
            function() {

                return mapaCadaverTelencefaloViasOpticasTrasnversal;
            }

        },



    // ==================================================
    // CEREBELO - SAGITAL MEDIANO
    // ==================================================

            {

            id:
                "cerebelo-sagital-mediano",

                        topico:
            "cerebelo",

            titulo:
                "Cerebelo — Sagital Mediano",

            imagem:
                "imagens/CerebeloSagitalMediano.webp",
            
            arquivo:
                "Mapas/mapaCerebeloSagitalMediano.js",

                        obterEstruturas:
            function() {

                return mapaCerebeloSagitalMediano;
            }

        },
            // ==================================================
    // CEREBELO - SAGITAL MEDIANO FISSURAS
    // ==================================================

            {

            id:
                "cerebelo-sagital-mediano-fissuras",

            topico:
            "cerebelo",

            titulo:
                "Cerebelo — Fissuras Sagital Mediano",

            imagem:
                "imagens/CerebeloSagitalMediano.webp",
            
            arquivo:
                "Mapas/mapaCerebeloFissuraAtlas.js",

                        obterEstruturas:
            function() {

                return mapaCerebeloFissuraAtlas;
            }

        },

                 // ==================================================
    // CEREBELO - Vista Inferior
    // ==================================================

            {

            id:
                "cerebelo-vista-inferior",

            topico:
            "cerebelo",

            titulo:
                "Cerebelo — Vista Inferior",

            imagem:
                "imagens/CerebeloVistaInferior.webp",
            
            arquivo:
                "Mapas/mapaCerebeloVistaInferior.js",

                        obterEstruturas:
            function() {

                return mapaCerebeloVistaInferior;
            }

        },


                      // ==================================================
    // CEREBELO - Vista Superior
    // ==================================================

            {

            id:
                "cerebelo-vista-superior",

            topico:
            "cerebelo",

            titulo:
                "Cerebelo — Vista Superior",

            imagem:
                "imagens/CerebeloVistaSuperior.webp",
            
            arquivo:
                "Mapas/mapaCerebeloVistaSuperior.js",

                        obterEstruturas:
            function() {

                return mapaCerebeloVistaSuperior;
            }

        },


                              // ==================================================
    // CEREBELO - Vista Anterior
    // ==================================================

            {

            id:
                "cerebelo-vista-anterior",

            topico:
            "cerebelo",

            titulo:
                "Cerebelo — Vista Anterior",

            imagem:
                "imagens/CerebeloVistaAnterior.webp",
            
            arquivo:
                "Mapas/mapaCerebeloVistaAnterior.js",

                        obterEstruturas:
            function() {

                return mapaCerebeloVistaAnterior;
            }

        },


    // ==================================================
    // CEREBELO - Plano Transversal
    // ==================================================

            {

            id:
                "cerebelo-plano-transversal",

            topico:
            "cerebelo",

            titulo:
                "Cerebelo — Plano Transversal",

            imagem:
                "imagens/CerebeloPlanoTransversal.webp",
            
            arquivo:
                "Mapas/mapaCerebeloPlanoTransversal.js",

                        obterEstruturas:
            function() {

                return mapaCerebeloPlanoTransversal;
            }

        },

        // ==================================================
    // Tronco Encefálico - Vista Frontal
    // ==================================================

            {

            id:
                "tronco-vista-frontal",

            topico:
            "tronco",

            titulo:
                "Tronco — Vista Frontal",

            imagem:
                "imagens/TroncoVistaFrontal.webp",
            
            arquivo:
                "Mapas/mapaTroncoVistaFrontal.js",

                        obterEstruturas:
            function() {

                return mapaTroncoVistaFrontal;
            }

        },

            // ==================================================
    // Bulbo - Visão Obliqua Inferior
    // ==================================================

            {

            id:
                "tronco-bulbo-vista-obliqua-inferior",

            topico:
            "tronco",

            titulo:
                "Bulbo — Vista Anterior Obliqua Inferior",

            imagem:
                "imagens/BulboVisaoObliquaInferior.webp",
            
            arquivo:
                "Mapas/mapaBulboVisaoObliquaInferior.js",

                        obterEstruturas:
            function() {

                return mapaBulboVisaoObliquaInferior;
            }

        },
];