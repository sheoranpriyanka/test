var mongoose = require('mongoose');
var adminSchema = require("../schemas/admin.js");
var bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
var Admin = mongoose.model('Admin', adminSchema);


//admin registeration model
var registerAdmin = function(req, res){

var admin =  function () {
    var user = new Admin({

    username:req.body.username,
    password:req.body.password

  });
  adminSchema.pre('save', function(next) {
      var user = this;

      // only hash the password if it has been modified (or is new)
      if (!user.isModified('password')) return next();

      // generate a salt
      bcrypt.genSalt(function(err, salt) {
          if (err) return next(err);

          // hash the password along with our new salt
          bcrypt.hash(user.password, salt, function(err, hash) {
              if (err) return next(err);

              // override the cleartext password with the hashed one
              user.password = hash;
              console.log(hash);
              next();
          });
      });
  });



  user.save(function(err){
    if(err){
      res.status(400).json({status:'invalid'});
      console.log(err);
    }
    else{
      console.log("saved successfully");
        res.status(200).json({status:"successfully registered"});
    }
  });
}
admin();

}

// admin login model
var loginAdmin =  function(req, res){

  Admin.findOne({ username: req.body.username }, function(err, admin) {
       if (err || admin == null){
         res.status(200).json({status:"Please check username"});
       }

      let isMatch = admin.comparePassword(req.body.password);
        if(isMatch){
          res.status(200).json({token: jwt.sign({id: admin._id}, 'bloodysecret', { expiresIn: 10 * 60 * 60 }) });
        }else{
          res.status(400).json({status: "Incorrect Password" });
        }
    });
}

var adminData = function(req, res){

  Admin.findById(req.user.id,'-password', function (err, user) {
        if (err) {
          console.log(err);
          res.status(500).json({status : "invalid request"});
        }else{
          res.send(user);
        }
     });

}

module.exports.adminData = adminData;
module.exports.register = registerAdmin;
module.exports.login = loginAdmin;
