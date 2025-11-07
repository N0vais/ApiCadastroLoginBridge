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
openButton.addEventListener('click', function(event) {
    event.preventDefault(); // Impede que o link tente carregar pages/login.html
    openModal();
});

// 2. Fecha o modal ao clicar no 'X'
closeButton.addEventListener('click', closeModal);

// 3. Opcional: Fecha clicando fora do card
loginOverlay.addEventListener('click', function(event) {
    // Se o clique for no overlay (na área escura) e não dentro do card, feche
    if (event.target === loginOverlay) {
        closeModal();
    }
});

// testar novamente esta função para ver se realmente sera utilizada
//esta função ira mostra outro modal afirmando que voce escolheu
const profileCards = document.querySelectorAll('.profile-card');
profileCards.forEach(card => {
    card.addEventListener('click', function() {
        const profile = this.getAttribute('data-profile');
        alert(`Você escolheu o perfil: ${profile}. Implemente a navegação ou formulário de login aqui!`);
        
        // 1. Fechar o modal e redirecionar: window.location.href = `/login?perfil=${profile}`; 
    });
    
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

// **NOVO PASSO:** Garantir que o ícone do macaco apareça ao carregar a página
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
    window.resetPage = function() {
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

// Adiciona o evento de submissão do formulário (listener no FORM)
document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const profile = localStorage.getItem('selectedProfile');
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (email && password && profile) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          alert('Login inválido. Verifique suas credenciais.');
          console.error(error);
          return;
        }

        alert(`Login efetuado com sucesso! Perfil: ${profile.toUpperCase()}`);

        let targetPage = 'erro.html';
        if (profile === 'aluno') targetPage = '/pages/categorias/aluno.html';
        else if (profile === 'empresa') targetPage = '/pages/categorias/empresa.html';
        else if (profile === 'gerente') targetPage = '/pages/categorias/gerente.html';

        window.location.href = targetPage;
      } catch (err) {
        console.error('Erro ao conectar com Supabase:', err);
        alert('Erro de conexão com o servidor.');
      }
    } else {
      alert('Por favor, preencha todos os campos E selecione um perfil.');
    }
  });
// aqui acaba a ferificação dos campos onde o loginredireciona 
   
//////////////////////////////////////////////////////////////////////////////////


    // Inicializa a página mostrando a primeira fase
    profileSelectionArea.classList.add('active');
});

// Onde a função será definida, no final do <body> ou no seu arquivo .js sem type="module"

function toggleMenu() {
    // 1. Captura o botão e o menu
    const menuOpcoes = document.getElementById('menu-opcoes');
    const hamburgerBtn = document.getElementById('hamburger'); // Opcional, para mudar o ícone

    // 2. Alterna (adiciona/remove) a classe 'ativo' no elemento do menu
    menuOpcoes.classList.toggle('ativo');

    // 3. (Opcional) Altera o ícone do botão de sanduíche para um 'X'
    if (menuOpcoes.classList.contains('ativo')) {
        hamburgerBtn.textContent = 'X'; // Menu aberto: mostra 'X'
    } else {
        hamburgerBtn.textContent = '☰'; // Menu fechado: mostra sanduíche
    }
}

// 4. Adiciona o evento de clique ao botão
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger');
    
    // ATENÇÃO: Se você usa onclick no HTML, esta linha é redundante/opcional.
    // Mas, se você tirou o onclick do HTML, use esta:
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMenu);
    }
});
    

// Exemplo de código no seu arquivo JavaScript do frontend

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
            // Você pode esconder os campos "Função" e "CNPJ/Empresa" aqui
            document.getElementById('job-title').parentElement.style.display = 'block'; // Ou 'none' se Aluno não precisar
        }
        
        // Esconde a tela de seleção de perfil
        document.getElementById('profile-selection').classList.remove('active');
        document.getElementById('registration-form').style.display = 'block'; 
        
        console.log(`Perfil selecionado: ${currentProfile}`);
    });
});

// Função de exemplo para mostrar a próxima tela (adapte à sua lógica de navegação)
function showScreen(screenId) {
    document.querySelectorAll('.form-section').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}


