var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sendBtcSchema = new Schema({
  senderAddress:{type:String},
  amount:{type:Number},
  txId:{type:String},
  userId:{type:Schema.Types.ObjectId, ref:'User'},
  createdDate:{type:Date, default:Date.now},

});

module.exports = sendBtcSchema;
