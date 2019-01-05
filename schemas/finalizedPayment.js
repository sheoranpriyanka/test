var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var finalizedPaymentSchema = new Schema({
  authority:{type:String},
  txId:{type:String},
  verificationStatus:{type:Number},
  userId:{type:Schema.Types.ObjectId, ref:'User'},
  createdDate:{type:Date, default:Date.now}

});

module.exports = finalizedPaymentSchema;
