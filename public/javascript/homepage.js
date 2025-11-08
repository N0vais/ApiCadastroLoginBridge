document.addEventListener('DOMContentLoaded', () => {

    //variaveis do sub menu
    const btnCategorias = document.getElementById('btn-categorias');
    const menuItemComSubmenu = document.querySelector('.menu-item-com-submenu');

    const cards = document.querySelectorAll('.role-card');

    const botao = document.getElementById('btnSaibaMais');
    const botaoGerente = document.getElementById('saibaMaisGerente');

    // Medida de segurança: Garante que o menu comece escondido
    menuItemComSubmenu.classList.remove('ativo');

    btnCategorias.addEventListener('click', function (event) {
        event.preventDefault();
        menuItemComSubmenu.classList.toggle('ativo');
    });

    // Fechar ao clicar fora
    document.addEventListener('click', function (event) {
        if (!menuItemComSubmenu.contains(event.target)) {
            menuItemComSubmenu.classList.remove('ativo');
        }
    });

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Obtém as coordenadas do mouse em relação ao card
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Define um brilho sutil com gradiente radial
            card.style.background = `
                radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.1), transparent)
            `;
            card.style.boxShadow = `
                0 15px 40px rgba(0, 0, 0, 0.15),
                0 0 0 3px rgba(0, 123, 255, 0.2) inset
            `;
        });

        card.addEventListener('mouseleave', () => {
            // Remove o efeito ao tirar o mouse
            card.style.background = '#ffffff';
            card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
        });
    });

    botao.addEventListener('click', function () {
        // 3. Executa o redirecionamento quando o botão é clicado
        window.location.href = "/pages/categorias/saibaMaisEmpresa.html";
    });

    botaoGerente.addEventListener('click', function () {
        // 3. Executa o redirecionamento quando o botão é clicado
        window.location.href = "/pages/categorias/saibaMaisGerente.html";
    });

});
