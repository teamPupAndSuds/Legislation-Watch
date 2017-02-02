var mongoose = require('mongoose');
//add bcrypt and bluebird if not using Passport
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },

  //or are we using Passport?
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
});

var UserModel = mongoose.model('User', userSchema);

//Use this if not using Passport
userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
  .then(function(hash) {
    this.password = hash;
    next();
  });
});

module.exports = UserModel;