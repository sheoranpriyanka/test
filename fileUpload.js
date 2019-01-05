var multer = require('multer');
var path = require("path");
var dirPath =  path.dirname(require.main.filename);

var docStorage = multer.diskStorage({
   destination: function(req, file, callback) {
       callback(null, dirPath +"/images/ID_proof");

   },
   filename: function(req, file, callback) {
     console.log(file);
       callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname );
   }
});

var docUpload = multer({
   storage: docStorage
});


var selfieStorage = multer.diskStorage({
   destination: function(req, file, callback) {
        callback(null, dirPath +"/images/selfies");

    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname );

    }
 });

 var selfieUpload = multer({
    storage :  selfieStorage

 });

 var profileStorage = multer.diskStorage({
    destination: function(req, file, callback) {
      console.log(file);
         callback(null, dirPath +"/images/profileImage");

     },
     filename: function(req, file, callback) {
         callback(null, file.fieldname + "_" +req.user.id+".jpg" );

     }
  });
  //console.log(profileStorage);
  var profileUpload = multer({
     storage :  profileStorage

  });


module.exports.doc_upload = docUpload;
module.exports.profile_upload = profileUpload;
module.exports.selfie_upload = selfieUpload;
