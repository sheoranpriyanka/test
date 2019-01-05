var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var config = require('config');
var mongo = require('./mongo.js');
var userRoute = require('./routes/users.js');
var adminRoute = require('./admin/routes/adminRoutes.js');
var cors = require('cors');
//console.log(__dirname + '/images');
app.use(express.static(__dirname + '/images'));
//var model = require('./models/users.js');
// var btc = require("./coins/btc.js");
// var ltc = require("./coins/ltc.js");
// var eth = require("./coins/eth.js");
// var xrp = require("./coins/xrp.js");
// var bch = require("./coins/bch.js");
// var eth1 = require("./coins/eth1.js");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(function (req, res, next) {

    // console request data
    //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    //console.log(fullUrl);
   //  var userdata = req.body;
   //
   //
   // // if (config.DEBUG > 0)
   //      console.log('####################################### ' + req.url + ' API IS CALLED WITH DATA: ', userdata);
   //
   //  res.header("Access-Control-Allow-Origin", "*");
   //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		//       console.log('Auth login section');
   //  // check if user is exists or not
   //  next();
    // var currentUser = userdata.sid;
    //
    // if (currentUser != undefined && currentUser != "") {
    //     is_user_exists(currentUser, pool, function (http_status_code, err, response) {
    //
    //         if (err) {
    //             throw err;
    //         }
    //         //console.log(http_status_code);
    //
    //         if (http_status_code == 200) {
    //             // forward to next route
    //             next();
    //         } else {
    //             //if (config.DEBUG == 2) {
    //                 console.log();
    //                 console.log(response);
    //                 console.log();
    //            // }
    //             // invalid login id
    //             res.status(http_status_code).send(response);
    //         }
    //     });
    // } else {
    //     // forward to next route
    //     next();
    // }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();

});
app.listen("5000",function(){
  console.log("LISTENING ON PORT 5000");
});

userRoute(app);
adminRoute(app);
//xrp.createWallet();
//btc.createWallet();
//eth.blockNumber();
//bch.createMultiSigWallet("miiwallet");
//btc.getBalance();
