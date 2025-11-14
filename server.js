const express = require('express');
const employersRouter = require('./router/employersRouter.js');

const path = require('path'); // 1. Importando 'path'

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages','index.html'));
});

app.use('/alunos',employersRouter);


app.listen(PORT,()=>{
    console.log(`  server rodando em http://localhost:${PORT}`);
    console.log(`  API rodando em: http://localhost:${PORT}/alunos`);
})