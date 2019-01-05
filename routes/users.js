var userModel = require("../models/users.js");
var userProfileModel = require("../models/userProfile.js");
var transcationModel = require("../models/coinTransaction.js");
var addWalletModel = require("../models/addWalletPayment.js");
var walletDeductionModel = require("../models/walletDeduction.js");
var cryptoSellModel = require("../models/cryptoSell.js");
var sendBtcModel = require("../models/sendBtc.js");
var sendEthModel = require("../models/sendEth.js");
var jwttoken = require("../jwttoken.js");
var docUpload = require("../fileUpload.js");
var mailer = require("../mail.js");
var kafka = require("../transaction.js");
var transaction = require("../payment.js");
var btc = require("../coins/btc.js");
var usdt = require("../coins/usdt.js");
var config = require('config');
let { convertETH } = require('cryptocurrency-unit-convert');
var eth = require("../coins/ethNew.js");
var finalize = require("../finalizeTransaction.js");
//var orderData = require("../finalizeTransaction.js").orderData;
let { convert } = require('../helpers/index')
let { dec2hex } = convert;
var request = require("request");
let hexToDec = require('hex-to-dec')

const accessToken = '8521799685.82380de.706bea8c10f84b7a97514ee2c76388e7';

var instaApi = require('instagram-api');
var instaApi = new instaApi(accessToken);


//var fx = require("money");
module.exports= function(app){

  // instagram feed

  app.get('/feed', (req, res) => {
      instaApi.userSelfMedia().then(function(result) {
          // console.log(result.data); // user info
          // console.log(result.limit); // api limit
          // console.log(result.remaining) // api request remaining
          res.status(200).send(result);
      }, function(err){
          //console.log(err); // error info
      });
  })

//registeration

app.post("/registerUser",async function(req,res){
  console.log(req.body);
  userModel.register(req, res);
   // var secretKey = "6LfQ4lUUAAAAAA_XDLT19KGguPWL71D9WcF9e0h4";
   // var verification_url = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body.recaptcha;
   //
   // request(verification_url, function(error,response,body){
   //   console.log(body);
   //     body = JSON.parse(body);
   //   if(body.success == false){
   //     res.json(body);
   //   }else{
   //     userModel.register(req, res);
   //  }
   //
   // });



  });

//login

  app.post("/loginUser",function(req,res){
      console.log(req.body);
      if(req.body.email != ''){
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
  app.get("/ethWallet", jwttoken, function(req,res){
       userModel.ethBalance(req, res);
      //console.log(u);
  });


//save profile step 2

  app.post("/saveProfile",jwttoken,  function(req,res){
    console.log(req.body);
      userProfileModel.saveProfile(req, res);
  });

// transcation

  app.post("/payment",jwttoken,  function(req,res){
      transcationModel.saveTranscation(req,res);
  });

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

  var profile_upload = docUpload.profile_upload.fields([{ name: 'profileImage' }]);

  app.post("/profileUpload", [jwttoken, profile_upload], function(req, res, next){
      console.log(req.files);
      userModel.saveProfile(req,res);

  });

  //user profile edit
  app.post("/useredit", jwttoken, function(req,res){
        userModel.userUpdate(req, res);
  });

  //reset password
  app.post("/resetPassword", jwttoken, function(req,res){

    if(req.body.newpassword == null || req.body.newpassword == " "){
        res.status(200).json({status:"New Password cannot be empty"});
    }else{
        userModel.resetPassword(req, res);
      }
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

  app.get("/test1", async function(req, res){
    //finalize.orderData(req, res);
      let tx = { from, to, value: '0x' + dec2hex(convertETH("0.0001", 'eth', 'wei')) };
    // console.log('');
    //  eth.newAccount('nalini123').then(function(res){
    //    console.log(res);
    //  }).catch(function(err){
    //    console.log(err);
    //  })
    // //eth.createWallet('password');
    // //hexToDec('0x605a47')
    // console.log('');
    // await eth.sendTransaction("0xc7050889e6ccd298b48c8c259f5318545f9f6ff4","0xeb17b7e07af2fd8f5c713f9aa55fcc7f6b5e195a","100000000000000").then( function(res){
    //   console.log(res);
    //
    // }).catch(function(err){ console.log(err)});
    //  await eth.getBalance('0xf098112828ec2645fa86c210f13d47148b21a25c');
  //console.log(hexToDec('0x5ef1db'));
  })

  app.get("/usdtWallet", jwttoken, async function(req, res){
      userModel.usdtBalance(req, res);
    // console.log('');
    //  usdt.getBalance('0x23b2f4222acf90BfCbde18411666588D1BDEaF0d').then(function(balance){
    //    res.status(200).json({usdt:balance});
    //  }).catch(function(err){
    //    console.log(err);
    //  })
    //
    // console.log('');

  })

  app.get("/user", jwttoken, function(req, res){
    userModel.user(req, res);

  })


  app.post("/forgetPasswordReset", function(req, res){
      userModel.forgetPasswordReset(req, res);
  });

  // app.post("/payment", jwttoken,  function(req, res){
  //   console.log(req.body);
  //   transaction(req, res);
  // })

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

  app.post("/sendBtc", jwttoken,  function(req, res){
    console.log(req.body);
    sendBtcModel.sendBtc(req, res);
  });

  app.get("/receiveBtc", jwttoken,  function(req, res){
    sendBtcModel.receiveBtc(req, res);
  });

  app.get("/senderData", jwttoken,  function(req, res){
    sendBtcModel.senderData(req, res);
  });

  app.post("/sendEth", jwttoken,  function(req, res){
    console.log(req.body);
    sendEthModel.sendEth(req, res);
  });

  app.get("/receiveEth", jwttoken,  function(req, res){
    sendEthModel.receiveEth(req, res);
  });

  app.get("/userTransaction", jwttoken,  function(req, res){
    transcationModel.userWiseTranscation(req, res);
  });

  app.post("/addWalletInitial", jwttoken,  function(req, res){
    addWalletModel.saveTranscation(req, res);
  });

  app.post("/addWalletSuccess", jwttoken,  function(req, res){
    addWalletModel.addWalletSuccess(req, res);
  });
  app.post("/balanceTransfer", jwttoken,  function(req, res){
    walletDeductionModel.walletDeduction(req, res);
  });

  app.get("/walletHistory", jwttoken,  function(req, res){
    addWalletModel.walletHistory(req, res);
   });

   app.post("/cryptoSell", jwttoken,  function(req, res){
     cryptoSellModel.cryptoSell(req, res);
    });

    app.get("/cryptoSellHistory", jwttoken,  function(req, res){
      cryptoSellModel.cryptoSellHistory(req, res);
     });

   app.get("/OrderDataBywallet", jwttoken,  function(req, res){
     walletDeductionModel.OrderDataBywallet(req, res);
    });

  app.post("/coinBalance", jwttoken,  function(req, res){
    finalize.coinBalances(req, res);
  });

  app.post("/mobileVerify", jwttoken,  function(req, res){
    userModel.phoneVerify(req, res);
  });

  app.post("/phoneCheck", jwttoken,  function(req, res){
    userModel.phoneCheck(req, res);
  });

  app.get("/enterprises", jwttoken,  function(req, res){
    userModel.enterprises(req, res);
  });

  app.post("/twf", jwttoken,  function(req, res){
    userModel.authentication(req, res);
  });

  app.post("/twofactor", jwttoken,  function(req, res){
    userModel.twofactor(req, res);
  });

  app.post("/payverify", jwttoken,  function(req, res){
    transcationModel.paymentVerification(req,res);
  });

  app.get("/test",  function(req, res){
    userModel.test(req, res);
    // var htmldata = '<table><tr><td><img src="" ></td></tr><tr><td>Welcome </td></tr><tr><td>Thankyou for signup with KopraWallet.</td></tr><tr><td>Please click on the link below</td></tr><tr><td><a href="http://localhost:3000/" >click here</a></td></tr></table>';
    //
    //    console.log(htmldata);
    //           let mailOptions = {
    //           from: "", // sender address
    //           to: 'nickybhati@gmail.com', // list of receivers
    //           subject: 'Successfully registered', // Subject line
    //
    //           html:htmldata // html body
    //       }
    //     mailer(mailOptions);
  });


}
