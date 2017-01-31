var mongoose = require('mongoose');
var config = require('./config');
var helpers = require('./httpHelpers');

mongoose.connect(config.databaseURL);

helpers.initializeBillsDatabase(function() {
  console.log('Initalization complete.');
  helpers.updateBillsDatabase(function() {
    console.log('Update complete.');
  });
});




