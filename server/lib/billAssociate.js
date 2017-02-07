var Bill = require('./../../db/models/bill');
var mongoose = require('mongoose');
var apiKey = require('./api_config.js');

// connected to billdatabase for testing purposes
// mongoose.createConnection('mongodb://localhost/billfetchertest');

exports.getAllByKeywords = function(phrase, cb) {
  //the regex will search through the array of library of congress keywords and will be able to find the targeted phrase, case in-sensitive as indicated by $options: 'i'
  Bill.find({"keywords" : {$regex : ".*" + phrase + ".*", $options: "i"}}).sort({'updatedAt': -1}).exec(function(err, results) {
    if (err) {
      //console.log('There was an error');
      cb(err);
    } else {
      //filter for bills in database with updates within 5 days of the most recently updated bill.
      //5 days in milliseconds: 4.32 E^8
      if (results.length > 0) {
        var fivedaysInmilsec = 432000000;
        var currDate = results[0]['updatedAt'];
        var currDateInMilsec = currDate.getTime();
        var newDateInMilsec = currDateInMilsec - fivedaysInmilsec;
        var newDate = new Date();
        //cutoff date
        newDate.setTime(newDateInMilsec);

        var filteredRes = results.filter(function(obj) {
          return obj['updatedAt'] > newDate;
        });

        //console.log('billAssociate.js: getAllByKeywords: phrase supplied:', phrase);      
        //console.log('billAssociate.js: getAllByKeywords: results:', results);
        cb(null, filteredRes);
      } else {
        cb(null, results);
      }
    } 
  });
};

exports.getAllByKeywordsGen = function(phrase, cb) {
  //the regex will search through the array of our generated keywords and will be able to find the targeted phrase, case in-sensitive as indicated by $options: 'i'
  Bill.find({"keywords_generated" : {$regex : ".*" + phrase + ".*", $options: "i"}}).sort({'updatedAt': -1}).exec(function(err, results) {
    if (err) {
      //console.log('There was an error');
      cb(err);
    } else {
      //filter for bills in database with updates within 5 days of the most recently updated bill.
      //5 days in milliseconds: 4.32 E^8
      if (results.length > 0) {
        var fivedaysInmilsec = 432000000;
        var currDate = results[0]['updatedAt'];
        var currDateInMilsec = currDate.getTime();
        var newDateInMilsec = currDateInMilsec - fivedaysInmilsec;
        var newDate = new Date();
        //cutoff date
        newDate.setTime(newDateInMilsec);

        var filteredRes = results.filter(function(obj) {
          return obj['updatedAt'] > newDate;
        })

        //console.log('billAssociate.js: getAllByKeywordsGen: phrase supplied:', phrase);            
        //console.log('billAssociate.js: getAllByKeywordsGen: results:', results);      
        cb(null, filteredRes);
      } else {
        cb(null, results);
      }
    }
  });
};

exports.billAssociate = function(keywordObj, cb) {
  //clears bills each call to avoid duplicates in bills property
  //first setting bills property to object in order to avoid duplicates
  keywordObj['relatedBills'] = {};

  // DEBUG ONLY: Console log number of bills in the database
  // Bill.find({}, function(err, results) {
  //   console.log('billAssociate.js: number of bill in database', results.length);
  // });

  exports.getAllByKeywords(keywordObj['keyword'], function(err, results) {
    if (err) {
      //console.log('Sorry, was not able to retrieve bills from field keywords');
      cb(err);
    } else {
      results.forEach(function(bill) {
        keywordObj['relatedBills'][bill.bill_id] = bill.bill_id;
      });
      exports.getAllByKeywordsGen(keywordObj['keyword'], function(err, resultsGen) {
        if (err) {
          //console.log('Sorry, was not able to retrieve bills from field keywords_generated');
          cb(err);
        } else {
          //console.log('billAssociate.js: results generated', resultsGen);
          resultsGen.forEach(function(bill) {
            keywordObj['relatedBills'][bill.bill_id] = bill.bill_id;
          }); 
          //console.log('billAssociate.js: Bills retrieved through main keyword: keywordObj:', keywordObj);

          //process of converting bill_ids to array to align with client-side expectation
          var tempObj = keywordObj['relatedBills'];
          keywordObj['relatedBills'] = [];
          for (var key in tempObj) {
            keywordObj['relatedBills'].push(tempObj[key]);
          }
          //console.log('Keywords successfully added to keyword object');
          //console.log('Related Bill Results', keywordObj['relatedBills']);
          cb(null, keywordObj);  
        }
      });
    }
  });
};


