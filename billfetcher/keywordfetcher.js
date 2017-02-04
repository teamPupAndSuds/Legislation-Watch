var request = require('request');
var fs = require('fs');
var config = require('./config');
var apiConfig = require('./../server/lib/api_config');
var Bill = require('./../db/models/bill');
var logger = require('./logHelpers.js');

// This function watches for any new bills in the database and calls the Twinword API to generate keywords
// based on the title and text (if available) of the bill. This keyword generation helps us alert users to new 
// bills as soon as they are introduced, rather than waiting for the full text to become available or for the
// Library of Congress to assign keywords to the bill.
var fetchBillsKeywords = function(callback) {

  // check flat file for the last time this module was run
  fs.readFile(config.keywordFetcherTimestampFile, function(err, data) {
    var timestamp;
    if (err) {
      if (err.code !== 'ENOENT') { // if err.code === 'ENOENT', the file doesn't exist, which is OK
        logger.log('Error reading from keywordFetcherTimestampFile: ' + err);
      }
      timestamp = (new Date(0)).toISOString();
    } else { // this module has been run before, so check the timestamp of the last time it ran     
      timestamp = data.toString(); // this is the last time the module was run, in ISO string format
    }

    // get any bills from the database that were inserted/updated more recently than the last time this module was run
    Bill.find({'updatedAt': { $gt: new Date(timestamp) }}, function(err, bills) {
      if (err) {
        logger.log('Error retrieving bills from the database: ' + err);
        callback(err);
      } else if (bills.length === 0) { // no work to be done
        writeCurrentTimeToFile(config.keywordFetcherTimestampFile, function() {
          callback();
        });
      } else {
        var billsSaved = 0;
        // for each bill, get the text of the bill
        bills.forEach(function(bill) {
          if (bill.keywords_generated.length) { // we've already generated keywords for this bill at some time in the past
            checkIfDone(++billsSaved, bills.length, callback);           
          } else {
            getBillText(bill, function(err, text) {
              if (err) {
                checkIfDone(++billsSaved, bills.length, callback);
              } else {
                // use the text of the bill to get keywords via API
                getBillKeywords(text, function(err, results) {
                  // save keywords back to the bills in the database
                  if (err) {
                    checkIfDone(++billsSaved, bills.length, callback);                   
                  } else {
                    if (!results.keyword) {
                      results.keyword = {};
                    }
                    // The Twinword API returns keywords in an object under the property 'keyword'.
                    // Each keyword is its own property, hence the use of Object.keys.
                    // Example response: 
                    // {
                    //   "keyword": {
                    //     "taxation": 1,
                    //     "alcoholic": 1,
                    //     "beverage": 1,
                    //     "reform": 1,
                    //      ...
                    // }
                    saveKeywords(bill, Object.keys(results.keyword), function(err) {
                      checkIfDone(++billsSaved, bills.length, callback); 
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
};

// A function used to determine when all asynchronous calls have completed.
// Arguments:
// billsSaved: the number of bills processed asynchronously so far
// totalBills: the total number of bills we need to process
// callback: a callback with no arguments, invoked when all asynchronous calls have completed 
var checkIfDone = function(billsSaved, totalBills, callback) {
  console.log('Processed bill number: ' + billsSaved);
  if (billsSaved === totalBills) {
    writeCurrentTimeToFile(config.keywordFetcherTimestampFile, function() {
      callback();
    });  
  }
};

// Helper function for retrieving the full text of a bill, or the title if full text is not available.
// Arguments:
// bill: A mongoose bill model object
// callback: A callback with the signature (err, text)
var getBillText = function(bill, callback) {
  if (!bill.last_version.urls.html) {
    // the text of the bill is not available, so all we have to work with is the title
    callback(null, bill.official_title);
  } else {
    requestBillText(bill, callback);  
  }
};

// Helper function for getBillText. This function scrapes the website containing the bill's full text.
// Arguments:
// bill: A mongoose bill model object
// callback: A callback with the signature (err, text)
var requestBillText = function(bill, callback) {
  request({
    url: bill.last_version.urls.html,
    method: 'GET'
  }, function(err, response, body) {
    if (err) {
      logger.log('Error retrieving bill text from URL: ' + err); 
      callback(err, null);     
    } else {
      callback(null, body);
    }
  });  
};

// Helper function for getting keywords associated with a bill. The function makes an API call to the Twinword
// topic tagging API, which returns topic keywords based on the full text of the bill.
// Arguments:
// text: a string representing the text of the bill
// callback: a callback with signature (err, results) that is passed the result of the API call on success
var getBillKeywords = function(text, callback) {
  request({
    url: config.TOPIC_TAGGING_API_URL,
    method: 'GET',
    headers: {
      'X-Mashape-Key': apiConfig.topicTaggingAPIk.key,
      Accept: 'application/json',
    },
    qs: {text: text}
  }, function(err, response, body) {
    if (err) {
      logger.log('Error retrieving bill keywords from API: ' + err); 
      callback(err, null);     
    } else {
      var results;
      try {
        results = JSON.parse(body);
      } catch (err) {
        results = {};
      }
      callback(null, results);
    }
  });   
};

// Helper function for saving generated keywords back to the database.
// Arguments:
// bill: a mongoose bill model object
// keywords: an array of strings
// callback: a callback with the signature (err)
var saveKeywords = function(bill, keywords, callback) {
  bill.keywords_generated = keywords;
  bill.save(function(err) {
    if (err) {
      logger.log('Error saving keywords back to database: ' + err);
      callback(err);
    } else {
      callback(null);
    }
  });
};

// Helper function for writing the current time to a text file. Used to store a timestamp that can be
// referenced the next time this module is run.
var writeCurrentTimeToFile = function(filePath, callback) {
  var newTimestamp = (new Date()).toISOString();
  fs.writeFile(config.keywordFetcherTimestampFile, newTimestamp, function(err) { 
    if (err) {
      logger.log('Error writing new timestamp to file: ' + err);
    }
    callback();
  });
};

module.exports.fetchBillsKeywords = fetchBillsKeywords;