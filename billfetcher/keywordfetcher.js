var request = require('request');
var fs = require('fs');
var config = require('./config');
var apiConfig = require('./../server/lib/api_config');
var Bill = require('./../db/models/bill');
var logger = require('./logHelpers.js');
var mongoose = require('mongoose');

var fetchBillsKeywords = function(callback) {

  mongoose.connect(config.databaseURL);

  // check flat file for the last time this module was run
  fs.readFile(config.keywordFetcherTimestampFile, function(err, data) {
    if (err) {
      logger.log('Error reading from keywordFetcherTimestampFile: ' + err);
    } else {      
      var timestamp = data.toString(); // this is the last time the module was run, in ISO string format

      // get any bills from the database that were inserted/updated more recently than the last time this module was run
      Bill.find({'updatedAt': { $gt: new Date(timestamp) }}, function(err, bills) {
        if (err) {
          logger.log('Error retrieving bills from the database: ' + err);
        } else {
          var billsSaved = 0;
          // for each bill, get the text of the bill
          bills.forEach(function(bill) {
            getBillText(bill, function(text) {
              // use the text of the bill to get keywords via API
              getBillKeywords(text, function(results) {
                // save keywords back to the bills in the database
                console.log('results.keyword: ' + results.keyword);
                saveKeywords(bill, Object.keys(results.keyword), function() {
                  billsSaved++;
                  if (billsSaved === bills.length) {
                    callback();
                  }
                }); 
              });
            });
          });
        }
      });
    }
  });

  // call the Twinword API using the title and text 

  // populate keywords_generated in database using results of Twinword API 

};

var saveKeywords = function(bill, keywords, callback) {
  bill.keywords_generated = keywords;
  bill.save(function(err) {
    if (err) {
      logger.log('Error saving keywords back to database: ' + err);
    }
    callback();
  });
};

var getBillKeywords = function(text, callback) {
  request({
    url: config.TOPIC_TAGGING_API_URL,
    method: 'GET',
    headers: {
      'X-Mashape-Key': apiConfig.topicTaggingAPIk.key,
      Accept: 'application/json',
    },
    qs: { text: text}
  }, function(err, response, body) {
    if (err) {
      logger.log('Error retrieving bill keywords from API: ' + err);      
    } else {
      callback(JSON.parse(body));
    }
  });   
};

var getBillText = function(bill, callback) {
  if (!bill.last_version.urls.html) {
    // the text of the bill is not available, so all we have to work with is the title
    callback(bill.official_title);
  } else {
    requestBillText(bill, callback);  
  }
};

var requestBillText = function(bill, callback) {
  request({
    url: bill.last_version.urls.html,
    method: 'GET'
  }, function(err, response, body) {
    if (err) {
      logger.log('Error retrieving bill text from URL: ' + err);      
    } else {
      callback(body);
    }
  });  
};

module.exports = fetchBillsKeywords;




