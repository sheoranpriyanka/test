var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var AdminSchema = new Schema({
    username: {type:String, required:true },
    password: {type:String, required:true},
    adminTotalWallet:{type:Number, default:0},
    adminWallet:{type:Number, default:0},
    //mobile: {type:Number, required:true},
    date: { type: Date, default: Date.now }

});

AdminSchema.methods.comparePassword = function(password) {
return bcrypt.compareSync(password, this.password);
};


module.exports = AdminSchema;
