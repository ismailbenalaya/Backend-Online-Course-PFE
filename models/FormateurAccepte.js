var mongoose = require('mongoose')
var validator = require('validator')
var schemaFormateurAccepter = mongoose.Schema({
    firstName : {
        type : String,
        
    },
    lastName : {
        type : String,
       
    },
    sexe : {
        type : String,
        
    },
    date_nais :{
         type : String,
         
    },
    adress : {
        type : String,
      
    },
    email : {
        type : String,
        unique : true,
     
       lowercase : true,
       trim : true,
        validate : [validator.isEmail,'please provide a valid email adress :)'] 
    },
    password: {
        type: String,
       
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [128, 'Password must be less than 128 characters long'],
       /* validate: {
            validator: function(value) {
                // The updated regex checks for at least one lowercase, one uppercase, one digit, and one special character
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
                return regex.test(value);
            },
            message: 'Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character',
        }*/
    },
    
    phone: {
        type : Number,
        minlength: [8, 'password must be at least 8 numbers long'],
        maxlength: [8, 'password must be less then 8 numbers  long']
    },
    role : {
        type : String,
        default : 'formateur'
    },
    cv:{
        filename : String,
        data : Buffer,
        contentType : String
    },
    status:{
        type : String,
        enum : ['inactive','active','refuse'],
        default:'inactive'
    },
    formations : [{type : mongoose.Schema.Types.ObjectId , ref:'Formation'}],
});


schemaFormateurAccepter.methods.comparePassword = async  function (formteurPassword){
    return bdcypt.compare(formteurPassword,this.password)
 }
module.exports = mongoose.model('FormateurAccpter',schemaFormateurAccepter);