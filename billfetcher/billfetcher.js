var mongoose = require('mongoose');
var config = require('./config');
var helpers = require('./httpHelpers');
var keywordFetcher = require('./keywordfetcher.js');

mongoose.connect(config.databaseURL);

helpers.initializeBillsDatabase(function() {
  console.log('Database initalization complete.');
  helpers.updateBillsDatabase(function() {
    console.log('Database update complete.');
    keywordFetcher.fetchBillsKeywords(function() {
      console.log('Keyword generation complete.');
      process.exit();
    });
  });
});




