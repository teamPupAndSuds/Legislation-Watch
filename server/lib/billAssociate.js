var Bill = require('./../../db/models/bill');
var apiKey = require('./api_config.js');

//input is a string, with the first letter lower-cased, to library of congress keywords
exports.getAllLowerCaseKeywords = function(phrase) {
  //take the phrase and lower-case the first letter
  var lowerPhrase = phrase.charAt(0).toLowerCase() + phrase.slice(1);
  console.log('This is the lowerPhrase', lowerPhrase);
  //find with regex expression
  var query = Bill.find({"keywords" : {$regex : ".*" + lowerPhrase + ".*"}});
  console.log('THIS IS LINE 10');
  return query;
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

  //the logic below is just for testing purposes
  //userObj is just a string for now
  query = exports.getAllLowerCaseKeywords(userObj);
  console.log('THIS IS SUPPOSED TO BE A QUERY');
  var results = query.exec();
  results.then(function(err, bills) {
    console.log('LINE 48');
    if (err) {
      console.log(err);
      cb(err);
    } else {
      bills.forEach(function(bill) {
        console.log(bill.bill_id);
      }); 
      cb(null, 'this happened!');
    }
  });
};

//test to see if it queries the database
exports.billAssociate('Trade', function(err, done) {
  if (err) {
    console.log('There was an error', err);
  } else {
    console.log(done);
  }
});





