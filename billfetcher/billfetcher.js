var request = require('request');
var mongoose = require('mongoose');
var fs = require('fs');

var config = require('./config');
var helpers = require('./httpHelpers');
var Bill = require('./../db/models/bill');
var logger = require('./logHelpers.js');

mongoose.connect(config.databaseURL);

helpers.initializeBillsDatabase(function() {
  console.log('Initalization complete.');
  helpers.updateBillsDatabase(function() {
    console.log('Update complete.');
  });
});

/// Code below this line is WIP

/*
// find the newest record in the database so we can only fetch records that are newer
Bill.findOne({}, {}, {sort: {'created_at': -1 }}, function(err, bill) {
  if (err) {
    logger.log('Error finding the most recent bill in billfetcher.js');
  } else {
    var introducedOn = bill.introducedOn;  
    logger.log('Found newest record in database, introduced on ' + introducedOn, function() {});

    // Get all bills introduced on a date equal to or later than the most recent date in the database
    

    // Check if bill is already in database, and if not add it to database.
    // Some bills may already be in the database because the precision of 'bill.introducedOn' is only 
    // to the day. For example, we might have checked for new bills in the morning and put them in the 
    // database, but there could be additional bills from the same day if we check in the evening.



    // // Parse the 'introduced on' date.
    // // The API returns dates in the form yyyy-mm-dd
    // var year = Number(introducedOn.substring(0, 4));
    // var month = Number(introducedOn.substring(5, 7));
    // var day = Number(introducedOn.substring(8, 10));
    // // Convert the string representation into a Javascript Date
    // introducedOn = new Date(year, month, day);

  }



});
*/



