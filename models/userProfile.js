var mongoose = require('mongoose');
var multer = require('multer');
var userProfileSchema = require("../schemas/userProfile.js");
var jwt = require("jsonwebtoken");


var userProfile = mongoose.model('userProfile',userProfileSchema);
var saveProfile =  function(req,res){
  console.log(req.body);
var profile = new userProfile({
    middlename:req.body.middlename,
    gender:req.body.gender,
    address:req.body.address,
    city:req.body.city,
    pincode:req.body.pincode,
    country:req.body.country,
    dob:{
      year:req.body.dob.year,
      month:req.body.dob.month,
      date:req.body.dob.date
    },
  //  mobile:req.body.mobile,
  //  countryCode:req.body.cc,
    userId:req.user.id,
   step:1

});

    // var ageDifMs = Date.now() - Date.parse(req.body.dobDate);
    // console.log(Date.now(), Date.parse(req.body.dobDate));
    // var ageDate = new Date(ageDifMs); // miliseconds from epoch
    // console.log(ageDate);
    //
  //  var age = Math.abs(ageDate.getUTCFullYear() - 1970);
  // var dob = req.body.dob.date+"/"+req.body.dob.month+"/"+req.body.dob.year;
   var todayDate = new Date();
//   var date = todayDate.getDate();
  // var month = todayDate.getMonth();
   var year = todayDate.getFullYear();
  // console.log(year);
  // var dateTocompare = date+"/"+month+"/"+year;
    //console.log(dateTocompare);
   var age = year - req.body.dob.year ;
  // console.log(dateTocompare, dob);

   console.log(age);
  if(age > 18){

  profile.save(function(err){
      if(err){
        //res.status(400).json({status:'invalid'});
        res.send(err);
      }
      else{
        res.status(200).json({status:"successfully registered"});
      }
    });
   }else{
     res.status(200).json({status: "Only 18+ allowed"});
   }
}
// Second step for signup
var saveProfile_s2 = function(req, res){

console.log(req.files);
  var profile_2 = {
      id_data:{
        countryid:req.body.countryid,
        idnumber:req.body.idnumber
      },
      id_proof_front:req.files.id_proof_front[0].filename,
      id_proof_back:req.files.id_proof_back[0].filename
  };
  var query = {userId : req.user.id };

  userProfile.findOneAndUpdate(query, profile_2, function(err){
    if(err){
      res.send(err);
    }
    else{
      res.status(200).json({status: "file saved successfully"});
    }
  });
}
//selfie upload
var saveSelfie = function(req, res){

  console.log(req.files);
  var selfieArr = {

      selfie:req.files.selfie[0].filename,
      step: 2,
      doc_verification:"pending"
  };
  var query = {userId : req.user.id };

  userProfile.findOneAndUpdate(query, selfieArr, function(err){
    if(err){
      res.send(err);
    }
    else{
      res.status(200).json({status: "file saved successfully"});
    }
  });
}

var userProfileData = function(req, res ){

      console.log(req.user.id);
      userProfile.findOne({userId: req.user.id}, function (err, user) {
          if (err) { throw err;
            console.log(err);
            res.status(500).json({status : "invalid request"});
          }else{
            res.send(user);
          }
       });
}

module.exports.userProfileData = userProfileData;
module.exports.saveSelfie = saveSelfie;
module.exports.saveProfile_s2 = saveProfile_s2;
module.exports.saveProfile = saveProfile;
