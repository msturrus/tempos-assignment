var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username      : String,
  password      : String,
  isDoctor      : Boolean,
  isPatient     : Boolean,
  name          : String,
  age           : Number,
  address       : String

});

module.exports = mongoose.model('users', UserSchema);
