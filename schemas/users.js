var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var UserSchema = new Schema({
    firstname: {type:String, required:true},
    lastname: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required:true},
    mobile: {type:Number},
    countryCode: {type:Number},
    date: { type: Date, default: Date.now },
    wallets:{bitcoin:JSON, ethereum:JSON},
    approval: {type: String, enum:["pending","active", "frozen" ] , default: "pending"},
    reset_password_token:{type: String},
    isemail :{type: Boolean, default: false },
    myWallet:{type:Number, default: 0},
    profileImage:{type:String},
    numberVerify: {type: Boolean, default: false},
    isAuthy:{type: Boolean, default: false}
});

UserSchema.methods.comparePassword = function(password) {
  console.log(password);
  console.log(this.password);
return bcrypt.compareSync(password, this.password);
};


module.exports = UserSchema;
