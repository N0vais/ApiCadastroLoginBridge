// --- Variáveis de Estado e Elementos do DOM ---
let currentProfile = null;
let currentScreenId = 'profile-selection';
let companyData = {}; // Objeto para armazenar dados do cadastro (empresa ou pessoal)

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const screens = {
    'profile-selection': $('#profile-selection'),
    'cnpj-screen': $('#cnpj-screen'),
    'details-screen': $('#details-screen'),
    'personal-data-screen': $('#personal-data-screen'),
    'email-screen': $('#email-screen'),
    'password-screen': $('#password-screen'),
    'confirmation-screen': $('#confirmation-screen'),
};

// Elementos da primeira tela
const profileCards = $$('.profile-card');

// Elementos da tela de CNPJ
const cnpjInput = $('#cnpj-input');
const validateBtn = $('#validate-btn');
const errorMessageCnpj = $('#error-message-cnpj');

// Elementos da tela de Detalhes
const companyNameInput = $('#company-name');
const activitiesTextarea = $('#activities');
const confirmBtn = $('#confirm-btn');
const editBtn = $('#edit-btn');

// Elementos da tela de Dados Pessoais
const fullNameInput = $('#nome');
const jobTitleInput = $('#job-title');
const personalDataTitle = $('#personal-data-title'); // Para mudar o título da tela
const nextPersonalDataBtn = $('#next-personal-data-btn');
const errorMessagePersonal = $('#error-message-personal');

// Elementos da tela de Email
const emailInput = $('#email-input');
const nextEmailBtn = $('#next-email-btn');
const errorMessageEmail = $('#error-message-email');

// Elementos da tela de Senha
const passwordInput = $('#password-input');
const confirmPasswordInput = $('#confirm-password-input');
const submitBtn = $('#submit-btn');
const passwordMatchError = $('#password-match-error');
const toggleButtons = $$('.toggle-password');

// Localize o botão
const closeLoginButton = document.getElementById('closeLoginButton');

/** Redireciona o usuário para a página inicial.*/
function goToHomePage() {
    window.location.href = '/';

}

// Adiciona o ouvinte de evento para executar a função ao clicar
if (closeLoginButton) {
    closeLoginButton.addEventListener('click', goToHomePage);
}

// 1. Funções de Utilitários 

/**
 * Máscara para CNPJ: 00.000.000/0000-00
 * @param {string} value - O valor do input.
 */
function maskCNPJ(value) {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})-(\d{2}).*/, '$1.$2.$3/$4-$5');
}

/**
 * Função para simular uma busca de CNPJ (Mock API)
 * @param {string} cnpj - CNPJ a ser buscado.
 * @returns {Promise<object>} - Dados simulados da empresa.
 */
function mockCNPJLookup(cnpj) {
    if (cnpj.replace(/\D/g, '').length === 14) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    name: 'ACME Soluções em Tecnologia Ltda',
                    activities: 'Desenvolvimento de software, Consultoria em TI.'
                });
            }, 500); // Simula latência
        });
    } else {
        return Promise.resolve({
            success: false,
            message: 'CNPJ inválido ou não encontrado na base de dados (Mock).'
        });
    }
}

//  2. Funções de Transição de Tela 

function goToScreen(nextScreenId) {
    const currentScreen = screens[currentScreenId];
    if (currentScreen) {
        currentScreen.classList.remove('active');
        currentScreen.classList.add('hidden');
    }

    const nextScreen = screens[nextScreenId];
    if (nextScreen) {
        setTimeout(() => {
            nextScreen.classList.remove('hidden');
            nextScreen.classList.add('active');
            currentScreenId = nextScreenId;
        }, 100);
    }
}

// 3. Lógica de Seleção de Perfil (CORRIGIDA) 

profileCards.forEach(card => {
    card.addEventListener('click', () => {
        profileCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        currentProfile = card.dataset.profile;

        // Limpa dados de entrada anteriores
        fullNameInput.value = '';
        jobTitleInput.value = '';
        emailInput.value = '';

        setTimeout(() => {
            if (currentProfile === 'empresa') {
                // Fluxo da Empresa: CNPJ -> Detalhes -> Pessoal -> Email -> Senha
                goToScreen('cnpj-screen');
            } else {
                // Fluxo de Aluno ou Gerente: Pessoal -> Email -> Senha

                // 1. Ajustar o título da tela de Dados Pessoais
                if (currentProfile === 'aluno') {
                    personalDataTitle.textContent = 'Complete seus dados de Aluno:';
                    jobTitleInput.placeholder = 'Ex: Número de CPF';
                    // Esconde a label "Sua Função" (ou renomeia, aqui vou renomear para ser mais claro)
                    $('label[for="job-title"]').textContent = 'cpf';
                } else if (currentProfile === 'gerente') {
                    personalDataTitle.textContent = 'Complete seus dados de Gerente:';
                    jobTitleInput.placeholder = 'Ex: Coordenador, Supervisor';
                    $('label[for="job-title"]').textContent = 'Sua Função';
                }

                // 2. Navegar para a tela de Dados Pessoais
                goToScreen('personal-data-screen');
            }
        }, 300);
    });
});

// 4. Lógica de Validação CNPJ/Busca (Fluxo Empresa) 

cnpjInput.addEventListener('input', (e) => {
    e.target.value = maskCNPJ(e.target.value);
    errorMessageCnpj.textContent = '';
});

validateBtn.addEventListener('click', async () => {
    const cnpj = cnpjInput.value;
    errorMessageCnpj.textContent = '';

    if (cnpj.replace(/\D/g, '').length !== 14) {
        errorMessageCnpj.textContent = 'Por favor, insira um CNPJ válido de 14 dígitos.';
        return;
    }

    validateBtn.textContent = 'Buscando...';
    validateBtn.disabled = true;

    const result = await mockCNPJLookup(cnpj);

    validateBtn.textContent = 'Continuar';
    validateBtn.disabled = false;

    if (result.success) {
        companyData = {
            profile: 'empresa',
            cnpj: cnpj,
            name: result.name,
            activities: result.activities
        };
        companyNameInput.value = result.name;
        activitiesTextarea.value = result.activities;
        goToScreen('details-screen');
    } else {
        errorMessageCnpj.textContent = result.message;
    }
});

//5. Lógica de Confirmação de Detalhes (Fluxo Empresa)

confirmBtn.addEventListener('click', () => {
    goToScreen('personal-data-screen');
});

editBtn.addEventListener('click', () => {
    goToScreen('cnpj-screen');
});

//6. Lógica de Dados Pessoais (Fluxo Aluno, Gerente e Empresa) ---

nextPersonalDataBtn.addEventListener('click', () => {
    errorMessagePersonal.textContent = '';
    const fullName = fullNameInput.value.trim();
    const jobTitle = jobTitleInput.value.trim(); // cpf/Função

    if (fullName.length < 3 || jobTitle.length < 2) {
        errorMessagePersonal.textContent = 'Por favor, preencha todos os campos corretamente.';
        return;
    }

    // Atualiza o objeto de dados com as informações coletadas
    companyData.profile = companyData.profile || currentProfile; // Define o perfil se ainda não definido (Aluno/Gerente)
    companyData.fullName = fullName;
    companyData.jobTitle = jobTitle;

    // Se for Aluno ou Gerente, a tela de Dados Pessoais deve definir o profile
    if (!companyData.profile) companyData.profile = currentProfile;

    // PRÓXIMA TELA: email-screen
    goToScreen('email-screen');
});

// 7. Lógica de Validação de Email 

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

nextEmailBtn.addEventListener('click', () => {
    errorMessageEmail.textContent = '';
    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
        errorMessageEmail.textContent = 'Por favor, insira um endereço de e-mail válido.';
        return;
    }

    companyData.email = email;

    // PRÓXIMA TELA: password-screen
    goToScreen('password-screen');
});

// 8. Lógica de Validação de Senha E Confirmação 

function checkPasswordStrength(password) {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[^A-Za-z0-9\s]/.test(password)
    };

    let allValid = true;
    for (const key in checks) {
        const isValid = checks[key];
        const listItem = $(`#${key}-check`);

        if (listItem) {
            if (isValid) {
                listItem.classList.add('valid');
                listItem.classList.remove('invalid');
            } else {
                listItem.classList.add('invalid');
                listItem.classList.remove('valid');
                allValid = false;
            }
        }
    }
    return allValid;
}

function checkFinalValidation() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const isStrong = checkPasswordStrength(password);
    const isMatch = password === confirmPassword;

    passwordMatchError.textContent = '';

    if (!isStrong) {
        submitBtn.disabled = true;
        return;
    }

    if (!isMatch) {
        submitBtn.disabled = true;
        if (confirmPassword.length > 0 && password.length > 0) {
            passwordMatchError.textContent = 'As senhas não coincidem.';
        }
        return;
    }

    submitBtn.disabled = false;
}

// Ouvintes de evento de digitação nos campos de senha
passwordInput.addEventListener('input', checkFinalValidation);
confirmPasswordInput.addEventListener('input', checkFinalValidation);

// 9. Lógica de Toggle (Visualizar Senha) 
// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const initialScreen = $('#profile-selection');
    initialScreen.classList.add('active');
    initialScreen.classList.remove('hidden');
    currentScreenId = 'profile-selection';
});

//inico do comtroledo botao voltar
// Mapeamento de telas e botões de voltar
const allBackButtons = $$('.back-btn');

// 2. Funções de Transição de Tela 

function goToScreen(nextScreenId) {
    // ... (Mantenha o código goToScreen inalterado) ...
    const currentScreen = screens[currentScreenId];
    if (currentScreen) {
        currentScreen.classList.remove('active');
        currentScreen.classList.add('hidden');
    }

    const nextScreen = screens[nextScreenId];
    if (nextScreen) {
        setTimeout(() => {
            nextScreen.classList.remove('hidden');
            nextScreen.classList.add('active');
            currentScreenId = nextScreenId;
        }, 100);
    }
}

//mapeamento do fluxo de navegação da empresa (ok)
const flowMap = {
    'profile-selection': () => currentProfile === 'empresa' ? 'cnpj-screen' : 'personal-data-screen',
    'cnpj-screen': 'details-screen',
    'details-screen': 'personal-data-screen',
    'personal-data-screen': 'email-screen',
    'email-screen': 'password-screen',
    'password-screen': 'confirmation-screen',
};
// 3. Lógica de Seleção de Perfil (ok)
profileCards.forEach(card => {
    card.addEventListener('click', () => {
        // 1. Seleção e Estado
        profileCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        currentProfile = card.dataset.profile;

        // Limpa dados de entrada anteriores
        fullNameInput.value = '';
        jobTitleInput.value = '';
        emailInput.value = '';
        // Limpar dados do objeto companyData (opcional, mas recomendado)
        companyData = { profile: currentProfile };

        // 2. Lógica de Perfil Específica
        if (currentProfile === 'aluno') {
            personalDataTitle.textContent = 'Complete seus dados de Aluno:';
            jobTitleInput.placeholder = 'Ex: Número de CPF';
            $('label[for="job-title"]').textContent = 'CPF';
        } else if (currentProfile === 'gerente') {
            personalDataTitle.textContent = 'Complete seus dados de Gerente:';
            jobTitleInput.placeholder = 'Ex: Coordenador, Supervisor';
            $('label[for="job-title"]').textContent = 'Sua Função';
        }

        // 3. Navegação
        setTimeout(() => {
            const nextScreen = flowMap['profile-selection'](); // Usa o novo mapa de fluxo
            goToScreen(nextScreen);
        }, 300);
    });
});

// NOVO: Função para Voltar (ok)
function goBack(previousScreenId) {

    // Caso especial para a tela de Dados Pessoais:
    if (currentScreenId === 'personal-data-screen' && previousScreenId === 'dynamic') {
        const prevScreen = (currentProfile === 'empresa') ? 'details-screen' : 'profile-selection';
        goToScreen(prevScreen);
    } else {
        goToScreen(previousScreenId);
    }
}
// Lógica de Botões de Voltar (ok) 
allBackButtons.forEach(button => {
    button.addEventListener('click', () => {
        const prevScreenId = button.dataset.prev;
        goBack(prevScreenId);
    });
});

// função que vai altenar a visibilidade da senha.
function togglePasswordVisibility(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(iconId);

    // Verifica se os elementos existem antes de continuar
    if (!passwordInput || !toggleIcon) {
        console.error("Input ou ícone não encontrado.");
        return;
    }

    // Lógica de Alternância
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.textContent = '🙉'; // Macaco tapando as orelhas (Sugere ocultar)
    } else {
        passwordInput.type = 'password';
        toggleIcon.textContent = '🙈'; // Macaco tapando os olhos (Sugere mostrar)
    }
}

// 10. Lógica de Finalização de Cadastro (SUBMIT) 


// 10. Lógica de Finalização de Cadastro (SUBMIT)
// Objeto para exibir mensagens de erro/sucesso do servidor
const submissionMessage = $('#submission-message'); // Supondo que você tenha um elemento no HTML para isso

$('#registration-form').addEventListener('submit', async (e) => { // Tornar a função assíncrona
    e.preventDefault();

    checkFinalValidation();

    if (submitBtn.disabled) {
        console.error("Cadastro bloqueado devido a validações não atendidas.");
        // Exibir erro visualmente
        if (submissionMessage) {
            submissionMessage.textContent = 'Por favor, corrija os erros de validação antes de continuar.';
            submissionMessage.classList.add('error');
        }
        return;
    }

    companyData.password = passwordInput.value; // Adiciona a senha aos dados

    console.log("Perfil e Dados Finais Prontos para Envio:", companyData.profile, companyData);

    // 1. Mostrar estado de carregamento
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    if (submissionMessage) submissionMessage.textContent = ''; // Limpa mensagens anteriores

    try {
        // 2. Chamada à API para salvar os dados-------------
        //trocar a api
        const apiUrl = '/alunos';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(companyData), // Envia o objeto de dados como JSON
        });

        // 3. Processar a resposta da API
        const result = await response.json();

        if (response.ok) { // Se o status da resposta for 200-299
            console.log("Cadastro realizado com sucesso!", result);

            // Armazena dados de confirmação (opcional)
            //screens['confirmation-screen'].querySelector('#confirmation-message').textContent = `Bem-vindo(a), ${companyData.fullName}! Seu cadastro está completo.`;

            goToScreen('confirmation-screen');

            // Redirecionamento após alguns segundos
            setTimeout(() => {
                console.log("Redirecionando para a página de login...");
                // window.location.href = 'login.html'; // Exemplo de redirecionamento
            }, 3000);

        } else {
            // Se a API retornar um erro (ex: 400 Bad Request)
            console.error("Erro no cadastro:", result.message || "Erro desconhecido do servidor.");
            if (submissionMessage) {
                submissionMessage.textContent = result.message || 'Falha no cadastro. Tente novamente.';
                submissionMessage.classList.add('error');
            }
            submitBtn.textContent = 'Finalizar Cadastro';
            submitBtn.disabled = false; // Permite tentar novamente
        }

    } catch (error) {
        // Erro de rede (servidor indisponível, CORS, etc.)
        console.error("Erro de rede/servidor:", error);
        if (submissionMessage) {
            submissionMessage.textContent = 'Erro de conexão com o servidor. Verifique sua rede.';
            submissionMessage.classList.add('error');
        }
        submitBtn.textContent = 'Finalizar Cadastro';
        submitBtn.disabled = false; // Permite tentar novamente
    }
});

//função que ira redirecionar o usuario para o login apos o cadastro

function abrirModalLogin() {
  window.location.href = '/'; 
}