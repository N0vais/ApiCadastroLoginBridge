const express = require('express');
const employersRouter = require('./router/employersRouter.js');

const cookieParser = require('cookie-parser');

const path = require('path'); // 1. Importando 'path'

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(cookieParser());

//para a rota de proteção da pasta restrict posso me basear nesta rota de publico..
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages','index.html'));
});

app.use('/alunos',employersRouter);


const checkAuth = (req, res, next) => {
    // Verifica se o cookie de autenticação está presente
    if (req.cookies.auth_token) {
        next(); //  Acesso concedido se o cookie estiver aqui
    } else {
        // Redireciona para a página de login se não estiver autenticado
        res.redirect('/'); //  Acesso negado
    }
};

app.use('/restrict', checkAuth, express.static(path.join(__dirname, 'restrict')));

app.get('/portal', checkAuth, (req, res) => {
    // Se o middleware checkAuth passar, o usuário chega aqui
    res.sendFile(path.join(__dirname, 'restrict', 'portalAluno.html'));
});

app.listen(PORT,()=>{
    console.log(`  server rodando em http://localhost:${PORT}`);
    console.log(`  API rodando em: http://localhost:${PORT}/alunos`);
})