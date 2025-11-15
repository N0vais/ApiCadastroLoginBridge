// Função para verificar se o cookie de autenticação está presente
const checkAuth = (req, res, next) => {
    // Usaremos a lógica de cookie simples do seu código
    if (req.cookies && req.cookies.auth_token) {
        // Se o cookie existir, continua para a próxima função da rota
        next();
    } else {
        // Se não existir, redireciona para a página inicial/login
        res.redirect('/');
    }
};

// EXPORTA a função para que outros arquivos possam usá-la
module.exports = {checkAuth};