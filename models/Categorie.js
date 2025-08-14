const mongoose = require ('mongoose');

var SchemaCategorie  = mongoose.Schema({
    nom : {
        type :String,
        unique : true
    },

    description :{
        type:String
    }
});
module.exports =  mongoose.model('Categorie',SchemaCategorie) 