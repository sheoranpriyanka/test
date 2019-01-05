var express = require("express");
var app = express();
var jwt = require("jsonwebtoken");


var jwtMiddleware = function(req,res,next){
   // console.log(req.headers);
  if(!req.headers.authorization){
      res.status(200).json({status:'Missing authentication credentials.'});
  }else{

  jwt.verify(req.headers.authorization.split(' ')[1],"bloodysecret",function(err,decode){
    if(err){
      //throw an error if a jwt is not passed in the request
      //console.log('sdfsdfs');
      res.send("Unauthorized");
    }
    else{
      req.user = decode;
      //console.log(decode);
      next();
    }
  });
}
}

module.exports = jwtMiddleware;
