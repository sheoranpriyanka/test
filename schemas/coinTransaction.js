var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var coinTransactionSchema = new Schema({
  gatewayData:{type:Object},
  coinDetail:{type:Object},
  userId:{type:Schema.Types.ObjectId, ref:'User'},
  createdDate:{type:Date, default:Date.now},
  txId:{type: String}
});

module.exports = coinTransactionSchema;
