function esconderLoading() {

    const tela =
        document.getElementById(
            "telaCarregamento"
        );

    if (
        !tela
    ) {

        return;

    }

    tela.classList.add(
        "oculta"
    );

    setTimeout(
        function() {

            tela.remove();

        },
        400
    );

}