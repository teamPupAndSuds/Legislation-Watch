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
  keywords: Object,
  email: String
});

userSchema.methods.hashPassword = function (callback) {
  var cipher = Promise.promisify(bcrypt.hash);
  cipher(this.password, null, null).bind(this)
  .then(function(hash) {
    this.password = hash;
    callback();
  });
};

var UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;