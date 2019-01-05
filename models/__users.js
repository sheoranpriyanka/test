var mongoose = require('mongoose');
var userSchema = require("../schemas/users.js");
var bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
var User = mongoose.model('User', userSchema);
var mail = require("../mail.js");
var btc = require("../coins/btc.js");
var eth = require("../coins/eth.js");
var async = require('async');
var multer = require('multer');
var authy = require('authy')('kWhUWUbGNO8CzTeHxFhYSLnOX1V6rQuv');
//var jwttok = require("../jwttoken.js");
var registerUser = async function(req, res){
var btc = require("../coins/btc.js");
var walletName = "bitcoin_"+req.body.firstname +"_"+ Date.now() +"_"+ req.body.mobile;
var ethWalletPassword = "ethereum_"+req.body.firstname+"_"+ Date.now();
const btcWallet = await btc.createMultiSigWallet(walletName);
//const ethWallet = await eth.createWallet(ethWalletPassword);
//var ethData = {address: ethWallet, password: ethWalletPassword };
var bitcoinData = {address:btcWallet.address, name: walletName};
//console.log(btcWallet);
console.log(btcWallet);

//registration
var user =  function () {
    var user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email:req.body.email,
    password:req.body.password,
    mobile:req.body.mobile,
    countryCode:req.body.cc,
    wallets:{bitcoin:bitcoinData}
  });
  userSchema.pre('save', function(next) {
    //  var user = this;

      // only hash the password if it has been modified (or is new)
    //  if (!user.isModified('password')) return next();

      // generate a salt
      bcrypt.genSalt(function(err, salt) {
          if (err) return next(err);
          //console.log(salt);
          // hash the password along with our new salt
          bcrypt.hash(req.body.password, salt, function(err, hash) {
              if (err) return next(err);

              // override the cleartext password with the hashed one
              user.password = hash;
              console.log(hash);
              next();
          });
      });
  });

  console.log(user);

  user.save(function(err){
    if(err){
      res.status(400).json({status:'invalid'});
      console.log(err);
    }
    else{
        console.log("saved successfully");
        //email for user registration
        jwt.sign({email:user.email}, 'secretemailtoken',  function(err, token){
          if(err){ throw err;
            // cb(err);
          }else{
             console.log(token);
                   let mailOptions = {
                   from: "", // sender address
                   to: user.email, // list of receivers
                   subject: 'Successfully registered', // Subject line
                   text:'http://'+req.headers.host+'/emailverification?token='+token
                   //html: '<b>Hello world?</b>' // html body
               }
             mail(mailOptions);
             //cb(err, user, token);
             res.send(token);
          }
       });

      res.status(200).json({status:"Successfully Registered Please check Your email for successfully login"});
    }
  });
}
user();

}
// email verification
  var emailVerification = function(req, res){
    jwt.verify(req.body.token,"secretemailtoken",function(err,decode){
      if(err){
        console.log(err.message);
        res.json({status: "Your session has been expired"});

      }else{
        User.findOneAndUpdate({email:decode.email}, {isemail:true}, function(err){
          if(err){
            throw err;
          }else{
            res.json({status:"Email Verified Successfully"});
          }
        });
      }
  });
}

// user login
var loginUser =  function(req, res){

  User.findOne({ email: req.body.email }, function(err, user) {
      console.log(user);
       if (err || user == null ){
         res.status(200).json({status: "Please check your email or password"});

       }else{

       if(user.isemail){

            let isMatch = user.comparePassword(req.body.password);
            console.log(isMatch);
              if(isMatch){
                res.status(200).json({token: jwt.sign({id: user._id}, 'bloodysecret'), user:user });

              }else{
                res.status(200).json({status: "Incorrect Password" });
              }
        }else{
          res.status(200).json({status:"Please verify Your email first"});
        }
      }
    });
}

// login user data
var bitcoinBalance =  function(req, res){
  User.findById(req.user.id, async function(err, user){
      if(err){
        res.status(500).json({status:"Bad Request"});
        console.log(err);
      }else{
        const btcBalance = await btc.getBalance(user.wallets.bitcoin.name);
         res.status(200).json({btc:btcBalance});

      }
  })
}

//Edit login user data
  var update = function(req, res){

    var userUpdate = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        //email: req.body.email,
        mobile: req.body.mobile,
        countryCode: req.body.cc
      };
    User.findByIdAndUpdate(req.user.id, userUpdate,  function (err, user) {
          if (err) {
            console.log(err);
            res.status(500).json({status : "invalid request"});
          }else{
            res.status(200).json({ status: "Updated Successfully" });
          }
       });

 }

//reset password
 var resetPassword =  function(req, res){

   User.findById(req.user.id , function(err, user) {
        if (err) throw err;
            userUpdate = {
              password:req.body.newpassword
            }
            let isMatch ='';
       isMatch = user.comparePassword(req.body.oldpassword);
       console.log(isMatch);
       // generate a salt


       if(isMatch){
         bcrypt.genSalt(function(err, salt) {
             if (err) throw err;

             // hash the password along with our new salt
             bcrypt.hash(userUpdate.password, salt, function(err, hash) {
                 if (err) throw err;

                 // override the cleartext password with the hashed one
                 userUpdate.password = hash;

                User.findByIdAndUpdate(req.user.id, {password:hash},  function (err) {
                      if (err) {
                        console.log(err);
                        res.status(500).json({status : "invalid request"});
                      }else{
                        res.status(200).json({ status: 'Successfully updated' });
                      }
                   });
             });
         });

       }else{
         res.status(200).json({status:"Old Password is Invalid"});
       }

     });
 }

 // forget password
 var forgetPassword = function(req, res){
   console.log(req.body);
     async.waterfall([
     function(cb) {
       User.findOne({
         email: req.body.email
       }, function(err, user) {
         if (user) {
          console.log(user);
          cb(err, user);
         } else {
           res.status(200).json({status: 'User not found.'});
         }
       });
     },

     function(user, cb) {
        // create the random token
           jwt.sign({email:user.email}, 'secretpasswordtoken', { expiresIn: 5 * 60 }, function(err, token){
             if(err){
                cb(err);
             }else{
                console.log(token);
                cb(err, user, token);
                res.status(200).send(token);
             }
          });
      },

     function(user, token, err){

        //reset password email
        let mailOptions = {
             from: "", // sender address
             to: user.email, // list of receivers
             subject: 'Password help has arrived!', // Subject line
             text: 'http://'+req.headers.host+'/emaillink?token='+token // html body
          }
          mail(mailOptions);

       }
   ]);
   }


// forget password reset
   var forgetPasswordReset = function(req, res){

     jwt.verify(req.body.token,"secretpasswordtoken",function(err,decode){
       if(err){
         console.log(err.message);
         res.json({status: err.message});

       }else{

             console.log(decode.email);
             var email = decode.email;
             User.findOne({email:email}, function(err, user){
                if(err){
                    res.json({status:"User not found"});
                }else{
                    bcrypt.genSalt(function(err, salt) {
                        if (err)  throw err;
                 // hash the password along with our new salt
                        bcrypt.hash(req.body.password, salt, function(err, hash) {
                          if (err)  throw err;

                           console.log(hash);
                           var password = hash;

                           User.findOneAndUpdate({email:email}, {password:password}, function(err){
                             if(err){
                               throw err;
                             }else{
                               res.json({status:"password updated successfully"});
                             }
                           });
                         });
                      });
                  }
                });
            }
        });
   }

var user = function(req, res){
//  console.log(req)
  User.findById(req.user.id, function(err, user){
    if(err){
        res.status(500).json({status:"Bad Request"});
    }else{
        res.status(200).send(user);
    }
  });
}

var saveProfile = function(req, res){

  console.log(req.files);
  var profileImages = {

      profileImage:req.files.profileImage[0].filename,

  };
  //var query = {userId : req.user.id };

  User.findByIdAndUpdate(req.user.id, profileImages, function(err){
    if(err){
      res.send(err);
    }
    else{
      res.status(200).json({status: "Profile Updated Successfully"});
    }
  });
}
  var phoneVerify = function(req, res){
    User.findById(req.user.id, function(err, user){
      authy.phones().verification_start(user.mobile, user.countryCode, 'sms' , function(err, data) {
        if(err) console.log(err);
        else{
          res.status(200).json({status:"check your message"});
        }
      });
    })
  }

  var phoneCheck = function(req, res){
    User.findById(req.user.id, function(err, user){
      authy.phones().verification_check(user.mobile, user.countryCode, req.body.verifyCode, function (err, data) {
        console.log(data);
        if(err){ console.log(err);
          if(!err.success){
            res.status(200).json({status:"phone number must be verified"});
          }
        }else{
          res.status(200).json({status:"phone number Verified"});
        }
      });
    })
  }


module.exports.phoneCheck = phoneCheck;
module.exports.phoneVerify = phoneVerify;
module.exports.saveProfile = saveProfile;
module.exports.emailVerification = emailVerification;
module.exports.user = user;
module.exports.forgetPasswordReset = forgetPasswordReset;
module.exports.forgetPassword = forgetPassword;
module.exports.resetPassword = resetPassword;
module.exports.userUpdate = update;
module.exports.bitcoinBalance = bitcoinBalance;
module.exports.register = registerUser;
module.exports.login = loginUser;
