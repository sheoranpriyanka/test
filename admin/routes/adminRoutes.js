var adminModel = require("../models/admin.js");
var jwttoken = require("../../jwttoken.js");
var userModel = require("../models/user.js");
var transcModel = require("../models/transcation.js");
var addWalletModel = require("../models/addWalletPayment.js");
var walletDeductionModel = require("../models/walletDeduction.js");
var cryptoSellModel = require("../models/cryptoSell.js");
module.exports= function(app){

    app.post("/admin", function(req, res){
      adminModel.login(req, res);
    });

    app.get("/admin/adminData",jwttoken, function(req, res){
      adminModel.adminData(req, res);
    });

    app.post("/adminRegister", function(req, res){
      adminModel.register(req, res);
    });

    app.get("/admin/users", jwttoken, function(req, res){
      userModel.getAllUser(req, res);
    });

    app.get("/admintest", jwttoken, function(req, res){
        res.send(req.user);
    });

    app.get("/admin/user/:user_id", jwttoken, function(req, res){
        userModel.getById(req, res);
    });

    app.post("/admin/userUpdate/:user_id", jwttoken, function(req, res){
        userModel.update(req, res);
    });

    app.get("/admin/todayData", jwttoken, function(req, res){
        userModel.geTodayData(req, res);
    });

    app.get("/admin/userRemove/:user_id", jwttoken, function(req, res){
        userModel.removeUser(req, res);
    });

    app.post("/admin/userapproval/", jwttoken, function(req, res){
        userModel.approval(req, res);
    });

    app.post("/admin/docVerification/", jwttoken, function(req, res){
      console.log(req.body);
        userModel.verification(req, res);
    });

    app.get("/admin/getProfileData/:id", jwttoken, function(req, res){
        userModel.getProfileData(req, res);
    });

    app.get("/admin/transcation/", jwttoken, function(req, res){
        transcModel.txData(req, res);
    });

    app.get("/admin/getProfileData/", function(req, res){
        userModel.getAllprofile(req, res);
    });

    app.post("/admin/enterprise/", function(req, res){
        userModel.enterpriseApproval(req, res);
    });

    // buy crypto from wallet apis
    app.get("/admin/OrderDataBywallet", function(req, res){
      walletDeductionModel.OrderDataBywallet(req, res);
    });

    app.get("/admin/buyCryptoMonthData", function(req, res){
      walletDeductionModel.buyMonthData(req, res);
    });

    app.get("/admin/buyCryptoTodayData", function(req, res){
      walletDeductionModel.buyTodayData(req, res);
    });

    app.get("/admin/buyCryptoWeekData", function(req, res){
      walletDeductionModel.buyWeeklyData(req, res);
    });

    // crypto sell apis
    app.get("/admin/SellData", function(req, res){
      cryptoSellModel.SellData(req, res);
    });

    app.get("/admin/sellTodayData", function(req, res){
      cryptoSellModel.sellTodayData(req, res);
    });

    app.get("/admin/sellMonthData", function(req, res){
      cryptoSellModel.sellMonthData(req, res);
    });

    app.get("/admin/sellWeekData", function(req, res){
      cryptoSellModel.sellWeeklyData(req, res);
    });


    //add wallet apis
    app.get("/admin/walletHistory", function(req, res){
      addWalletModel.walletHistory(req, res);
    });

    app.get("/admin/addWalletMonthData", function(req, res){
      addWalletModel.getMonthData(req, res);
    });

    app.get("/admin/addWalletTodayData", function(req, res){
      addWalletModel.geTodayData(req, res);
    });

    app.get("/admin/addWalletWeekData", function(req, res){
      addWalletModel.getWeeklyData(req, res);
    });
}
