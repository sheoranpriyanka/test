var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addWalletPaymentSchema = new Schema({
  gatewayData:{type:Object},
  coinDetail:{type:Object},
  userId:{type:Schema.Types.ObjectId, ref:'User'},
  createdDate:{type:Date, default:Date.now},
  verify:{type: Object}


});

module.exports = addWalletPaymentSchema;
