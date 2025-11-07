const express = require('express');
const employersRouter = require('./router/employersRouter.js');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use('/alunos',employersRouter);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})