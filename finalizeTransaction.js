var mongoose = require('mongoose');
var request = require('request');
var btc = require("./coins/btc.js");
var eth = require("./coins/ethNew.js");
const config = require('config');
var finalizedPaymentSchema = require("./schemas/finalizedPayment.js");
var finalizeTransaction = mongoose.model('finalizeTransaction', finalizedPaymentSchema);
var paymentTransitSchema = require("./schemas/paymentTransit.js")
var paymentTransit = mongoose.model('paymentTransit', paymentTransitSchema);
var userSchema = require("./schemas/users.js");
var User = mongoose.model('User', userSchema);

var verifyTransaction = function(req,res){
  var args = {
    merchantId:'2KRSNVRT569AFZ5M5QR456M8NJ6FUFB6',
    authority:req.body.authority
  }
  var options = {
    method:"POST",
    url:"https://gate.yekpay.com/api/payment/verify",
    headers:{
              "Content-Type": "application/json"
            },
    body:JSON.stringify(args)
  };

    request(options, function(error, response, body){
    console.log(body);
    body = JSON.parse(body);

    if(body.Success == 1){
        var data = '';
        paymentTransit.findOne({'gatewayData.Authority':req.body.authority},  function(err, coinData){
            User.findById(req.user.id, async function(err, user){
          //console.log(coinData.coinDetail.symbol);
        if(req.body.symbol == 'BTC'){

            data = await btc.transferAmount('KopraWallet', user.wallets.bitcoin.address, coinData.coinDetail.quantity, 1);
            console.log(data);
            let saveData = new finalizeTransaction({
              authority:req.body.authority,
              txId:data,
              verificationStatus:req.body.status,
              userId:req.user.id
            });
            saveData.save(function(err){
              if(err) throw err;
              else{
                res.status(200).json({status:"Transaction successful your BTC are on the way", type:"btc transfer success"});
              }
            });
              //console.log('transfer successful');
         }else if(req.body.symbol == 'ETH'){
            //var ethData = config.get('eth');
            data = eth.sendTransaction('0xc7050889e6ccd298b48c8c259f5318545f9f6ff4', '0x89dA7C5b6292Ea6Bb4E77B3E2eEA6559F220Ee6B', '0.001').then(function(data){
              console.log(data);
              console.log('transfer successful');
              let saveData = new finalizeTransaction({
                authority:req.body.authority,
                txId:'',
                verificationStatus:req.body.status,
                userId:req.user.id
              });
              saveData.save(function(err){
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
        //  res.send(message);
      });
      });
    }else{
      res.send(body);
    }
  });
}

var orderData =  function(req, res){
  var txInterim = [];
  var txFinal = [];
  var finalJson = [];
  // finalJson["interim"] =[];
  // finalJson["final"] = [];
  paymentTransit.find({userId: req.user.id},  function(err, data){
    if(err || data == null ){ throw error
      res.status(200).json({ status: "No transaction Found", type:"no transaction"});
    }else{
    txInterim = data;
      //console.log(data);
       data.map(function(doc) {
          //console.log(doc.gatewayData.Authority);
           finalizeTransaction.find({authority: doc.gatewayData.Authority}).then(function(docs) {
             if(docs.length > 0) {
             //txFinal.push(docs);
                //console.log(doc)
               if(doc.gatewayData.Authority == docs[0].authority){
                 var data1 = {interim:doc, final:docs[0]};
                 finalJson.push(data1);
                 //console.log(data1);
                 //finalJson.final.push(docs[0]);

               }
             }
            // doc.transaction = docs;

          // docs contains your answer
          //console.log(data);
        });
        //console.log(txData);
      });
    setTimeout(function(){res.send(finalJson)},3000);
     //    finalizeTransaction.find({authority: {$in: authorities}}, function(err, docs) {
     //      console.log(docs);
     //
     //   // docs contains your answer
     // });
   }
  });

  // console.log(txInterim);
  // txInterim.map(function(data){
  //   txFinal.map(function(data1){
  //     if(data.gatewayData.Authority == data1.authority){
  //       finalJson.interim.push(data);
  //       finalJson.final.push(data1);
  //     }
  //   });
  // });
  //console.log(finalJson);

}

var coinBalances =  function(req, res){
      User.findById(req.user.id, async function(err, user){
        if(err) console.log(err);
        if(user.wallets.bitcoin.name !== undefined){
          const btcBalances =  await btc.getBalance(user.wallets.bitcoin.name);
           res.status(200).json({btc:btcBalances, eth:"0", usdt:"0"});
        }else{
          var btcBalances = "0";
        }


      });
}
module.exports.coinBalances = coinBalances;
module.exports.orderData = orderData;
module.exports.verifyTransaction = verifyTransaction
