var  mongoose = require ('mongoose');
const validator = require('validator');
const bdcypt = require('bcrypt');
const Formation = require('./Formation');
const { stringify } = require('uuid');
var schemaCondidat = mongoose.Schema({
    firstName : {
        type : String,
   
    },
    lastName : {
        type : String,
       
    },

    adress : {
        type : String,
          },
    date_nais : {
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
       
      /* minlength: [8, 'password must be at least 8 characters long'],
        maxlength: [128, 'password must be less than 128 characters long'],
        validate: {
            validator: function (value) {
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return regex.test(value);
            },
            message: 'password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character',
        }*/
    },
   
    phone: {
        type : String,
       /* minlength: [8, 'password must be at least 8 numbers long'],
        maxlength: [8, 'password must be less then 8 numbers  long']*/
    },
   /* image :{
        type : String

    },*/
    role : {
        type : String,
        default : 'condidat'
    },
    verified :{
        type : Boolean,
        default : false
    },
    /*avatar : {
        type : String
        
    },*/
    formations :[{
        type :  mongoose.Schema.Types.ObjectId ,
        ref   : "Formation"
    }],
    verificationToken :{
        type : String
      },
      resetToken : {
        type : String ,

      },
      resetTokenExpire : {
        type : Date,

      }

    
});

schemaCondidat.pre('save',async function(next){
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
   schemaCondidat.methods.comparePassword = async  function (condidatPassword){
    return bdcypt.compare(condidatPassword,this.password)
 }
   
module.exports = mongoose.model('Condidat',schemaCondidat);