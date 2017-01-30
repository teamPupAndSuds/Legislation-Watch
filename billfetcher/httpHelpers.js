var request = require('request');
var config = require('./config');
var mongoose = require('mongoose');
var fs = require('fs');

// Use this query string in an http request when pulling the data used to initially populate the database.
// It pulls all bills from the current Congress.
var initializationQueryString = {
  congress: config.congress,
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

  // TODO: check if the database is empty; if so, populate it with all the recent congressional bills up to today's date

  billsAPIRequest(initializationQueryString, function(error, response, body) {
    if (error) {
      throw error;
    } else {
      callback();
    }
  });
};

