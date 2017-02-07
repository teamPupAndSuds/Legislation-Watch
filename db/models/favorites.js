var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var favoritesSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },

  billId: {
    type: String,
    required: true
  }
});

var FavoriteModel = mongoose.model('Favorites', favoritesSchema);

module.exports = FavoriteModel;