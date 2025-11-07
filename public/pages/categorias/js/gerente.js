
// Função para calcular o Bônus de Incentivo
function calcularIncentivo() {
    // Pesos definidos na sua Interface de Função
    const PESO_PROJETO = 0.40; // 40%
    const PESO_ESTAGIARIOS = 0.40; // 40%
    const PESO_CERTIFICACAO = 0.20; // 20%

    // Coleta os valores de entrada
    const sucessoProjeto = parseFloat(document.getElementById('sucessoProjeto').value) || 0;
    const desenvolvimentoEstagiarios = parseFloat(document.getElementById('desenvolvimentoEstagiarios').value) || 0;
    const preparacaoCertificacao = parseFloat(document.getElementById('preparacaoCertificacao').value) || 0;

    // Calcula a pontuação ponderada
    const pontuacaoPonderada =
        (sucessoProjeto * PESO_PROJETO) +
        (desenvolvimentoEstagiarios * PESO_ESTAGIARIOS) +
        (preparacaoCertificacao * PESO_CERTIFICACAO);

    // Formata o resultado
    const resultadoFormatado = pontuacaoPonderada.toFixed(1) + '%';

    // Atualiza o HTML com a pontuação final
    const pontuacaoElement = document.getElementById('pontuacaoFinal');
    pontuacaoElement.textContent = resultadoFormatado;

    // Lógica para o Status
    const statusElement = document.getElementById('statusIncentivo');
    pontuacaoElement.classList.remove('status-verde', 'status-amarelo', 'status-vermelho');
    statusElement.classList.remove('status-verde', 'status-amarelo', 'status-vermelho');

    let statusTexto = "";

    if (pontuacaoPonderada >= 90) {
        statusTexto = "Excelente! Bônus Máximo Esperado.";
        pontuacaoElement.classList.add('status-verde');
        statusElement.classList.add('status-verde');
    } else if (pontuacaoPonderada >= 70) {
        statusTexto = "Bom. Bônus Satisfatório.";
        pontuacaoElement.classList.add('status-amarelo');
        statusElement.classList.add('status-amarelo');
    } else {
        statusTexto = "Abaixo da Meta. Revisar Ações Corretivas.";
        pontuacaoElement.classList.add('status-vermelho');
        statusElement.classList.add('status-vermelho');
    }

    statusElement.textContent = statusTexto;
}

// Executa o cálculo inicial ao carregar a página
document.addEventListener('DOMContentLoaded', calcularIncentivo);
