var bcrypt = require('bcrypt-nodejs');
var unirest = require('unirest');
var apiKey = require('./api_config.js');
var googleMapsClient = require('@google/maps').createClient({
  key: apiKey.geoCode['key']
});

exports.isLoggedIn = function(req, res) {
  return req.session ? !!req.session.user : false;
};

exports.sendUserData = function(req, res, newUser) {

  // If this is a new user signup
  if (newUser !== undefined) {
    req.session.user = newUser;
  }
  // Construct the logged-in user's information to send back to the client
  var userInfo = {};
  // NOT used at the moment
  // userInfo['name'] = req.sessikeywordObon.user.name;
  userInfo['username'] = req.session.user.username;
  userInfo['location'] = req.session.user.location;
  userInfo['geoLocation'] = {};
  userInfo['geoLocation']['lat'] = req.session.user.latitude;
  userInfo['geoLocation']['long'] = req.session.user.longitude;

  // Convert user monitored keywords object to an Array for the client
  //console.log('utility.js: sendUserData: keywords', req.session.user.keywords);
  var userMonitoredWordsAsArray = [];
  for (monitoredWord in req.session.user.keywords) {
    userMonitoredWordsAsArray.push(req.session.user.keywords[monitoredWord]);
  }
  userInfo['keywords'] = userMonitoredWordsAsArray;
  res.status(200).send(userInfo);
  res.end();
};

exports.checkUser = function(req, res) {
  //console.log('utility.js: entered checkUser');
  if (!exports.isLoggedIn(req)) {
    res.status(401).end();
  } else {
    exports.sendUserData(req, res);
  }
};

exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
    req.session.user = newUser;
    exports.sendUserData(req, res, newUser);
  });
};

exports.comparePassword = function(candidatePassword, savedPassword, cb) {
  bcrypt.compare(candidatePassword, savedPassword, function(err, isMatch) {
    if (err) {
      return cb(err);
    } else {
      cb(null, isMatch);
    }
  });
};

exports.geoCodeit = function(res, userInfo, streetAddress, cb) {
  googleMapsClient.geocode({
    address: streetAddress
  }, function(err, response) {
    if (err) {
      return cb(err);
    } else {
      return cb(null, response);
    }
  });
};

exports.keywordBuilder = function(user, searchWord, cb) {
  var strArr = searchWord.split(' ');
  var keywordObj = {keyword: searchWord, associatedKeywords: []};

  if (strArr.length > 1) {
    keywordObj['associatedKeywords'] = [];
    user.keywords[searchWord] = keywordObj;
    cb(null, user);
  } else {
    var searchTerm = 'entry=';
    searchTerm = searchTerm.concat(searchWord);
    unirest.post('https://twinword-word-associations-v1.p.mashape.com/associations/')
      .header('X-Mashape-Key', apiKey.wordAssocAPIk['key'])
      .header('Content-Type', 'application/x-www-form-urlencoded')
      .header('Accept', 'application/json')
      .send(searchTerm)
      .end(function (result) {
        if (result.error) {
          cb(result.error);
        } else {
          var words = result.body['associations_array'];
          if (words !== undefined) {
            //if there are associated words found by API, map through results array from api and push to keyword object
            words.forEach(function(word) {
              keywordObj['associatedKeywords'].push(word);
            });
            user.keywords[searchWord] = keywordObj;
            cb(null, user);
          } else {
            //just set keyword without associated keywords
            user.keywords[searchWord] = keywordObj;
            cb(null, user);
          }
        }
      });
  }
};