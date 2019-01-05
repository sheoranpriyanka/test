var mongoose = require('mongoose');
var request = require('request');

var cryptoSellSchema = require("../../schemas/cryptoSell.js");
var cryptoSellmodel = mongoose.model('cryptoSell',cryptoSellSchema);
var moment = require('moment');

var SellData = function(req, res){
  cryptoSellmodel.find().populate('userId', '-password').exec( function(err, data) {
       if (err) {
         console.log(err);
         res.status(500).json({status : "invalid request"});
       }else{
         res.send(data);
       }

    });
}
var geTodayData = function(req, res){

  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  var today = moment().startOf('day');
  var tomorrow = moment(today).endOf('day');
  //console.log(startOfToday);
  cryptoSellmodel.find({createdDate:{$gte:today.toDate(),  $lt: tomorrow.toDate()}}).populate("userId", '-password').exec(function (err, user) {
        if (err) {
          console.log(err);
          res.status(500).json({status : "invalid request"});
        }else{
          res.send(user);
        }
     });

}

var getMonthData = function(req, res){

  var today = moment().startOf('M');
  var tomorrow = moment(today).endOf('M');

  //console.log(today, tomorrow);
  cryptoSellmodel.find({createdDate:{$gt:today, $lt:tomorrow  }}).populate("userId", '-password').exec( function (err, user) {
        if (err) {
          console.log(err);
          res.status(500).json({status : "invalid request"});
        }else{
          res.send(user);
        }
     });
}

var getWeeklyData = function(req, res){
  //var todaysDate = new Date();
   var d = new Date();

    var today = moment().startOf('w');
    var tomorrow = moment(today).endOf('w');
   // var day = d.getDay(),
   //   diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
   //   var TodayDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
   //    var startDate = new Date(d.getFullYear(), d.getMonth(), diff);


        //  console.log(today, tomorrow);
          cryptoSellmodel.find({createdDate:{$gte:today, $lte: tomorrow }}).populate("userId", '-password').exec( function (err, user) {
        if (err) {
          console.log(err);
          res.status(500).json({status : "invalid request"});
        }else{
          res.send(user);
        }
     });

}


module.exports.sellTodayData = geTodayData;
module.exports.sellMonthData = getMonthData;
module.exports.sellWeeklyData = getWeeklyData;

module.exports.SellData = SellData;
