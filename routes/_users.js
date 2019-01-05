var userModel = require("../models/users.js");
var userProfileModel = require("../models/userProfile.js");
var transcationModel = require("../models/coinTransaction.js");
var jwttoken = require("../jwttoken.js");
var docUpload = require("../fileUpload.js");
var mailer = require("../mail.js");
var kafka = require("../transaction.js");
var transaction = require("../payment.js");
var btc = require("../coins/btc.js");
var usdt = require("../coins/usdt.js");
var config = require('config');
let { convertETH } = require('cryptocurrency-unit-convert');
var eth = require("../coins/eth.js");
var finalize = require("../finalizeTransaction.js");
//var orderData = require("../finalizeTransaction.js").orderData;
let { convert } = require('../helpers/index')
let { dec2hex } = convert;
let hexToDec = require('hex-to-dec')
//var fx = require("money");
module.exports= function(app){

//registeration

  app.post("/registerUser",function(req,res){
    console.log(req.body);
      userModel.register(req, res);

  });

//login

  app.post("/loginUser",function(req,res){
      console.log(req.body);
      if(req.email != ''){
        userModel.login(req, res);
      }else{
        res.send('Email is Blank');
      }

  });



  // app.post("/user", jwttoken, function(req,res){
  //   res.status(200).send(req.user);


  app.get("/wallet", jwttoken, function(req,res){
       userModel.bitcoinBalance(req, res);
      //console.log(u);
  });


//save profile step 2

  app.post("/saveProfile",jwttoken,  function(req,res){
    console.log(req.body);
      userProfileModel.saveProfile(req, res);
  });

// transcation

  // app.post("/cointransaction",jwttoken,  function(req,res){
  //     transcationModel.saveTranscation(req,res);
  // });

//document upload

  var cpUpload = docUpload.doc_upload.fields([{ name: 'id_proof_front' }, { name: 'id_proof_back'}]);
  app.post("/profileDocUpload", [jwttoken, cpUpload ], function(req,res, next ){
      userProfileModel.saveProfile_s2(req,res);
  });

//selfie upload

  var selfie_upload = docUpload.selfie_upload.fields([{ name: 'selfie' }]);
  app.post("/profileSelfieUpload", [jwttoken, selfie_upload], function(req, res, next){
      userProfileModel.saveSelfie(req,res);

  });

  //user profile edit
  app.post("/useredit", jwttoken, function(req,res){
        userModel.userUpdate(req, res);
  });

  //reset password
  app.post("/resetPassword", jwttoken, function(req,res){
        userModel.resetPassword(req, res);
  });

  app.post("/forgetPassword", function(req,res){
        userModel.forgetPassword(req, res);
  });

  app.get("/userProfile", jwttoken, function(req,res){
        userProfileModel.userProfileData(req, res);
  });
  app.get("/orderData",jwttoken, function(req, res){
    finalize.orderData(req, res);
    //usdt.unlockAccount("0x34d3f4041260c8d8482c349951a9cd0e2a3eeafe","password");
    // //console.log(dec2hex(10000));
    // var options = {
    //     address:"0x4936be4480d6d9935a291caa46e6ae736c7fd1a5",
    //     amount:"1"
    // };
    // var a = usdt.transferAmount("0x34d3f4041260c8d8482c349951a9cd0e2a3eeafe", "password", options).then(function(res){console.log(res);}).catch(function(err){console.log(err)});
    // //var ethData = config.get('eth');
    //console.log(a);
    //var data = eth.getBalance("0xdba58be2940d46d5c7b49cdd83177e06619b8ad");
  //var  data = eth.getBalance('0x4936be4480d6d9935a291caa46e6ae736c7fd1a5');
    //let tx = { value: '0x' + dec2hex(convertETH("0.5", 'eth', 'wei')) };
    //console.log(data);
    // fx.base ="USD";
    // var a =  fx.convert(1000, {from: "USD", to: "EUR"});
  })

  app.get("/test1", function(req, res){
    //finalize.orderData(req, res);
  
//  eth.createWallet('password');
console.log(hexToDec('0x5ef1db'));
  })

  app.get("/user", jwttoken, function(req, res){
    userModel.user(req, res);

  })


  app.post("/forgetPasswordReset", function(req, res){
      userModel.forgetPasswordReset(req, res);
  });

  app.post("/payment", jwttoken,  function(req, res){
    console.log(req.body);
    transaction(req, res);
  })

  app.post("/finalizeTransaction",jwttoken, async function(req, res){
  //  console.log(btc);
    //await kafka.initialConsumer(req, res);
    //await kafka.secondConsumer(req);
    //kafka.consume(res);
    console.log(req.body);
    finalize.verifyTransaction(req,res);

  });

  app.post("/emailverify", function(req, res){
      userModel.emailVerification(req, res);
  });



  app.get("/userTransaction", jwttoken,  function(req, res){
    transcationModel.userWiseTranscation(req, res);
  });
}
