const loginOverlay = document.getElementById('loginOverlay');
const openButton = document.getElementById('openLoginButton');
const closeButton = document.getElementById('closeLoginButton');

// Função para mostrar o modal
function openModal() {
    loginOverlay.classList.add('visible');
    // Opcional: Impedir a rolagem do body quando o modal estiver aberto
    document.body.style.overflow = 'hidden';
}

// Função para esconder o modal
function closeModal() {
    loginOverlay.classList.remove('visible');
    document.body.style.overflow = 'auto';
}

// 1. Abre o modal ao clicar no botão "Entrar" no menu
openButton.addEventListener('click', function (event) {
    event.preventDefault(); // Impede que o link tente carregar pages/login.html
    openModal();
});

// 2. Fecha o modal ao clicar no 'X'
closeButton.addEventListener('click', closeModal);

// 3. Opcional: Fecha clicando fora do card
loginOverlay.addEventListener('click', function (event) {
    // Se o clique for no overlay (na área escura) e não dentro do card, feche
    if (event.target === loginOverlay) {
        closeModal();
    }
});

// função que vai altenar a visibilidade da senha.
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword');

    // Verifica o tipo atual do input
    if (passwordInput.type === 'password') {
        // Se for 'password' (****), muda para 'text' (visível)
        passwordInput.type = 'text';
        // A senha está VISÍVEL, o ícone sugere OCULTAR
        toggleIcon.textContent = '🙉'; // Macaco tapando as orelhas
    } else {
        // Se for 'text' (visível), muda para 'password' (****)
        passwordInput.type = 'password';
        // A senha está OCULTA, o ícone sugere MOSTRAR
        toggleIcon.textContent = '🙈'; // Macaco tapando os olhos (estado original)
    }
}

//  Garantir que o ícone do macaco apareça ao carregar a página
document.getElementById('togglePassword').textContent = '🙈';

//inicio do comtrole de campos do modal 
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona as áreas da interface
    const profileSelectionArea = document.getElementById('profile-selection');
    const loginFormArea = document.getElementById('login-form');

    // Seleciona os cards de perfil e o botão de login
    const profileCards = document.querySelectorAll('.profile-card');
    const loginButton = document.getElementById('login-button');

    // Mapeamento de textos para cada perfil
    const texts = {
        aluno: {
            title: "Acesso do Aluno",
            subtitle: "Use seu RA (Registro de Aluno) ou e-mail institucional.",
            button: "ENTRAR COMO ALUNO"
        },
        gerente: {
            title: "Acesso do gerente",
            subtitle: "Use sua matrícula funcional ou e-mail.",
            button: "ENTRAR COMO GERENTE"
        },
        empresa: {
            title: "Acesso da empresa",
            subtitle: "Use seu usuario ou e-mail.",
            button: "ENTRAR COMO EMPRESA"
        }
    };

    // Função para lidar com o clique nos cards
    profileCards.forEach(card => {
        card.addEventListener('click', () => {
            const profileType = card.getAttribute('data-profile');
            showLoginForm(profileType);
        });
    });

    // Função que faz a transição para o formulário
    function showLoginForm(profileType) {
        // 1. Esconde a tela de seleção
        profileSelectionArea.classList.remove('active');

        // 2. Espera a animação de saída e mostra a tela de login
        setTimeout(() => {
            // Personaliza o formulário
            document.getElementById('login-title').textContent = texts[profileType].title;
            document.getElementById('login-subtitle').textContent = texts[profileType].subtitle;
            loginButton.textContent = texts[profileType].button;
            loginButton.setAttribute('data-profile', profileType); // Armazena o perfil

            // Exibe a tela de login
            loginFormArea.classList.add('active');
        }, 300); // 300ms é o tempo da animação de transição no CSS
    }

    // Função de reset (voltar para a tela de escolha)
    window.resetPage = function () {
        // 1. Esconde o formulário
        loginFormArea.classList.remove('active');

        // 2. Limpa os campos e exibe a tela de seleção
        setTimeout(() => {
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            profileSelectionArea.classList.add('active');
        }, 300);
    }

    /////////////////////////////////////////////////////////////////////////////

    ///esse listener faz com que o usuaio seja direcionado para o seu perfil, guardando o valor do perfil em uma variavel...
    // 1. Adiciona um listener para cada cartão de perfil
    document.querySelectorAll('.profile-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const profile = card.getAttribute('data-profile');
            localStorage.setItem('selectedProfile', profile);
            console.log(`Perfil '${profile}' armazenado. Pronto para o login.`);
        });
    });

    /* Adiciona o evento de submissão do formulário (listener no FORM)*/
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const profile = localStorage.getItem('selectedProfile'); // O perfil selecionado
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (email && password && profile) {
            try {
                // AGORA FAZ UMA CHAMADA POST PARA A ROTA DO SEU BACKEND (arquivo 2)
                const response = await fetch('/alunos/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // Envia email, senha e o perfil esperado para o backend verificar
                    body: JSON.stringify({ email, senha: password, profile })
                });

                const data = await response.json();

                // O backend (arquivo 2) retorna response.ok=false em caso de falha de credenciais (401) ou perfil (403)
                if (!response.ok || !data.success) {
                    alert(data.message || 'Credenciais ou perfil inválidos.');
                    console.error('Erro no login (retorno do servidor):', data.message);
                    return;
                }

                // O login foi bem-sucedido e o perfil foi validado pelo backend
                const userRole = data.role;
                alert(`Login efetuado com sucesso! Perfil: ${userRole.toUpperCase()}`);

                let targetPage = 'erro.html';

                // Redireciona com base na role VERIFICADA pelo backend
                if (userRole === 'aluno') targetPage = '/portalAluno.html';
                else if (userRole === 'empresa') targetPage = '/pages/categorias/empresa.html';
                else if (userRole === 'gerente') targetPage = '/pages/categorias/gerente.html';

                window.location.href = targetPage;

            } catch (err) {


                // LOGUE O ERRO COMPLETO para ver o que realmente falhou
                console.error('*** ERRO CRÍTICO NA ROTA /alunos/login ***');
                console.error(err); // Isto mostrará o objeto de erro completo
                console.error('********************************************');





                // Este catch é ativado apenas se houver um erro de rede ou o servidor Node.js (com o arquivo 2) estiver offline
                console.error('Erro de conexão ou servidor inacessível:', err.message, err.stack);
                alert('Erro de conexão com o servidor. Verifique se o backend está rodando.');
            }
        } else {
            alert('Por favor, preencha todos os campos E selecione um perfil.');
        }
    });

    // aqui acaba a verificação dos campos onde o loginredireciona /

    /////////////////////////////////////////////////////////////////////////////////*/
    // Listener para o formulário de login



    // Inicializa a página mostrando a primeira fase
    profileSelectionArea.classList.add('active');
});

let currentProfile = ''; // Variável para armazenar o perfil selecionado
document.querySelectorAll('.profile-card').forEach(card => {
    card.addEventListener('click', (event) => {
        // Encontra o elemento de cartão, mesmo se o clique for no ícone ou h2
        const profileCard = event.currentTarget;
        currentProfile = profileCard.getAttribute('data-profile');

        // Lógica de Transição de Tela e Ocultação/Exibição de Campos
        if (currentProfile === 'empresa') {
            // Se for empresa, vai para a tela do CNPJ
            showScreen('cnpj-screen');
        } else {
            // Se for Aluno ou Professor/Gerente, ignora a tela de CNPJ e vai direto para Dados Pessoais
            showScreen('personal-data-screen');
        }

        // Esconde a tela de seleção de perfil
        document.getElementById('profile-selection').classList.remove('active');

        console.log(`Perfil selecionado: ${currentProfile}`);
    });
});

// Função de exemplo para mostrar a próxima tela (adapte à sua lógica de navegação)

function showScreen() {
    // tenta obter o elemento
    const screenEl = document.getElementById("loginOverlay");

    // verifica se o elemento existe antes de manipular
    if (screenEl && screenEl.parentElement) {
        screenEl.classList.add("ativo");
    } else {
        console.warn("Elemento #loginOverlay não encontrado no DOM.");
    }
}




