var request = require('request');
var fs = require('fs');
var config = require('./config');
var apiConfig = require('./../server/lib/api_config');
var Bill = require('./../db/models/bill');
var logger = require('./logHelpers.js');

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

var checkIfDone = function(billsSaved, totalBills, callback) {
  console.log('Processed bill number: ' + billsSaved);
  if (billsSaved === totalBills) {
    writeCurrentTimeToFile(config.keywordFetcherTimestampFile, function() {
      callback();
    });  
  }
};

var getBillText = function(bill, callback) {
  if (!bill.last_version.urls.html) {
    // the text of the bill is not available, so all we have to work with is the title
    callback(null, bill.official_title);
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
      callback(err, null);     
    } else {
      callback(null, body);
    }
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