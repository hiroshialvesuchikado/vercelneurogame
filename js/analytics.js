// ======================================================
// ANALYTICS — NEUROGAME
// ======================================================


// ======================================================
// 1. ID ANÔNIMO DO USUÁRIO
// ======================================================

function obterIdUsuario() {

    let idUsuario =
        localStorage.getItem(
            "neurogame_usuario"
        );


    if (!idUsuario) {

        idUsuario =
            crypto.randomUUID();


        localStorage.setItem(
            "neurogame_usuario",
            idUsuario
        );

    }


    return idUsuario;
}


// ======================================================
// 2. NÚMERO DA SESSÃO
// ======================================================

function obterNumeroSessao() {

    let numeroSessao =
        localStorage.getItem(
            "neurogame_numero_sessao"
        );


    if (!numeroSessao) {

        numeroSessao = 1;

    }

    else {

        numeroSessao =
            parseInt(
                numeroSessao
            ) + 1;

    }


    localStorage.setItem(
        "neurogame_numero_sessao",
        numeroSessao
    );


    return numeroSessao;
}


// ======================================================
// 3. IDENTIFICAÇÃO
// ======================================================

const idUsuario =
    obterIdUsuario();


const numeroSessao =
    obterNumeroSessao();


// UUID técnico da sessão
const idSessao =
    crypto.randomUUID();


console.log(
    "👤 Usuário NeuroGame:",
    idUsuario
);


console.log(
    "🔢 Sessão:",
    numeroSessao
);


console.log(
    "🎮 ID da sessão:",
    idSessao
);


// ======================================================
// 4. REGISTRAR RESPOSTA
// ======================================================

function registrarResposta({

    mapa,
    modo,
    estruturaId,
    estruturaNome,
    resposta,
    acertou,
    tentativas,
    tempoResposta,
    pontos

}) {

    const registro = {

        usuario_id:
            idUsuario,

        sessao:
            numeroSessao,

        sessao_id:
            idSessao,

        mapa:
            mapa,

        modo:
            modo,

        estrutura_id:
            estruturaId,

        estrutura_nome:
            estruturaNome,

        resposta:
            resposta,

        acertou:
            acertou,

        tentativas:
            tentativas,

        tempo_ms:
            Math.round(
                tempoResposta
            ),

        pontos:
            pontos,

        data:
            new Date()
                .toISOString()

    };


    console.log(
        "📊 Registro analytics:",
        registro
    );


    mostrarRegistroAnalytics(
        registro
    );


    return registro;
}


// ======================================================
// 5. MOSTRAR REGISTRO NA TELA
// ======================================================

function mostrarRegistroAnalytics(
    registro
) {

    const lista =
        document.getElementById(
            "listaAnalytics"
        );


    if (!lista) {

        console.warn(
            "Painel de analytics não encontrado."
        );

        return;

    }


    // Remove "Nenhum registro ainda."
    const mensagemInicial =
        document.getElementById(
            "mensagemAnalytics"
        );


    if (mensagemInicial) {

        mensagemInicial.remove();

    }


    const bloco =
        document.createElement(
            "div"
        );


    bloco.classList.add(
        "registro-analytics"
    );


    if (registro.acertou) {

        bloco.classList.add(
            "acerto"
        );

    }

    else {

        bloco.classList.add(
            "erro"
        );

    }


    const tempoSegundos =
        (
            registro.tempo_ms /
            1000
        ).toFixed(2);


    const dataFormatada =
        new Date(
            registro.data
        ).toLocaleString(
            "pt-BR"
        );


    bloco.innerHTML = `

        <div>
            <strong>👤 Usuário:</strong>
            ${registro.usuario_id}
        </div>

        <div>
            <strong>🔢 Sessão:</strong>
            ${registro.sessao}
        </div>

        <div>
            <strong>🎮 ID da sessão:</strong>
            ${registro.sessao_id}
        </div>

        <div>
            <strong>🗺️ Mapa:</strong>
            ${registro.mapa}
        </div>

        <div>
            <strong>🎯 Modo:</strong>
            ${registro.modo}
        </div>

        <div>
            <strong>🧠 Estrutura perguntada:</strong>
            ${registro.estrutura_nome}
        </div>

        <div>
            <strong>👉 Resposta:</strong>
            ${registro.resposta}
        </div>

        <div>
            <strong>Resultado:</strong>
            ${
                registro.acertou
                    ? "✅ Acerto"
                    : "❌ Erro"
            }
        </div>

        <div>
            <strong>🔁 Tentativa:</strong>
            ${registro.tentativas}
        </div>

        <div>
            <strong>⏱️ Tempo:</strong>
            ${tempoSegundos} s
        </div>

        <div>
            <strong>⭐ Pontos:</strong>
            ${registro.pontos}
        </div>

        <div>
            <strong>📅 Data:</strong>
            ${dataFormatada}
        </div>

    `;


    lista.prepend(
        bloco
    );

}