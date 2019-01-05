var mongoose = require('mongoose');
var btc = require("../coins/btc.js");
var userSchema = require("../schemas/users.js");
var sendBtcSchema = require("../schemas/sendBtc.js");
var sendBtctoaddress = mongoose.model('sendBtctoaddress',sendBtcSchema);
var wallet = mongoose.model('user',userSchema);
var sendBtc = function(req,res){
  wallet.findById(req.user.id, async function(err,data){
    if(err) console.log(err);
    else {
    console.log(data.wallets.bitcoin.name);
    let result = await btc.transferAmount(data.wallets.bitcoin.name,req.body.senderAddress,req.body.quantity, 1);
    console.log(result);
    if(result){
      var details = new sendBtctoaddress({
        senderAddress:req.body.senderAddress,
        amount:req.body.quantity,
        txId:result,
        userId:req.user.id
      });
      details.save(function(err){
        if(err){
          res.status(400).json({status:"error sending"});
        }
        else{
          res.status(200).json({status:"sent successfully"});
        }
      });
    }
  }
  });
}

var receiveBtc = function(req,res){
  wallet.findById(req.user.id, async function(err,data){
    if(err) console.log(err);
    else {
    console.log(data.wallets.bitcoin.address);
    res.status(200).json({address:data.wallets.bitcoin.address});
    //let result = btc.getAddressByAccount(data.wallets.bitcoin.name);
    //console.log(result);
  }
});
}

module.exports = {sendBtc,receiveBtc};
