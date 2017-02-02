var request = require('request');
var config = require('./config');
var Bill = require('./../db/models/bill');
var logger = require('./logHelpers.js');

// Use this query string in an http request when pulling the data used to initially populate the database.
var initializationQueryString = {
  congress: config.congress,
  fields: 'bill_id,chamber,introduced_on,last_action_at,last_vote_at,last_version_on,short_title,official_title,popular_title,sponsor.first_name,sponsor.last_name,sponsor.middle_name,sponsor.title,sponsor_id,last_version,cosponsor_ids,keywords,summary,summary_short,related_bill_ids',
  order: 'introduced_on',
  per_page: '50'
};

// Use this query string in an http request when updating the bills in the database.
var updateQueryString = {
  fields: 'bill_id,chamber,introduced_on,last_action_at,last_vote_at,last_version_on,short_title,official_title,popular_title,sponsor.first_name,sponsor.last_name,sponsor.middle_name,sponsor.title,sponsor_id,last_version,cosponsor_ids,keywords,summary,summary_short,related_bill_ids',
  order: 'introduced_on',
  per_page: '20'
};


// This function updates the bills database with any new bills.
// It is meant to be run on an ongoing basis via cron job, but can be run ad hoc as well.
var updateBillsDatabase = function(callback) {
  // find the most recently added bill in the database
  Bill.findOne({}, {}, {sort: {'created_at': -1 }}, function(err, bill) {
    if (err) {
      logger.log('Error finding the most recent bill in the database: ' + err);
    } else {
      var mostRecentInDatabase = bill.introduced_on; 

      // Now retrieve all bills introduced on or after the most recent bill in our database and iterate through them, 
      // adding them to the database if they aren't already in it.
      // Some bills may already be in the database because the API does not provide timing precision greater than a day. 
      // For example, if the newest bill in our database was introduced on 1/27/2017, there may be other bills from 1/27/2017 
      // that are not in our database yet, but we cannot do a more precise search to identify only these newer bills, so we
      // must look at all bills from 1/27/2017 onward.

      // First, do an initial request to figure out how many new bills we need to download into the database
      updateQueryString.introduced_on__gte = mostRecentInDatabase;      // this instructs the API to only return bills
                                                                        // introduced on or after a certain date
      billsAPIRequest(updateQueryString, function(error, response, body) {
        if (error) {
          logger.log('Error updating Bills database: ' + err); 
        } else {
          retrieveAndStore(JSON.parse(body).count, updateQueryString, callback);
        }
      });
    }
  });
};


// This function initializes the bills database if it has not been initialized yet.
// It checks if the database is empty, and if so it retrieves all bills from the current Congress.
var initializeBillsDatabase = function(callback) {

   // Check if the database is empty
  Bill.findOne({}, {}, function(err, bill) {
    if (err) {
      logger.log('Error initializing Bills database: ' + err);
    } else if (!bill) { 
      // The database is empty, so grab all recent congressional bills...

      // First, do an initial request to figure out how many bills we need to download into the database
      billsAPIRequest(initializationQueryString, function(error, response, body) {
        if (error) {
          logger.log('Error initializing Bills database: ' + err); 
        } else {
          retrieveAndStore(JSON.parse(body).count, initializationQueryString, callback); 
        }
      });
    } else { // database is not empty, no initialization needed
      callback();
    }
  });
};


// This helper function will make multiple calls to the Sunlight Foundation API to retrieve a set of bills, and
// then store those bills in the database. The helper function is designed primarily to abstract away the details 
// of paginated responses from the API.
// Arguments:
// billCount: The number of bills to retrieve
// qs: A base query string for the API call
// callback: A callback that is invoked when all bills have been retrieved and written to the database
var retrieveAndStore = function(billCount, qs, callback) {

  var billsFetched = 0;         // running count of bills we have requested from the API so far
  var billsWritten = 0;         // running count of bills written to the database so far
  var billsPerPage = Number(qs.per_page); // number of bills received in each call to the Sunlight Foundation API
  var page = 1;                 // a counter we will increment in order to progressively retrieve all bills available through the API

  // Now use pagination to download all new bills page by page
  while (billsFetched < billCount) {
    var queryString = JSON.parse(JSON.stringify(qs));   // making a deep clone of the query string through use of the JSON libraries 
    queryString.page = page.toString();
    billsFetched += billsPerPage;
    page++;      
    billsAPIRequest(queryString, function(err, response, body) {
      if (err) {
        logger.log('Error making API request to update or initialize the Bills database: ' + err);
      } else {
        // Write each bill to the database
        body = JSON.parse(body);
        body.results.forEach(function(bill) {
          Bill.findOrCreate(bill, function(err, bill, created) {
            if (err) {
              logger.log('Error writing bill to the database: ' + err);  
            }
            billsWritten++;
            if (billsWritten === billCount) {
              callback();
            }
          });
        });
      }
    });
  } 
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



module.exports.initializeBillsDatabase = initializeBillsDatabase;
module.exports.updateBillsDatabase = updateBillsDatabase;