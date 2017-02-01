var mongoose = require('mongoose');
//add bcrypt and bluebird if not using Passport
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var userSchema = new mongoose.Schema({
  name: String,
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
    street: String,
    city: String,
    state: String,
    //zipcode a string b/c some states have codes beginning with 0
    zip: String
  },
  latitude: Number,
  longitude: Number,
  keywords: Array
});

var UserModel = mongoose.model('User', userSchema);

//Use this if not using Passport
User.comparePassword = function(candidatePassword, savedPassword, cb) {
  bcrypt.compare(candidatePassword, savedPassword, function(err, isMatch) {
    if (err) {
      return cb(err);
    } else {
      cb(null, isMatch);
    }
  });
};

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