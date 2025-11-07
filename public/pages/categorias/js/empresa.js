document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById("contactModal");
    var btn = document.getElementById("openModal");
    var span = document.getElementsByClassName("close-btn")[0];


    var form = document.getElementById("projectForm");
    var formContainer = document.getElementById("form-container");
    var feedbackMessage = document.getElementById("form-feedback");

    var emailInput = form.querySelector('input[type="email"]');

    // NOVO: Referência ao local onde o e-mail será exibido
    var emailDisplay = document.getElementById("feedback-email-display");

    // Abrir o modal
    btn.onclick = function (e) {
        e.preventDefault();
        modal.style.display = "block";

        formContainer.style.display = "block";
        feedbackMessage.style.display = "none";

    }

    // Fechar o modal clicando no X
    span.onclick = function () {
        modal.style.display = "none";
    }

    // Fechar o modal clicando fora dele
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }



    // 4. Lidar com o envio do formulário
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // IMPEDE O RECARREGAMENTO DA PÁGINA
        var submittedEmail = emailInput.value;
        // --- SIMULAÇÃO DE ENVIO DE DADOS (Substitua por uma requisição AJAX/fetch real) ---

        // Aqui você enviaria os dados do formulário para o seu servidor.
        // Ex: fetch('/api/submit-project', { method: 'POST', body: new FormData(form) }).then(response => { ... })

        // Simulação de delay de envio (opcional, para efeito visual)
        setTimeout(() => {
            emailDisplay.textContent = submittedEmail;
            // Oculta o formulário
            formContainer.style.display = "none";

            // Exibe a mensagem de feedback
            feedbackMessage.style.display = "block";

            // Limpa o formulário (opcional)
            form.reset();

        }, 500); // 0.5 segundo de delay simulado
    });
});