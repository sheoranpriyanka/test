var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userProfileSchema = new Schema({
    middlename:{type:String},
    gender:{type:String, enum:["Male","Female"], required:true},
    address:{type:String, required:true},
    city:{type:String, required:true},
    pincode:{type:Number, required:true},
    country:{type:String, required:true},
    dob:{
      year:{type:Number, required:true},
      month:{type:Number, required:true},
      date:{type:Number, required:true}
    },
    id_data: {type: JSON},
    userId:{type:Schema.Types.ObjectId, ref:'User', unique:true},
    id_proof_front: {type:String},
    id_proof_back: {type:String},
    selfie:{type:String},
    doc_verification:{type:String, enum: ["pending", "rejected" , "verified"], default:"pending"},
    step:{type:Number, enum:["0", "1", "2", "3", "4"], default:0 },
    isenterprise:{type:String, enum: ["pending", "degrade" , "upgrade"], default:"pending" }
});

module.exports = userProfileSchema;
