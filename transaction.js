var request = require('request');
var btc = require("./coins/btc.js");
var eth = require("./coins/eth.js");
//var usdt = require("./coins/usdt.js");
var secondPhase ="";
var transcModel = require("./models/coinTransaction.js");
var user = require("./models/users.js");
const config = require('config');
var initiateStateProducer = function(req, res, GatewayData){
  //console.log(GatewayData);
  var kafka = require('kafka-node'),
        HighLevelProducer = kafka.HighLevelProducer,
        client = new kafka.Client(),
        producer = new HighLevelProducer(client);
        var msg = { "amountData" : req.body, "GatewayData":GatewayData};
        msg = JSON.stringify(msg);
        console.log(msg);
        var payloads = [{topic:'initialPhase3', messages:msg}];
          //payloads = JSON.stringify(payloads);
        producer.on('ready', function (err) {

        producer.send(payloads, function (err, data) {

        console.log(data);
          //res.send(data);
        });
      });

      producer.on('error', function (err) {
        console.log(err);
      });
}


var consumeInitialState = function(req,res){
  var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(),
    consumer = new Consumer(client,
        [{ topic: 'initialPhase3', partition:0}],
        {
            autoCommit: true
        }
    );
    //console.log('dsadas');
consumer.on('message', function (message) {
    console.log(message);

    var jsonData = JSON.parse(message.value);
    secondPhase = message.value;
    console.log(jsonData);
    var coin = jsonData.amountData.symbol;
    var args = JSON.stringify(jsonData.GatewayData);
    var options = {
      method:"POST",
      url:"https://gate.yekpay.com/api/payment/verify",
      headers:{
                "Content-Type": "application/json"
              },
      body:args
    }
      console.log(coin);
      request(options, async function(error, response, body){
      console.log(body);


      if(body.success != 1){
          var data = '';
          if(coin == 'BTC'){
              data = await btc.transferAmount('bitcoin_nikki_21_9876543121', '2MsnKA4vfmFnEXtafSV4HjVK78wk4hjQ2kb', 0.001, 1);
                //console.log('transfer successful');
           }else if(coin == 'ETH'){
              var ethData = config.get('eth');
              data = eth.transferAmount('2N38M5F14HSFHACRhVSAzqV2HxJkw4S4rdf', '2N2zy8duY9BKwUgzH3phCpr2LDaj5pKzM2c', '0.001', ethData);
                //console.log('transfer successful');
           }else if(coin == "USDT"){
             data = "cdsdc";
           }
            secondPhaseProducer(body, data);
          // res.send(message);
      }else{
        res.send(body);
      }
    });

});

  consumer.on('error', function (err) {
      console.log('Error:',err);
  })

  consumer.on('offsetOutOfRange', function (err) {
      console.log('offsetOutOfRange:',err);
  })
}
// consumer.removeTopics(['msg'], function (err, removed) {
//   console.log(removed);
// });
var secondPhaseProducer = function(arg, tx){
  var kafka = require('kafka-node'),
        HighLevelProducer = kafka.HighLevelProducer,
        client = new kafka.Client(),
        producer = new HighLevelProducer(client);
        secondPhase = JSON.parse(secondPhase);
        arg = JSON.parse(arg);
        
        var msg = {coin:secondPhase, payment:arg, tx:tx};
        msg = JSON.stringify(msg);
        var payloads = [{topic:"secondPhase3", messages:msg}];
        producer.on('ready', function (err) {
          //console.log('to hell with u');
          producer.send(payloads, function (err, data) {

            console.log(data);
            //res.send(data);
          });
        });

}

var secondePhaseConsumer = function(req, res){
  var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(),
    consumer = new Consumer(client,
        [{ topic: 'secondPhase3', partition:0}],
        {
            autoCommit: true
        }
    );

consumer.on('message', function (message) {
    console.log(message);
    //res.send(message);
    transcModel.saveTranscation(req, res, message.value);
});

consumer.on('error', function (err) {
    console.log('Error:',err);
  })

consumer.on('offsetOutOfRange', function (err) {
    console.log('offsetOutOfRange:',err);
  })
}

module.exports.initiate = initiateStateProducer;
module.exports.initialConsumer = consumeInitialState;
module.exports.secondConsumer = secondePhaseConsumer;
