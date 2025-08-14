const mongoose = require('mongoose');
const validator = require ('validator');
const Formateur = require('./Formateur');
const Review = require('./Review');

var schemaFormation = mongoose.Schema({
    nom : {
        type : String,
        required: true
     
    },
    prix : {
        type : Number,
        require : true
    },
    categorie : {
         type : mongoose.Schema.Types.ObjectId , ref : 'Categorie'
    },
    
    description : {
        type : String 
    },
    cas : {
        type : String
    },
    condidat : [{type : mongoose.Schema.Types.ObjectId , ref:'Condidat'}],
    formateur : {
        type : mongoose.Schema.Types.ObjectId , ref :'Formateur'
    },
    reviews :[{
      type : Number, 
      default : 0
    }]
    
    })

module.exports= mongoose.model('Formation',schemaFormation)