var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  location: {
    street: String,
    city: String,
    state: String,
    //zipcode a string b/c some states have codes beginning with 0
    zip: String
  },
  latitude: Number,
  longitude: Number,
  keywords: Array,
  email: String
});

var UserModel = mongoose.model('User', userSchema);

User.comparePassword = function(candidatePassword, savedPassword, cb) {
  bcrypt.compare(candidatePassword, savedPassword, function(err, isMatch) {
    if (err) {
      return cb(err);
    } else {
      cb(null, isMatch);
    }
  });
};

userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
  .then(function(hash) {
    this.password = hash;
    next();
  });
});

module.exports = UserModel;