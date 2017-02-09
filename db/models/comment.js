var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var commentSchema = new mongoose.Schema({
  billId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
  },
  upvote: {
    type: Number,
    default: 0
  }
});

// commentSchema.methods.hashPassword = function (callback) {
  
// };

commentSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

var CommentModel = mongoose.model('Comment', commentSchema);

module.exports = CommentModel;