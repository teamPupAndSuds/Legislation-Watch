var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  location: {
    houseNum: String,
    street: String,
    city: String,
    state: String,
  },
  latitude: Number,
  longitude: Number,
  keywords: Array,
  email: String
});

var UserModel = mongoose.model('User', userSchema);

userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
  .then(function(hash) {
    this.password = hash;
    next();
  });
});

module.exports = UserModel;