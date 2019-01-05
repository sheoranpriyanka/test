var mongoose = require('mongoose');
var userSchema = require("../schemas/users.js");
var bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
var User = mongoose.model('User', userSchema);
var mail = require("../mail.js");
var btc = require("../coins/btc.js");
var eth = require("../coins/ethNew.js");
var async = require('async');
var multer = require('multer');
var authy = require('authy')('D5PCZmZ8Jil4KpwzNRDZ8AL3HjF9NGdI');
var usdt = require("../coins/usdt.js");
//var jwttok = require("../jwttoken.js");

var registerUser = async function(req, res){
var btc = require("../coins/btc.js");
var walletName = "bitcoin_"+req.body.firstname +"_"+Date.now();
var ethWalletPassword = "ethereum_"+req.body.firstname+"_"+Date.now();
var userProfileSchema = require("../schemas/userProfile.js");
var userProfile = mongoose.model('userProfile',userProfileSchema);

//app.post('/auth',
    //bruteforce.prevent, // error 429 if we hit this route too often
    // function (req, res, next) {
    //     res.send('Success!');
    // }
//);

//const btcWallet = await btc.createMultiSigWallet(walletName);
var ethData = '';
//  await eth.newAccount(ethWalletPassword).then(function(addr){
// //   console.log(addr);
//      ethData = {address: addr, password: ethWalletPassword };
// //     console.log(ethData);
//  }).catch(function(err){
// //     console.log(err);
//      ethData = {address:'', password:'' }
//  })

var bitcoinData = '';//{address:btcWallet.address, name: walletName};
//console.log(btcWallet);
//console.log(btcWallet);

//registration
var user =  function () {
    var user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email:req.body.email,
    password:req.body.password,
    //mobile:req.body.mobile,
  //countryCode:req.body.cc,
    wallets:{bitcoin:bitcoinData, ethereum:ethData}
  });
  User.findOne({email:req.body.email}, function(err, data){
    if(err || data != null){
        res.status(200).json({status:"This email already exists", type:"register.email.exist"});
    }else{


  userSchema.pre('save', function(next) {
    //  var user = this;

      // only hash the password if it has been modified (or is new)
      // if (!user.isModified('password')) return next();

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
            var htmldata =  '<table cellpadding="5" cellspacing="5"><tr><td></td></tr><tr><td>Hi '+req.body.firstname+' </td></tr><tr><td>Thankyou for signup with KopraWallet.</td></tr><tr><td>Please click on the link below</td></tr><tr><td><a href="http://localhost:3000/emailverification?token='+token+'" >click here</a></td></tr><tr><td><br><br><br>Regards: <br>KopraWallet Team</td></tr></table>';

             console.log(token);
                   let mailOptions = {
                   from: "techkopra1@gmail.com", // sender address
                   to: user.email, // list of receivers
                   subject: 'Welcome to KopraWallet', // Subject line

                   html:htmldata // html body
               }
             mail(mailOptions);
             //cb(err, user, token);
             res.send(token);
          }
       });

      res.status(200).json({status:"Thank You for Your Registration. Please Check The Verification Email To Login", type:"register.success"});
    }
  });
}

})
}
user();

}
// email verification
  var emailVerification = function(req, res){
    jwt.verify(req.body.token,"secretemailtoken",function(err,decode){
      if(err){
        console.log(err.message);
        res.json({status: "Your session has expired", type:"email.verify.fail"});

      }else{
        User.findOneAndUpdate({email:decode.email}, {isemail:true}, function(err){
          if(err){
            throw err;
          }else{

            res.json({status:"Welcome To KopraWallet. Your Email Has Been Verified Successfully", type:"email.verify.success"});
          }
        });
      }
  });
}

// user login
var loginUser =  function(req, res){

  User.findOne({ email: req.body.email },'-wallets', function(err, user) {
          console.log(user);
       if (err || user == null ){
         res.status(200).json({status: "Please check your email or password", type:"login.email.invalid"});

       }else{

       if(user.isemail){

            let isMatch = user.comparePassword(req.body.password);
            console.log(isMatch);
            user.password = undefined;
              if(isMatch){
                if(user.isAuthy){
                  //  console.log(user.mobile, user.countryCode);
                  userProfile.findOne({ userId: user._id }, function(err, userprofile) {
                    if(userprofile != null){
                      authy.phones().verification_start(userprofile.mobile, userprofile.countryCode, 'sms' , function(err, data) {
                        if(err) console.log(err);

                      });
                    }
                  });
                }

                res.status(200).json({token: jwt.sign({id: user._id}, 'bloodysecret',{ expiresIn: 5 * 60 * 60 } ), user:user });

              }else{
                res.status(200).json({status: "Incorrect Password", type:"login.password.invalid" });
              }
        }else{
          res.status(200).json({status:"Please verify Your email first", type:"login.email.verify"});
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
      //  const btcBalance = await btc.getBalance(user.wallets.bitcoin.name);
          var btcBalance = 0;
         res.status(200).json({btc:btcBalance});

      }
  })
}


var ethBalance =  function(req, res){
  User.findById(req.user.id, async function(err, user){
      if(err){
        res.status(500).json({status:"Bad Request"});
        console.log(err);
      }else{
      //  console.log()
        await eth.getBalance('0x0738a2919e1dA1d87aDf767be96268472AA50e56').then(function(balance){
          res.status(200).json({eth:balance});
        }).catch(function(err){
          res.status(200).json({status:"Ethereum wallet not found", type:"no ethwallet"});
          console.log(err);
        })
      }
  })
}

var usdtBalance =  function(req, res){
  User.findById(req.user.id, function(err, user){
      if(err){
        res.status(500).json({status:"Bad Request"});
        console.log(err);
      }else{
      //  console.log()
        usdt.getBalance(user.wallets.ethereum.address).then(function(balance){
          res.status(200).json({usdt:balance});
        }).catch(function(err){
          console.log(err);
        })
      }
  })
}

//Edit login user data
  var update = function(req, res){

    var userUpdate = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        //email: req.body.email,
        //mobile: req.body.mobile,
        countryCode: req.body.cc
      };
    User.findByIdAndUpdate(req.user.id, userUpdate,  function (err, user) {
          if (err) {
            console.log(err);
            res.status(500).json({status : "invalid request"});
          }else{
            res.status(200).json({ status: "Updated Successfully", type:"update.success" });
          }
       });

 }

//reset password
 var resetPassword =  function(req, res){
   console.log(req.body);
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
                        res.status(200).json({ status: 'Updated Successfully ', type:"update.success" });
                      }
                   });
             });
         });

       }else{
         res.status(200).json({status:"Old Password is Invalid", type:"resetPass.fail"});
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
         if (user == null) {
          console.log(user);
          cb(err, user);
         } else {
           res.status(200).json({status: 'User not found.', type:"forgetPass.noEmail"});
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
         var htmldata =  '<table cellpadding="5" cellspacing="5" ><tr><td></td></tr><tr><td>Hi '+user.firstname+' </td></tr><tr><td>We received a request to reset your Account password.</td></tr><tr><td>Please click on the link below to change Your password</td></tr><tr><td><a href="http://localhost:3000/emaillink?token='+token+'" >Reset Password Link</a></td></tr><tr><td><br><br><br>Regards: <br>KopraWallet Team</td></tr></table>';
        //reset password email
        let mailOptions = {
             from: "", // sender address
             to: user.email, // list of receivers
             subject: 'KopraWallet Password help has arrived!', // Subject line
             //text: 'http://'+req.headers.host+'/emaillink?token='+token // html body
             html:htmldata
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
                if(err || user == null){
                    res.json({status:"User not found", type:"forgetPass.noEmail"});
                }else{
                    bcrypt.genSalt(function(err, salt) {
                        if (err)  console.log(err);
                 // hash the password along with our new salt
                        bcrypt.hash(req.body.password, salt, function(err, hash) {
                          if (err)  console.log(err);

                           console.log(hash);
                           var password = hash;

                           User.findOneAndUpdate({email:email}, {password:password}, function(err){
                             if(err){
                               console.log(err);
                             }else{
                               res.json({status:"password updated successfully", type:"forgetPass.update.success"});
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
      res.status(200).json({status: "Profile Image Updated Successfully", type:"profileImage.success"});
    }
  });
}
  var phoneVerify = function(req, res){
    updateData = {
      mobile: req.body.mobile,
      countryCode: req.body.cc
    }
    User.findById(req.user.id, function(err, user){
      authy.phones().verification_start(req.body.mobile, req.body.cc, 'sms' , function(err, data) {
        if(err){ console.log(err);
          res.status(200).json({status:"Invalid Mobile Number", type:"phone.msg.fail"});
        }
        else{
          User.findByIdAndUpdate(req.user.id, updateData, function(err, data){
              res.status(200).json({status:"Check	your	SMS	for	Verification	code", type:"phone.msg.check"});
          });

        }
      });
    })
  }

  var phoneCheck = function(req, res){
    console.log(req.body);

    User.findById(req.user.id, function(err, user){
      authy.phones().verification_check(user.mobile, user.countryCode, req.body.verifyCode, function (err, data) {
      //  console.log(data);
        if(err){ console.log(err);
          if(!err.success){
            res.status(200).json({status:"OTP is invalid", type:"phone.verify.fail"});
          }
        }else{
          User.findByIdAndUpdate(req.user.id, {numberVerify:true}, function(err, data){
            res.status(200).json({status:"Your mobile number is	verified", type:"phone.verify.success"});
          });
        }
      });
    })
  }


  var authentication = function(req, res){
    console.log(req.body);

    User.findById(req.user.id, function(err, user){
      authy.phones().verification_check(user.mobile, user.countryCode, req.body.verifyCode, function (err, data) {
      //  console.log(data);
        if(err){ console.log(err);
          if(!err.success){
            res.status(200).send('Not verified' );
          }
        }else{
          //User.findByIdAndUpdate(req.user.id, {numberVerify:true}, function(err, data){
            res.status(200).send('verified');
          //});
        }
      });
    })
  }

  var enterprises = function(req, res){
    console.log(req.body);

    User.findById(req.user.id, function(err, user){
        if(err){ console.log(err);
        }else{
           ;

              let mailOptions = {
              from: "", // sender address
              to: '', // list of receivers
              subject: 'Request', // Subject line

              html: 'Name: '+user.firstname+' '+user.lastname+'<br> Email: '+user.email // html body
            }
            mail(mailOptions);
            res.status(200).json({status:"Email has been sent", type:"enterprise.success"});

        }

    })
  }

  var test = function(req, res){
    //console.log(req.body);
    bcrypt.genSalt(function(err, salt) {
        if (err) throw err;

        // hash the password along with our new salt
        bcrypt.hash('admin123', salt, function(err, hash) {
            if (err) throw err;
            console.log(hash)
            // override the cleartext password with the hashed one
            //userUpdate.password = hash;

          });
        });



  }


  var twofactor = function(req, res){
    console.log(req.body);

    User.findByIdAndUpdate(req.user.id, {isAuthy:req.body.isAuthy}, function(err, data){
          if(err || data == null){ console.log(err);
            res.status(200).json({status:"failed", type:"authy.failed"});
          }else{
            res.status(200).json({status:"success", type:"authy.success"});
          }

      });

  }


module.exports.twofactor = twofactor;
module.exports.authentication = authentication;
module.exports.test = test;
module.exports.enterprises = enterprises;
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
module.exports.ethBalance = ethBalance;
module.exports.usdtBalance = usdtBalance;
module.exports.register = registerUser;
module.exports.login = loginUser;
