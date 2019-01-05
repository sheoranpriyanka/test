var mongoose = require('mongoose');
//var multer = require('multer');
var request = require('request');
var cryptoSellSchema = require("../schemas/cryptoSell.js");
var cryptoSellmodel = mongoose.model('cryptoSell',cryptoSellSchema);
var btc = require("../coins/btc.js");
var eth = require("../coins/ethNew.js");
var userSchema = require("../schemas/users.js");
var User = mongoose.model('User', userSchema);
var adminSchema = require("../admin/schemas/admin.js");
var Admin = mongoose.model('Admin', adminSchema);

var save =  function(req, res, data){
  console.log(req.body, req.user.id);
  User.findById(req.user.id, function(err, user){
    Admin.findById('5b4c4a46c0228718a0ae33a5', async function(err, adminData){
        if(err || user == null){
          res.json({status:"user not found"});
        }else{
          //  const btcUserBalance = await btc.getBalance("Arihant123");
              const btcUserBalance = 1;
          if(req.body.quantity <= btcUserBalance ){
            if(req.body.symbol == 'BTC'){
            //  const txdata =  btc.transferAmount('Arihant1234', '2N8eWmFksoVRioaSdQyzqPmv237F2EJ29A7', req.body.quantity, 1);
            //  console.log(txdata);
            // if(txdata != null){
            console.log(req.body.totalprice);
                User.findByIdAndUpdate(req.user.id, { $inc: {myWallet:req.body.totalprice}},  function(err, userUpdate){
                  Admin.findByIdAndUpdate('5b4c4a46c0228718a0ae33a5', { $inc: { adminTotalWallet:req.body.totalprice }},  function(err, adminUpdate){
                        let saveData = new cryptoSellmodel({
                            quantity:req.body.quantity,
                            symbol:req.body.symbol,
                            userId:req.user.id,
                            //createdDate:{type:Date, default:Date.now},
                            totalprice:req.body.totalprice,
                            currentprice:req.body.currentprice,
                            txId:"txdata"
                          });
                        saveData.save(function(err){
                          if(err) throw err;
                          else{
                            res.status(200).json({status:"Transaction successful amount is added in your fiat wallet"});
                          }
                        });
                      });
                    });
            //   }

            }else if(req.body.symbol == 'ETH'){
              var ethData = config.get('eth');
            // const txdata = eth.transferAmount('2N38M5F14HSFHACRhVSAzqV2HxJkw4S4rdf', '2N2zy8duY9BKwUgzH3phCpr2LDaj5pKzM2c', '0.001', ethData);
            //if(txdata){
                  User.findByIdAndUpdate(req.user.id, { $inc: {myWallet:req.body.totalprice}},  function(err, userUpdate){
                    Admin.findByIdAndUpdate('5b4c4a46c0228718a0ae33a5', { $inc: { adminTotalWallet:req.body.totalprice }},  function(err, adminUpdate){
                          let saveData = new cryptoSellmodel({
                              quantity:req.body.quantity,
                              symbol:req.body.symbol,
                              userId:req.user.id,
                              //createdDate:{type:Date, default:Date.now},
                              totalprice:req.body.totalprice,
                              currentprice:req.body.currentprice,
                              txId:req.body.txId
                            });
                          saveData.save(function(err){
                            if(err) throw err;
                            else{
                              res.status(200).json({status:"Transaction successful amount is added in your fiat wallet"});
                            }
                          });
                        });
                      });
                //  }
            }else if(req.body.symbol == 'USDT'){

            }
          }else{
            res.status(200).json({status:"You have not enough balance in your wallet"})
          }
        }
       });
      });
}
var OrderDataBywallet = function(req, res){
  cryptoSellmodel.find({ userId:req.user.id},null,{sort:{createdDate: -1}} , function(err, users) {
       if (err) {
         console.log(err);
         res.status(500).json({status : "invalid request"});
       }else{
         res.send(users);
       }

    });
}

//module.exports.addWalletSuccess = addWalletSuccess;
module.exports.cryptoSell = save;
module.exports.cryptoSellHistory = OrderDataBywallet;
