var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
 name:String,
 username:String,
 phone:Number,
 email:String,
 password:String
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);