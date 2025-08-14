var  mongoose = require ('mongoose');
var validator = require('validator');
const bdcypt = require('bcrypt');
var schemaAdmin = mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
     
    },
    email : {
        type : String,
        required : true ,
        unique : true,
        lowercase : true,
        trim : true,
        validate : [validator.isEmail,'please provide a valid email adress :)']
       
        
    },
    password : {
        type : String,
        required : true,
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [128, 'Password must be less than 128 characters long'],
        validate: {
            validator : function(value) {
                // The updated regex checks for at least one lowercase, one uppercase, one digit, and one special character
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
                return regex.test(value);
            },
            message: 'Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character',
        }
    },
    role:{
        type:String,    
        default : 'admin'
    }
    
    

});
schemaAdmin.pre('save',async function(next){
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
   
   schemaAdmin.methods.comparePassword = async  function (adminPassword){
       return bdcypt.compare(adminPassword,this.password)
    }
module.exports = mongoose.model('Admin',schemaAdmin);