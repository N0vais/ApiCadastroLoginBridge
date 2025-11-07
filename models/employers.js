const supabase = require ('../config/db.js');

class Aluno {
    static async find(){
        const { data, error } = await supabase.from('aluno').select('*');
        if(error){
            throw new Error("deu ruim");
            
        }else{
            return data;
        }
    }
    static async findById(id){
        const { data, error } = await supabase.from ( 'aluno').select('*').eq('id',id).single();

        if(error){
            throw error;
        }else{
            return data;
        }
    }

    static async create (aluno){
        const { data, error } = await supabase.from ( 'aluno').insert(aluno).select().single();

         if(error){
            throw error;
        }else{
            return data;
        }
    }

    static async findByIdAndUpdate(id, aluno){

       const { data, error } = await supabase.from('aluno').update(aluno).eq('id', id).select().single();

        if(error){
            throw error;
        }else{
            return data;
        }
    }

     static async findByIdAndDelete(id){

       const { data, error } = await supabase.from('aluno').delete().eq('id', id).select().single();

        if(error){
            throw error;
        }else{
            return data;
        }
    }
}

module.exports = Aluno;