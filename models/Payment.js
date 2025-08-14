var  mongoose = require ('mongoose');

var schemaPayment = mongoose.Schema({
    condidat : {type : mongoose.Schema.Types.ObjectId, ref :"Condidat"},
    formation : {type : mongoose.Schema.Types.ObjectId ,ref :"Formation"},
    totalAmount : {type : Number , default :0},
    amount : {type :Number , default : 0}, 
    status : {
        type : String,
        enum : ["pending","completed"],
        default  : "pending"
    },
    tranches : [
        {
                montant_tranches  : {
                        type : Number
                },
                date_depot_tranche : {
                    type : Date, default: Date.now
                }
        }
    ],
  montant_restant : {
    type : Number
  }  ,
  
},
{timestemp :true});
const Payment =  mongoose.model("Payement",schemaPayment)
module.exports = Payment