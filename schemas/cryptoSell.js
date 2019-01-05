var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cryptoSellSchema = new Schema({
  quantity:{type:String},
  symbol:{type:String},
  userId:{type:Schema.Types.ObjectId, ref:'User'},
  createdDate:{type:Date, default:Date.now},
  totalprice:{type: String},
  currentprice:{type: String},
  txId:{type:String }

});

module.exports = cryptoSellSchema;
