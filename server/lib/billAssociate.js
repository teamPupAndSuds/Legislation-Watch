var Bill = require('./../../db/models/bill');
var mongoose = require('mongoose');
var apiKey = require('./api_config.js');

//connected to billdatabase for testing purposes
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
  //clears bills each call to avoid duplicates in bills property
  //first setting bills property to object in order to avoid duplicates
  keywordObj['relatedBills'] = {};
  exports.getAllByKeywords(keywordObj['word'], function(err, results) {
    if (err) {
      console.log('Sorry, was not able to retrieve bills from field keywords');
      cb(err);
    } else {
      results.forEach(function(bill) {
        keywordObj['relatedBills'][bill.bill_id] = bill.bill_id;
      });
      exports.getAllByKeywordsGen(keywordObj['word'], function(err, resultsGen) {
        if (err) {
          console.log('Sorry, was not able to retrieve bills from field keywords_generated');
          cb(err);
        } else {
          resultsGen.forEach(function(bill) {
            keywordObj['relatedBills'][bill.bill_id] = bill.bill_id;
          }); 
          console.log('Bills retrieved through main keyword');
          // console.log('result', keywordObj);

          //process of converting bill_ids to array to align with client-side expectation
          var tempObj = keywordObj['relatedBills'];
          keywordObj['relatedBills'] = [];
          for (var key in tempObj) {
            keywordObj['relatedBills'].push(tempObj[key]);
          }
          console.log('Keywords successfully added to keyword object');
          cb(null, keywordObj);  
        }
      });
    }
  });
};

///////////////////////////////////////////
//////////////TESTING ZONE/////////////////
///////////////////////////////////////////

// PLEASE COMMENT OUT THE CODE BELOW//

// // sample keyword object
// var keyword = {
//   word: 'marriage'
// };

// //print the userObj result to terminals
// exports.billAssociate(keyword, function(err, result) {
//   if (err) {
//     console.log('Something went wrong');
//     return;
//   } else {
//     console.log('Callback successfully executed');
//     console.log(result);
//   }
// });




