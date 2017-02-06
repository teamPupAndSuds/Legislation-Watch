var User = require('./../../db/models/user');
var mongoose = require('mongoose');
var data = require('./sampleUserData.json');

mongoose.connect('mongodb://localhost/billfetchertest');


User.create(data, function(err, result) {
  if (err) {
    console.log('Something went wrong', err);
    process.exit();
  } else {
    console.log('Documents inserted', result);
    process.exit();
  }
});

