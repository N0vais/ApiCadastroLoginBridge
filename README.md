

# 🚀 Bridge Auth System
![Node.js](https://img.shields.io/badge/Node.js-LTS-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Framework-lightgrey?logo=express)
![Supabase](https://img.shields.io/badge/Supabase-Auth-blue?logo=supabase)
![License](https://img.shields.io/badge/license-ISC-yellow)

Sistema de autenticação robusto com **Node.js**, **Express** e **Supabase**, utilizando **cookies protegidos** para sessões seguras.

---

## 🎯 Visão Geral
Este projeto implementa um sistema de autenticação baseado em perfis, garantindo que áreas restritas e ativos estáticos (CSS, JS, imagens) só sejam acessados após validação de perfil e sessão.

---

## 🌟 Destaques Técnicos
- 🔑 **Autenticação JWT via Supabase**  
- 👥 **Controle de Acesso Baseado em Perfil (PBAC)**: aluno, gerente, empresa  
- 🍪 **Sessões Seguras** com cookies `httpOnly`  
- 🛡️ **Middleware Inteligente** (`checkAuth`) para proteger rotas e recursos  

---

### 1. 🏗️ Estrutura do Projeto (Modelo)

```bash
.
├── router/             # Definições de rotas da API (e.g., login, logout)
│   └── employersRouter.js
├── middleware/         # Funções de interceptação (e.g., checkAuth)
│   └── auth.js
├── public/             # Assets públicos (Acesso irrestrito)
│   └── pages/index.html
├── restrict/           # Assets protegidos (portalAluno.html, CSS, JS)
├── .env                # Configurações de ambiente
└── server.js           # Servidor Express principal
```


## ⚙️ Instalação

### 2. Pré-requisitos
- Node.js (versão LTS recomendada)  
- Projeto Supabase ativo com tabelas de perfil vinculadas por `user_id`

### 3. Instalação de Dependências
```bash
git clone [https://github.com/N0vais/ApiCadastroLoginBridge]
cd [NOME_DA_PASTA]
npm install
"dependencies": {
    "@supabase/supabase-js": "^2.80.0",
    "cookie-parser": "^1.4.7",
    "dotenv": "^17.2.3",
    "express": "^5.1.0"
    }

```
### 4. Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto:

env  
--SUPABASE_URL=**"SUA_URL_DO_PROJETO_SUPABASE"**  
--SUPABASE_KEY=**"SUA_CHAVE_ANON_PUBLIC_DO_PROJETO"**  
--NODE_ENV="development":




