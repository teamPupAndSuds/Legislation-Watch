var Bill = require('./../../db/models/bill');
var mongoose = require('mongoose');
var apiKey = require('./api_config.js');

//idk if this is necessary for later. 
mongoose.connect('mongodb://localhost/billfetchertest');


//input is a string, with the first letter lower-cased, to library of congress keywords
exports.getAllLowerCaseKeywords = function(phrase) {
  //take the phrase and lower-case the first letter
  var lowerPhrase = phrase.charAt(0).toLowerCase() + phrase.slice(1);
  console.log('This is the lowerPhrase', lowerPhrase);
  //find with regex expression
  Bill.find({"keywords" : {$regex : ".*" + lowerPhrase + ".*"}}, function(err, results) {
    if (err) {
      console.log('There was an error');
      return;
    } else {
      return results.forEach(function(bill) {
        console.log(bill.bill_id);
      });
    }
  });
};

//input is a string, with the first letter upper-cased, to library of congress keywords
exports.getAllUpperCaseKeywords = function(phrase) {
  //take the phrase and upper-case the first letter
  //find with regex expression
  //return query
};

//input is a string, with the first letter lower-case, to our generate keywords
exports.getAllLowerCaseKeywordsGen = function(phrase) {
  //take the phrase and lower-case the first letter
  //find with regex expression
  //return query
};


//input is a string, with the first letter upper-case, to our generate keywords
exports.getAllUpperCaseKeywordsGen = function(phrase) {
  //take the phrase and upper-case the first letter
  //find with regex expression
  //return query
};

//billAssociate function will be called by server
exports.billAssociate = function(userObj, cb) {
  //retrieve keywords field
  //var keywords = userObj.keywords;
};

///////////////////////////////////////////
//////////////TESTING ZONE/////////////////
///////////////////////////////////////////

//test to see if it queries the database
exports.getAllLowerCaseKeywords('Trade');




