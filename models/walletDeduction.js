var mongoose = require('mongoose');
//var multer = require('multer');
var request = require('request');
var walletDeductionSchema = require("../schemas/walletDeduction.js");
var walletDeduction = mongoose.model('walletDeduction',walletDeductionSchema);
var userProfileSchema = require("../schemas/userProfile.js");
var userProfile = mongoose.model('userProfile', userProfileSchema);
var btc = require("../coins/btc.js");
var eth = require("../coins/ethNew.js");
var userSchema = require("../schemas/users.js");
var User = mongoose.model('User', userSchema);
var adminSchema = require("../admin/schemas/admin.js");
var Admin = mongoose.model('Admin', adminSchema);

var save =  function(req, res, data){
  console.log(req.body, req.user.id);
  User.findById(req.user.id, function(err, user){
    Admin.findById('5b4c4a46c0228718a0ae33a5', function(err, adminData){
        if(err || user == null){
          res.json({status:"Unauthorized! make sure you completed First step of profile"});
        }else{
          console.log(req.body.fixedprice, user.myWallet);
          console.log(req.body.fixedprice,  adminData.adminTotalWallet);
          if(req.body.fixedprice <= user.myWallet && req.body.fixedprice <= adminData.adminTotalWallet){
            if(req.body.symbol == 'BTC'){
            //  const txdata =  btc.transferAmount('Arihant1234', '2N8eWmFksoVRioaSdQyzqPmv237F2EJ29A7', req.body.quantity, 1);
            //  console.log(txdata);
            // if(txdata != null){
            var price = req.body.fixedprice.toFixed(2);
                User.findById(req.user.id,   function(err, user){
                  user.myWallet = user.myWallet.toFixed(2)
                var userWallet = parseFloat(user.myWallet) - parseFloat(price);
                  console.log(userWallet);
                    User.findByIdAndUpdate(req.user.id, { myWallet:userWallet.toFixed(2) },   function(err, user){
                    });
                    Admin.findById('5b4c4a46c0228718a0ae33a5',  function(err, admin){
                      admin.adminWallet =  admin.adminWallet.toFixed(2);
                      var adminWallet = parseFloat(admin.adminWallet) + parseFloat(price);
                          Admin.findByIdAndUpdate('5b4c4a46c0228718a0ae33a5', { adminWallet:adminWallet.toFixed(2) },   function(err, admin){
                          });
                        let saveData = new walletDeduction({
                            quantity:req.body.quantity,
                            symbol:req.body.symbol,
                            userId:req.user.id,
                            //createdDate:{type:Date, default:Date.now},
                            fixedprice:req.body.fixedprice,
                            currentprice:req.body.currentprice,
                            txId:"txdata"
                          });
                        saveData.save(function(err){
                          if(err) throw err;
                          else{
                            res.status(200).json({status:"Transaction successful your BTC are on the way"});
                          }
                        });
                      });
                    });
            //   }

            }else if(req.body.symbol == 'ETH'){
              var ethData = config.get('eth');
            // const txdata = eth.transferAmount('2N38M5F14HSFHACRhVSAzqV2HxJkw4S4rdf', '2N2zy8duY9BKwUgzH3phCpr2LDaj5pKzM2c', '0.001', ethData);
            //if(txdata){
            User.findById(req.user.id,  function(err, user){
              user.myWallet = user.myWallet.toFixed(2)
            var userWallet = parseFloat(user.myWallet) - parseFloat(price);
                User.findByIdAndUpdate(req.user.id, { myWallet:userWallet.toFixed(2) },   function(err, user){
                });
                Admin.findById('5b4c4a46c0228718a0ae33a5',  function(err, admin){
                  admin.adminWallet =  admin.adminWallet.toFixed(2);
                  var adminWallet = parseFloat(admin.adminWallet) + parseFloat(price);
                      Admin.findByIdAndUpdate('5b4c4a46c0228718a0ae33a5', { adminWallet:adminWallet.toFixed(2) },   function(err, admin){
                      });
                          let saveData = new walletDeduction({
                              quantity:req.body.quantity,
                              symbol:req.body.symbol,
                              userId:req.user.id,
                              //createdDate:{type:Date, default:Date.now},
                              fixedprice:req.body.fixedprice,
                              currentprice:req.body.currentprice,
                              txId:req.body.txId
                            });
                          saveData.save(function(err){
                            if(err) throw err;
                            else{
                              res.status(200).json({status:"Transaction successful your ETH are on the way"});
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
  walletDeduction.find({ userId:req.user.id},null,{sort:{createdDate: -1}} ,  function(err, users) {
       if (err) {
         console.log(err);
         res.status(500).json({status : "invalid request"});
       }else{
         res.send(users);
       }

    });
}

//module.exports.addWalletSuccess = addWalletSuccess;
module.exports.walletDeduction = save;
module.exports.OrderDataBywallet = OrderDataBywallet;
