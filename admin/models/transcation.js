var mongoose = require('mongoose');
var transcationSchema = require("../../schemas/coinTransaction.js");
var transcation = mongoose.model('transcation', transcationSchema);
var finalizedPaymentSchema = require("../../schemas/finalizedPayment.js");
var finalizeTransaction = mongoose.model('finalizeTransaction', finalizedPaymentSchema);
var paymentTransitSchema = require("../../schemas/paymentTransit.js")
var paymentTransit = mongoose.model('paymentTransit', paymentTransitSchema);


var txData =  function(req, res){
  //console.log(req.headers);
  var txInterim = [];
  var txFinal = [];
  var finalJson =[];
  // finalJson["interim"] =[];
  // finalJson["final"] = [];
  paymentTransit.find(  function(err, data){
    if(err || data == null ){ throw error
      res.status(200).json({ status: "No transaction Found"});
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

               }
             }

        });

      });
    setTimeout(function(){res.send(finalJson)},3000);

   }
  });

}

module.exports.txData = txData;
