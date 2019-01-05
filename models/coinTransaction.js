var mongoose = require('mongoose');
var multer = require('multer');
var transcationSchema = require("../schemas/coinTransaction.js");
var userSchema = require("../schemas/users.js");
var User = mongoose.model('User', userSchema);
var transcation = mongoose.model('transcation',transcationSchema);
var userProfileSchema = require("../schemas/userProfile.js");
var userProfile = mongoose.model('userProfile', userProfileSchema);

var paymentVerification = (req, res)=>{
  console.log(req.body);
  userProfile.findOne({userId:req.user.id}).populate("userId").exec(async function(err, user){
    if(req.body.amount.symbol == 'BTC'){
        // balance = await await btc.getBalance("KopraWallet");
        balance = 1000;
    }else if(req.body.amount.symbol == 'ETH'){
         balance = 0;
    }else{
         balance = 0;
    }


    if(err || (user == null)){
      res.status(200).json({status:"Please Complete Your First two steps of Profile verification", type:"no profile verify"});
    }else if(user.userId.step < 2 ){
        res.status(200).json({status:"Please upload your documents", type:"doc not uploaded"});
    }else if(user.doc_verification != 'verified' ){
        res.status(200).json({status:"Your Document Verification is "+ user.doc_verification, type:"doc not verified"});

    }else if(balance < req.body.amount.quantity ){
         res.status(200).json({status:"Provider has not enough balance. contact to admin", type:"no balance"});
     }else{
          res.status(200).json({status:"all clear", type:"doc not verified", valid:true});
    }

  });
}

var saveTranscation =  function(req, res, data){
  console.log(req.body);
  userProfile.findOne({userId:req.user.id}).populate("userId").exec(async function(err, user){
    // if(req.body.amount.symbol == 'BTC'){
    //     // balance = await await btc.getBalance("KopraWallet");
    //     balance = 20;
    // }else if(req.body.amount.symbol == 'ETH'){
    //      balance = 0;
    // }else{
    //      balance = 0;
    // }
    //
    //
    // if(err || (user == null)){
    //   res.status(200).json({status:"Please Complete Your First two steps of Profile verification", type:"no profile verify"});
    // }else if(user.userId.step < 2 ){
    //     res.status(200).json({status:"Please upload your documents", type:"doc not uploaded"});
    // }else if(user.doc_verification != 'verified' ){
    //     res.status(200).json({status:"Your Document Verification is "+ user.doc_verification, type:"doc not verified"});
    //
    // }else if(balance < req.body.amount.quantity ){
    //     res.status(200).json({status:"Provider has not enough balance. contact to admin", type:"no balance"});
    // }else{


      if(req.body.amount.symbol == 'BTC'){

        //  data = await btc.transferAmount('KopraWallet', user.wallets.bitcoin.address, req.body.amount.quantity, 1).then(function(data){
            console.log(data);
            var saveTransit = new transcation({
                gatewayData:req.body.payment,
                coinDetail:req.body.amount,
                userId:req.user.id,
                txId:"data"
            });
            saveTransit.save(function(err){
              if(err) throw err;
              else{
                res.status(200).json({status:"Transaction successful your BTC are on the way", type:"btc transfer success"});
              }
            });
          // //}).catch(function(err){
          //   res.status(200).json({status:"Cannot transfer btc", type:"no eth transfer "});
          //   console.log(err)
        //  })

            //console.log('transfer successful');
       }else if(req.body.amount.symbol == 'ETH'){
          //var ethData = config.get('eth');
          data = eth.sendTransaction('0xc7050889e6ccd298b48c8c259f5318545f9f6ff4', '0x89dA7C5b6292Ea6Bb4E77B3E2eEA6559F220Ee6B', 0.001).then(function(data){
            console.log(data);
            console.log('transfer successful');
            var saveTransit = new transcation({
                gatewayData:req.body.payment,
                coinDetail:req.body.amount,
                userId:req.user.id,
                txId:data
            });
            saveTransit.save(function(err){
              if(err) throw err;
              else{
                res.status(200).json({status:"Transaction successful your ETH are on the way", type:"eth transfer success"});
              }
            });
          }).catch(function(err){
              res.status(200).json({status:"Cannot transfer ethereum", type:"no eth transfer "});
            console.log(err)});

       }else if(coin == "USDT"){
         data = "cdsdc";
       }



            // saveTransit.save(function(err){
            //   if(err){
            //     console.log(err);
            //   }else{
            //     res.status(200).json({status:""})
            //   }
            // });

      //  }
      });

}
var userWiseTranscation = function(req, res){

  transcation.find({userId:req.user.id},null,{sort:{createdDate: -1}} , function(err, data){
      if(err){
        console.log(err);
      }else{

        res.status(200).json(data)
      }
  });
}

module.exports.userWiseTranscation = userWiseTranscation;
module.exports.paymentVerification = paymentVerification;
module.exports.saveTranscation = saveTranscation;
