const express = require('express');
const Aluno = require('../models/employers.js');
const supabase = require('../config/db.js');

const router = express.Router();


router.get('/', async (request, response) => {
  try {
    const alunos = await Aluno.find();
    response.status(200).json(alunos);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});
router.get('/:id', async (request, response) => {
  try {
    const aluno = await Aluno.findById(request.params.id);
    if (!aluno) {
      return response.status(404).json({ message: "Não foi possivel encontrar nem um registro" });
    } else {
      response.status(200).json(aluno);
    }

  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

//rota de login
router.post('/login', async (request, response) => {
    console.log('Dados recebidos:', request.body);
    // Renomeia 'senha' para 'password' para consistência no Supabase Auth
    const { email, senha, profile } = request.body; 
    const password = senha; // Usa 'senha' para a autenticação

    // 1. Validação de Entrada
    if (!email || !password || !profile) {
        return response.status(400).json({ success: false, message: 'Email, senha e perfil são obrigatórios.' });
    }

    // 1.1. Determinar o nome da tabela
    let tableName;
    if (profile === 'aluno') {
        tableName = 'aluno';
    } else if (profile === 'gerente') {
        tableName = 'gerente';
    } else if (profile === 'empresa') {
        tableName = 'empresa';
    } else {
         return response.status(400).json({ success: false, message: 'Perfil inválido. Deve ser aluno, gerente ou empresa.' });
    }

    try {
        // 2. Autenticação Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error('Erro de autenticação Supabase:', error);
            return response.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }
        
        const user = data.user;
        
        // --- 3. VERIFICAÇÃO ADICIONAL DO PERFIL ---
        // Busca na tabela específica ('aluno', 'gerente', ou 'empresa')
        const { data: profileData, error: profileError } = await supabase
            .from(tableName) // <-- CORRIGIDO: Usa o nome da tabela correto
            .select('*')     // <-- Mudado para '*' para pegar todos os dados do perfil
            .eq('user_id', user.id) // <-- CORRIGIDO: Usa a coluna 'user_id' e o ID do Supabase (UUID)
            .single();

        // Tratamento de Erro de Busca no BD (Erro de Servidor 500)
        if (profileError && profileError.code !== 'banco') {
            console.error(`Erro ao buscar perfil em ${tableName}:`, profileError);
            await supabase.auth.signOut();
            return response.status(500).json({ success: false, message: 'Erro interno na verificação do perfil.' });
        }

        // Tratamento de Mismatch de Perfil (403 - Usuário autenticado, mas não tem o perfil solicitado)
        if (!profileData) {
            await supabase.auth.signOut(); 
            return response.status(403).json({ success: false, message: `A conta não está cadastrada como ${profile}.` });
        }

        // 4. Sucesso no Login
        return response.status(200).json({ 
            success: true, 
            user_id: user.id, // ID do Supabase
            role: profile,     // Perfil solicitado (aluno, gerente, empresa)
            token: data.session.access_token,
            profileData: profileData // Dados completos do perfil (nome, cpf, etc.)
        });
        
    } catch (err) {
        // 5. Tratamento de Erro Geral (500)
        console.error('Erro fatal no processo de login:', err);
        return response.status(500).json({ success: false, message: 'Erro interno no servidor.' });
    }
});

router.post('/', async (request, response) => {
    console.log('Dados recebidos:', request.body);
    const { profile, fullName, jobTitle, email, password, cnpj, curso } = request.body;

    // 1. **VALIDAÇÃO BÁSICA**
    if (!email || !password || !profile) {
        return response.status(400).json({ error: 'Email, senha e perfil são obrigatórios.' });
    }
    
    try {
        // --- NOVO PASSO 1: CRIAR USUÁRIO NO SUPABASE AUTH (GoTrue) ---
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) {
            console.error('Erro de cadastro Supabase Auth:', authError);
            // Retorna o erro específico do Supabase, como e-mail já registrado
            return response.status(400).json({ error: authError.message });
        }
        
        const user = authData.user;
        let dadosParaSalvar;
        let resultado;
        let tabela;
        
        // Use o ID do usuário do Supabase para ligar o perfil
        const userId = user.id; 

        // 2. **SALVAR DADOS DE PERFIL NA SUA TABELA (SEM SENHA)**
        if (profile === 'aluno') {
            dadosParaSalvar = {
                user_id: userId, // **IMPORTANTE: Usar o ID do Supabase**
                nome: fullName,
                email: email, // O email é redundante, mas pode ser útil
                cpf: jobTitle,
                curso: curso || 'Curso padrão'
            };
            tabela = Aluno;
        } else if (profile === 'gerente') {
            dadosParaSalvar = {
                id: userId,
                nome: fullName,
                email: email,
                cargo: jobTitle,
                cnpj
            };
            tabela = Gerente;
        } else if (profile === 'empresa') {
            dadosParaSalvar = {
                id: userId,
                nome: fullName,
                email: email,
                cnpj
            };
            tabela = Empresa;
        } else {
            // Se o perfil for inválido, deslogar o usuário recém-criado
            await supabase.auth.signOut();
            return response.status(400).json({ error: 'Perfil inválido.' });
        }

        // Salvar os dados do perfil na tabela específica
        resultado = await tabela.create(dadosParaSalvar);

        response.status(201).json({
            message: `${profile} cadastrado com sucesso.`,
            user_id: userId,
            dados: resultado
        });

    } catch (error) {
        console.error('Erro ao cadastrar:', error.message);
        response.status(500).json({ error: error.message || 'Erro interno no servidor.' });
    }
});

router.put('/:id', async (request, response) => {
  try {
    const aluno = await Aluno.findByIdAndUpdate(request.params.id, request.body);
    if (!aluno) {
      return response.status(404).json({ message: 'Aluno não encontrado.' });
    } else {
      response.status(200).json({ message: 'Aluno atualizado com sucesso.', alunos: aluno });
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (request, response) => {
  try {
    const aluno = await Aluno.findByIdAndDelete(request.params.id);
    if (!aluno) {
      return response.status(404).json({ message: 'Aluno não encontrado.' });
    } else {
      response.status(200).json({ message: 'Aluno deletado com sucesso.', alunos: aluno });
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});
module.exports = router;




