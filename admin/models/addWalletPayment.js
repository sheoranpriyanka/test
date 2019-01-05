var mongoose = require('mongoose');
//var multer = require('multer');
var request = require('request');
var addWalletPaymentSchema = require("../../schemas/addWalletPayment.js");
var userProfileSchema = require("../../schemas/userProfile.js");
var userProfile = mongoose.model('userProfile', userProfileSchema);
var addWalletPayment = mongoose.model('addWallet',addWalletPaymentSchema);
var userSchema = require("../../schemas/users.js");
var User = mongoose.model('User', userSchema);
var adminSchema = require("../../admin/schemas/admin.js");
var Admin = mongoose.model('Admin', adminSchema);
var moment = require('moment');


var walletHistory = function(req, res){
  addWalletPayment.find({ verify:{ $exists: true}},  function(err, users) {
       if (err) {
         console.log(err);
         res.status(500).json({status : "invalid request"});
       }else{
         res.send(users);
       }

    });
}


var geTodayData = function(req, res){
  //var todaysDate = new Date();
  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  var today = moment().startOf('day');
  var tomorrow = moment(today).endOf('day');
  //console.log(startOfToday);
  addWalletPayment.find({createdDate:{$gte:today.toDate(),  $lte: tomorrow.toDate()}}).populate("userId", '-password, -wallets').exec(function (err, user) {
        if (err) {
          console.log(err);
          res.status(500).json({status : "invalid request"});
        }else{

          res.send(user);
        }
     });

}

var getMonthData = function(req, res){
  //var todaysDate = new Date();
  // var now = new Date();
  // var TodayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // var startDate = new Date(now.getFullYear(), now.getMonth(), 2);

  var today = moment().startOf('M');
  var tomorrow = moment(today).endOf('M');

  //console.log(today, tomorrow);
  addWalletPayment.find({createdDate:{$gt:today, $lt:tomorrow  }}).populate("userId", '-password').exec( function (err, user) {
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
      addWalletPayment.find({createdDate:{$gte:today, $lte: tomorrow }}).populate("userId", '-password').exec( function (err, user) {
        if (err) {
          console.log(err);
          res.status(500).json({status : "invalid request"});
        }else{
          res.send(user);
        }
     });

}

module.exports.getWeeklyData = getWeeklyData;
module.exports.geTodayData = geTodayData;
module.exports.getMonthData = getMonthData;
module.exports.walletHistory = walletHistory;
