var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var walletDeductionSchema = new Schema({
  quantity:{type:String},
  symbol:{type:String},
  userId:{type:Schema.Types.ObjectId, ref:'User'},
  createdDate:{type:Date, default:Date.now},
  fixedprice:{type: String},
  currentprice:{type: String},
  txId:{type:String }

});

module.exports = walletDeductionSchema;
