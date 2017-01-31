var request = require('request');
var mongoose = require('mongoose');
var fs = require('fs');

var config = require('./config');
var helpers = require('./httpHelpers');
var Bill = require('./..db/bill');
var logger = require('./logHelpers.js');

// Use this query string in an http request when pulling the data used to initially populate the database.
// It pulls all bills from the current Congress.
var initializationQueryString = {
  congress: config.congress,
  fields: 'bill_id,chamber,introduced_on,last_action_at,last_vote_at,last_version_on,short_title,official_title,popular_title,sponsor.first_name,sponsor.last_name,sponsor.middle_name,sponsor.title,sponsor_id,cosponsor_ids,keywords,summary,summary_short,related_bill_ids'
};

// Use this query string in an http request when updating the bills in the database.
var updateQueryString = {
  fields: 'bill_id,chamber,introduced_on,last_action_at,last_vote_at,last_version_on,short_title,official_title,popular_title,sponsor.first_name,sponsor.last_name,sponsor.middle_name,sponsor.title,sponsor_id,cosponsor_ids,keywords,summary,summary_short,related_bill_ids'
};

// Generic helper function for querying the bills API.
// First argument is a query string object.
// Second argument is a callback function with the following signature: function(error, response, body). 
var billsAPIRequest = function(qs, callback) {
  request({
    url: config.CONGRESS_API_URL,
    qs: qs,
    method: 'GET'
  }, function(error, response, body) {
    if (error) {
      callback(error, null, null);
    } else {
      callback(null, response, body);
    }
  });  
};

// This helper function initializes the bills database if it has not been initialized yet.
// It checks if the database is empty, and if so it retrieves all bills from the current Congress.
var initializeBillsDatabase = function(callback) {

  // Check if the database is empty; if so, populate it with all the recent congressional bills up to today's date
  Bill.findOne({}, {}, function(err, bill) {
 
  });

  billsAPIRequest(initializationQueryString, function(error, response, body) {
    if (error) {
      throw error;
    } else {
      callback();
    }
  });
};

