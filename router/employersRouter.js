const express = require('express');
const Aluno = require('../models/employers.js');

const router = express.Router();

router.get('/', async (request,response)=>{
    try{
        const alunos = await Aluno.find();
        response.status(200).json(alunos);
    }catch(error){
        response.status(500).json({error:error.message});
    }
});
router.get('/:id', async (request,response)=>{
    try{
        const aluno = await Aluno.findById(request.params.id);
        if(!aluno){
            return response.status(404).json({message: "Não foi possivel encontrar nem um registro"});
        }else{
            response.status(200).json(aluno);
        }
        
    }catch(error){
        response.status(500).json({error:error.message});
    }
});

router.post('/', async (request,response)=>{
    try{
        const aluno = await Aluno.create(request.body);
        response.status(201).json({message: 'Aluno criado com sucesso.', aluno:aluno});                
    }catch(error){
        response.status(500).json({error:error.message});
    }
});

router.put('/:id', async (request,response)=>{
    try{
        const aluno = await Aluno.findByIdAndUpdate(request.params.id, request.body);
        if(!aluno){
            return response.status(404).json({message:'Aluno não encontrado.'});
        }else{
            response.status(200).json({message: 'Aluno atualizado com sucesso.', alunos:aluno});    
        }  
    }catch(error){
        response.status(500).json({error:error.message});
    }
});

router.delete('/:id', async (request,response)=>{
    try{
        const aluno = await Aluno.findByIdAndDelete(request.params.id);
        if(!aluno){
            return response.status(404).json({message:'Aluno não encontrado.'});
        }else{
            response.status(200).json({message: 'Aluno deletado com sucesso.', alunos:aluno});    
        }  
    }catch(error){
        response.status(500).json({error:error.message});
    }
});
module.exports = router;


