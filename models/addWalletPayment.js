var mongoose = require('mongoose');
//var multer = require('multer');
var request = require('request');
var addWalletPaymentSchema = require("../schemas/addWalletPayment.js");
var userProfileSchema = require("../schemas/userProfile.js");
var userProfile = mongoose.model('userProfile', userProfileSchema);
var addWalletPayment = mongoose.model('addWallet',addWalletPaymentSchema);
var userSchema = require("../schemas/users.js");
var User = mongoose.model('User', userSchema);
var adminSchema = require("../admin/schemas/admin.js");
var Admin = mongoose.model('Admin', adminSchema);

var saveTranscation =  function(req, res, data){
  console.log(req.body);
  User.findOne({_id:req.user.id}).exec(function(err, user){

    if(err || user == null){
      res.json({status:"user not found"});

     }else{
            var saveTransit = new addWalletPayment({
                gatewayData:req.body.payment,
                coinDetail:req.body.amount,
                userId:req.user.id
            });

            saveTransit.save(function(err){
              console.log(err);
            });
                var amount = req.body.amount.total.toFixed(2);
                //console.log(coinData.coinDetail.amount);
                User.findById(req.user.id,   function(err, user){
                  user.myWallet = user.myWallet.toFixed(2);
                var userWallet = parseFloat(user.myWallet) + parseFloat(amount);
                console.log(userWallet);
                    User.findByIdAndUpdate(req.user.id, { myWallet:userWallet.toFixed(2) },   function(err, user){
                    });
                    Admin.findById('5b4c4a46c0228718a0ae33a5',  function(err, admin){
                    admin.adminWallet =  admin.adminWallet.toFixed(2);
                      var adminWallet = parseFloat(admin.adminWallet) + parseFloat(amount);
                          Admin.findByIdAndUpdate('5b4c4a46c0228718a0ae33a5', { adminTotalWallet:adminWallet.toFixed(2) },   function(err, admin){
                          });

                    if(err){
                      console.log(err) ;
                    }else{
                      res.status(200).json({status:req.body.amount.total+" is added to Your Wallet"});
                    }
                  });
                });

        }
      });
}


var addWalletSuccess = function(req, res){

          addWalletPayment.findOneAndUpdate({gatewayData:req.body.authority}, updateData, function(err, coinData){
            console.log(coinData);
            if(err){ throw err;
            }else{
              //console.log(coinData.coinDetail.amount);
                User.findByIdAndUpdate(req.user.id, { $inc: {myWallet:req.body.authority}},  function(err, data){
                  Admin.findByIdAndUpdate('5b4c4a46c0228718a0ae33a5', { $inc: {adminTotalWallet:req.body.authority }},  function(err, data){

                  if(err){
                    throw err;
                  }else{
                    res.status(200).json({status:req.body.authority+" is added to Your Wallet"});
                  }
                });
              });
            }
          });

}

var walletHistory = function(req, res){
  addWalletPayment.find({ userId:req.user.id },null, {sort:{createdDate:-1}},  function(err, users) {
       if (err) {
         console.log(err);
         res.status(500).json({status : "invalid request"});
       }else{
         res.send(users);
       }

    });
}

module.exports.addWalletSuccess = addWalletSuccess;
module.exports.saveTranscation = saveTranscation;
module.exports.walletHistory = walletHistory;


// address: {…}
// ​​
// city: "Jaipur"
// ​​
// country_code: "IN"
// ​​
// line1: "86/124 kumbha marg pratap nagar sanganer"
// ​​
// postal_code: "302033"
// ​​
// recipient_name: "Anirudh Sharma"
// ​​
// state: "Rajasthan"
// ​​
// <prototype>: Object { … }
// ​
// cancelled: false
// ​
// email: "inception206@gmail.com"
// ​
// paid: true
// ​
// payerID: "3Q8SRTVDWXGHY"
// ​
// paymentID: "PAY-7D201131HD568680NLPCDYEY"
// ​
// paymentToken: "EC-15435635GB297301Y"
// ​
// returnUrl: "https://www.sandbox.paypal.com/?paymentId=PAY-7D201131HD568680NLPCDYEY&token=EC-15435635GB297301Y&PayerID=3Q8SRTVDWXGHY"
