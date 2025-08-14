const  mongoose = require ('mongoose')
const validator = require('validator')
var bdcypt = require('bcrypt');
const Formation = require('./Formation');
var schemaFormateur = mongoose.Schema({
    firstName : {
        type : String,
        
    },
    lastName : {
        type : String,
       
    },
 about : {
        type : String
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
       name : String,
       path : String
    },
   status :{
        type : String,
        enum : ['inactive','active'],
        default:'inactive'
    },
    
    formations : [{type : mongoose.Schema.Types.ObjectId , ref:'Formation'}],
});
schemaFormateur.pre('save',async function(next){
 const user = this;
 if (user.isModified('password')||user.isNew) {
    try{
        const salt = await bdcypt.genSalt(10);
        const hash = await bdcypt.hash(user.password,salt)
        user.password = hash;
        next();
    }catch(err){
        return next (err);

    }

 }else{
    return next();
 }   
});

 schemaFormateur.methods.comparePassword = async  function (formteurPassword){
    return bdcypt.compare(formteurPassword,this.password)
 }
module.exports = mongoose.model('Formateur',schemaFormateur);