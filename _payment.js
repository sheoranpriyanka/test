var mongoose = require('mongoose');
var geoip = require('geoip-lite');
var requestIp = require('request-ip');
var country = require('./country/default.json');
var request = require('request');
var userProfileSchema = require("./schemas/userProfile.js");
var paymentTransitSchema = require("./schemas/paymentTransit.js")
var userProfile = mongoose.model('userProfile', userProfileSchema);
var paymentTransit = mongoose.model('paymentTransit', paymentTransitSchema);
//var kafka = require("./transaction.js");

var payment = function(req, res){
var ip =  requestIp.getClientIp(req);
var hasCountry = null;
//console.log(req.headers);
var geo = geoip.lookup('5.159.248.0');
//console.log(geo);
Object.keys(country).forEach(function(key){
  //console.log(key, country[key]);
  if(key == geo.country){
     hasCountry = '978';
  }
});
  if(hasCountry){
    userProfile.findOne({userId:req.user.id}).populate("userId").exec(function(err, user){

      if(err || (user == null)){
        res.status(200).json({status:"Please Complete Your First two steps of Profile verification"});
      }else if(user.userId.step < 2 ){
          res.status(200).json({status:"Please upload your documents"});
      }else if(user.doc_verification != 'verified' ){
          res.status(200).json({status:"Your Document Verification is "+ user.doc_verification});
      }else{
                var orderId = Date.now();
                var args = {
                    merchantId: '2KRSNVRT569AFZ5M5QR456M8NJ6FUFB6',
                    amount:req.body.fixedprice,
                    fromCurrencyCode:hasCountry,
                    toCurrencyCode:'364',
                    orderNumber:orderId,
                    callback:'https://localhost:3000/status',
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
