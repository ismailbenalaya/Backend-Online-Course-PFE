const mongoose = require ('mongoose');
const { stringify } = require('uuid');
var SchemaTokenCondiat = mongoose.Schema({
  userId : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : 'Condidat'
  },
  token : {
    type : String,
    required : true
  }, 
  createdAt : {
type : Date,
default : Date.now, 
expires : 300
  
  }
 
});
module.exports = mongoose.model('tokenCondidat',SchemaTokenCondiat);
