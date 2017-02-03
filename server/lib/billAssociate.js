var Bill = require('./../../db/models/bill');
var mongoose = require('mongoose');
var apiKey = require('./api_config.js');

//connect for testing purposes, might need to connect for later
//revisit name
mongoose.connect('mongodb://localhost/billfetchertest');

exports.getAllByKeywords = function(phrase, cb) {
  //the regex will search through the array of library of congress keywords and will be able to find the targeted phrase, case in-sensitive as indicated by $options: 'i'
  Bill.find({"keywords" : {$regex : ".*" + phrase + ".*", $options: "i"}}, function(err, results) {
    if (err) {
      console.log('There was an error');
      cb(err);
    } else {
      cb(null, results);
    }
  });
};

exports.getAllByKeywordsGen = function(phrase, cb) {
  //the regex will search through the array of our generated keywords and will be able to find the targeted phrase, case in-sensitive as indicated by $options: 'i'
  Bill.find({"keywords_generated" : {$regex : ".*" + phrase + ".*", $options: "i"}}, function(err, results) {
    if (err) {
      console.log('There was an error');
      cb(err);
    } else {
      cb(null, results);
    }
  });
};

exports.billAssociate = function(keywordObj, cb) {
  
  //clears bills each call to avoid duplicates in bills 
  keywordObj['bills'] = [];
  exports.getAllByKeywords(keywordObj['keyword'], function(err, results) {
    if (err) {
      console.log('Sorry, was not able to retrieve bills from field keywords');
      cb(err);
    } else {
      results.forEach(function(bill) {
        keywordObj['bills'].push(bill.bill_id);
      });
      keywordObj['bills'].push('!!!!!!END OF KEYWORDS YAY!!!!!!!!!!');
      exports.getAllByKeywordsGen(keywordObj['keyword'], function(err, resultsGen) {
        if (err) {
          console.log('Sorry, was not able to retrieve bills from field keywords_generated');
          cb(err);
        } else {
          resultsGen.forEach(function(bill) {
            keywordObj['bills'].push(bill.bill_id);
          });
          cb(null, keywordObj);
        }
      });
    }
  });
};

///////////////////////////////////////////
//////////////TESTING ZONE/////////////////
///////////////////////////////////////////

//test to see if it queries the database
var keywordObj = {
  keyword: 'trade',
  associatedKeywords: ['foreign', 'money', 'tariffs']
};

//print the userObj result to terminal
exports.billAssociate(keywordObj, function(err, result) {
  if (err) {
    console.log('Something went wrong');
    return;
  } else {
    console.log('lalalalallala');
    console.log(result);
    return;
  }
});




