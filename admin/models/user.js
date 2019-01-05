var mongoose = require('mongoose');
var userSchema = require("../../schemas/users.js");
var bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
var User = mongoose.model('User', userSchema);
var userProfileSchema = require("../../schemas/userProfile.js");
var userProfile = mongoose.model("userprofile", userProfileSchema );

// get all user data
var getAllUser =  function(req, res){

  User.find( function(err, users) {
       if (err) {
         console.log(err);
         res.status(500).json({status : "invalid request"});
       }else{
         res.send(users);
       }

    });
}

var getAllprofile =  function(req, res){

  userProfile.find().populate('userId', '-password').exec( function(err, users) {
       if (err) {
         console.log(err);
         res.status(500).json({status : "invalid request"});
       }else{
         res.send(users);
       }

    });
}

var getProfileData = function(req, res){
  console.log(req.params.id)
  userProfile.findOne({userId: req.params.id}).populate('userId', '-password').exec( function(err, users) {
     if (err) {
       console.log(err);
       res.status(500).json({status : "invalid request"});
     }else{
       res.send(users);
     }

  });
}
// get user data by id
var getById = function(req, res){

  userProfile.findById(req.params.user_id, function (err, user) {
        if (err) {
          console.log(err);
          res.status(500).json({status : "invalid request"});
        }else{
          res.send(user);
        }
     });

}
// update user data
var update = function(req, res){

      var userUpdate = {
      middlename: req.body.middlename,
      gender: req.body.gender,
      address:req.body.address,
      city:req.body.city,
      pincode:req.body.pincode,
      country:req.body.country,
      dob:{
        year:req.body.year,
        month:req.body.month,
        date:req.body.date
      }
    };

  User.findByIdAndUpdate(req.params.user_id, userUpdate,  function (err) {
        if (err) {
          console.log(err);
          res.status(500).json({status : "invalid request"});
        }else{
          res.status(200).json({ message: 'Successfully updated' });
        }
     });

}

// remove user
var removeUser = function(req, res){
  console.log(req.params.user_id);
  User.remove({ _id: req.params.user_id },  function (err) {
      if (err) {
        console.log(err);
        res.status(500).json({status : "invalid request"});
      }else{
        res.status(200).json({ message: 'Successfully deleted' });
      }
   });

}

// user approval
var Approval = function(req, res){
var approvalStatus = {approval : req.body.approval };
var opts = { runValidators: true };
  User.findOneAndUpdate({_id:req.body.user_id}, approvalStatus, opts,  function(err){
    if(err){
      console.log(err);
      res.status(500).json({status : "invalid request"});
    }else{
      res.status(200).json({ message: 'success' });
    }
  });
}

var doc_verify = function(req, res){
var reqData = {doc_verification : req.body.verify };
var opts = { runValidators: true };
  userProfile.findOneAndUpdate({userId:req.body.userId}, reqData, opts,  function(err){
    if(err){
      console.log(err);
      res.status(500).json({status : "invalid request"});
    }else{
      res.status(200).json({ message: 'success' });
    }
  });
}

var enterpriseApproval = function(req, res){

      var userUpdate = {
          isenterprise:req.body.enterprise
    };

  userProfile.findOneAndUpdate({userId:req.body.userId}, userUpdate,  function (err , data) {

        if (err) {
          console.log(err);
          res.status(500).json({status : "invalid request"});
        }else{
          console.log(data);
          res.status(200).json({ message: 'Successfully updated' });
        }
     });

}

var geTodayData = function(req, res){
  //var todaysDate = new Date();
  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  console.log(startOfToday);
  User.find({date:{$gte: startOfToday}}, function (err, user) {
        if (err) {
          console.log(err);
          res.status(500).json({status : "invalid request"});
        }else{
          res.send(user);
        }
     });

}

module.exports.geTodayData = geTodayData;
module.exports.enterpriseApproval = enterpriseApproval;
module.exports.getAllprofile = getAllprofile;
module.exports.verification = doc_verify;
module.exports.getProfileData = getProfileData;
module.exports.approval = Approval;
module.exports.removeUser = removeUser;
module.exports.getById = getById;
module.exports.update = update;
module.exports.getAllUser = getAllUser;
