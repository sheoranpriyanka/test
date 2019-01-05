var mongoose = require('mongoose');
var geoip = require('geoip-lite');
var requestIp = require('request-ip');
var country = require('./country/default.json');
var request = require('request');
var userProfileSchema = require("./schemas/userProfile.js");
var paymentTransitSchema = require("./schemas/paymentTransit.js")
var userProfile = mongoose.model('userProfile', userProfileSchema);
var paymentTransit = mongoose.model('paymentTransit', paymentTransitSchema);
var btc = require("./coins/btc.js");
var eth = require("./coins/ethNew.js");
//var kafka = require("./transaction.js");

var payment = function(req, res){
var ip =  requestIp.getClientIp(req);
var hasCountry = null;
var commission = req.body.fixedprice * 0.039;
var fixedPrice = parseFloat(req.body.fixedprice) + parseFloat(commission);
console.log(fixedPrice);
var geo = geoip.lookup('5.159.248.0');
//console.log(geo);
Object.keys(country).forEach(function(key){
  //console.log(key, country[key]);
  if(key == req.body.currency){
     hasCountry = country[key];
  }

});
console.log(hasCountry);
  if(hasCountry){
      var balance = 0;
    userProfile.findOne({userId:req.user.id}).populate("userId").exec(async function(err, user){
      if(req.body.symbol == 'BTC'){
           balance = await await btc.getBalance("KopraWallet");
      }else if(req.body.symbol == 'ETH'){
           balance = 0;
      }else{
           balance = 0;
      }


      console.log(balance);
      if(err || (user == null)){
        res.status(200).json({status:"Please Complete Your First two steps of Profile verification", type:"no profile verify"});
      }else if(user.userId.step < 2 ){
          res.status(200).json({status:"Please upload your documents", type:"doc not uploaded"});
      }else if(user.doc_verification != 'verified' ){
          res.status(200).json({status:"Your Document Verification is "+ user.doc_verification, type:"doc not verified"});

      }else if(balance < req.body.quantity ){
          res.status(200).json({status:"Provider has not enough balance. contact to admin", type:"no balance"});
      }else{
                var orderId = Date.now();
                var args = {
                    merchantId: '2KRSNVRT569AFZ5M5QR456M8NJ6FUFB6',
                    amount:fixedPrice,
                    fromCurrencyCode:'978',
                    toCurrencyCode:hasCountry,
                    orderNumber:orderId,
                    callback:'http://localhost:3000/status',
                    firstName:user.userId.firstname,
                    lastName:user.userId.lastname,
                    email:user.userId.email,
                    mobile:user.userId.mobile,
                    address:user.address,
                    country:user.country,
                    postalCode:user.pincode,
                    city:user.city,
                    description:req.body.symbol
              };
            args = JSON.stringify(args);
            //console.log(args);
            var options = {
              method:"POST",
              url:"https://gate.yekpay.com/api/payment/request",
              headers:{
            						"Content-Type": "application/json"
            					},
              body:args
            };
            //console.log(args);
            request(options, function(error, response, body){
              console.log(body);

              var saveTransit = new paymentTransit({
                gatewayData:JSON.parse(body),
                coinDetail:req.body,
                userId:req.user.id
              });

              saveTransit.save(function(err){
                console.log(err);
              });
              res.send(body);
               // body = JSON.parse(body);
               // var authority = JSON.stringify(body.Authority);
               // if(body.Code == 100){
               //  payGatewayData = {"authority": authority, "merchantId": "2KRSNVRT569AFZ5M5QR456M8NJ6FUFB6", "user":req.user.id};
               //  kafka.initiate(req, res, payGatewayData );
               // }

            });
          }
        });
      }else{
        res.json({status:"unauthorized"});
      }

}
//bitcoin_nikki_21_9876543121
//2N8BYFXpXJFhwtqsbfw96oY89nxZ2REusJz
module.exports = payment;
