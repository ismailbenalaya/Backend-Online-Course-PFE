const  mongoose = require ('mongoose')

 var schemaSession = mongoose.Schema({
    formation :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Formation' 
    },
    condidat : [{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Condidat'
    }],
    formateur : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Formateur'
    },
    date : {
        type : Date
    },
    heure_deb : {
        type : String
    },
    heure_fin : {
        type : String
    }
 });
 module.exports= mongoose.model('Session',schemaSession)