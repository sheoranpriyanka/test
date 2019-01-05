var mongoose = require('mongoose');
var eth = require("../coins/ethNew.js");
var userSchema = require("../schemas/users.js");
var sendEthSchema = require("../schemas/sendEth.js");
var sendEthtoaddress = mongoose.model('sendEthtoaddress',sendEthSchema);
var wallet = mongoose.model('user',userSchema);
var userProfileSchema = require("../schemas/userProfile.js");
var userProfile = mongoose.model('userProfile',userProfileSchema);

var sendEth = function(req,res){
  console.log(req.body.senderAddress);
  wallet.findById(req.user.id,  function(err,user){
    if(err) console.log(err);
    else {

     eth.unlockAddress('0xc7050889e6ccd298b48c8c259f5318545f9f6ff4', 'KopraWallet123@Kopra').then( async function(unlock){
      console.log(unlock)
    //console.log(data.wallets.bitcoin.name);
    await eth.sendTransaction('0xc7050889e6ccd298b48c8c259f5318545f9f6ff4', req.body.senderAddress, req.body.quantity).then( function(data){
      console.log(data);

        var details = new sendEthtoaddress({
          senderAddress:req.body.senderAddress,
          amount:req.body.quantity,
          txId:'',
          userId:req.user.id
        });
        details.save(function(err){
          if(err){
            res.status(200).json({status:"error sending"});
          }
          else{
            res.status(200).json({status:"sent successfully"});
          }
        });

    }).catch(function(err){
        res.json({status:"Cannot transfer data"});
      console.log(err)});
  //  console.log(result);
}).catch(function(err){ console.log(err)});
      res.json({status:"unable to  unlock account"});
  }
  });
}

var receiveEth = function(req,res){
  wallet.findById(req.user.id, async function(err,data){
    if(err) console.log(err);
    else {
    console.log(data.wallets.ethereum.address);
    res.status(200).json({address:data.wallets.ethereum.address});
    //let result = eth.getAddressByAccount(data.wallets.bitcoin.name);
    //console.log(result);
  }
});
}

var senderData = function(req, res){
    wallet.findById(req.user.id,  function(err,data){
      if(err ) console.log(err);
      else {
    //  console.log(data.wallets.bitcoin.address);
      res.send(data);
      //let result = eth.getAddressByAccount(data.wallets.bitcoin.name);
      //console.log(result);
    }
  });
}

module.exports = {sendEth,receiveEth, senderData };
