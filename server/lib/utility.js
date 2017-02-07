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
  //console.log('utility.js: sendUserData: dataToBeSent', userInfo);
  res.status(200).send(userInfo);
  res.end();
};

exports.checkUser = function(req, res) {
  //console.log('utility.js: entered checkUser');
  if (!exports.isLoggedIn(req)) {
    // console.log('utility.js: user NOT logged in, sending 401');
    res.status(401);
    res.end();
  } else {
    // console.log('utility.js: user logged in, sending user data back to client');
    // console.log('utility.js: user logged in: requ.session.user', req.session.user);
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
  //console.log('utility.js: comaprePassword: candidate & savedpassword:', candidatePassword, savedPassword);
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
      cb(null, response);
    }
  });
};

exports.keywordBuilder = function(user, searchWord, cb) {
  var strArr = searchWord.split(' ');
  var keywordObj = {keyword: searchWord, associatedKeywords: []};
  //console.log('utility.js: keywordBuilder: entered with new keyword:', keywordObj);   
  if (strArr.length > 1) {
    keywordObj['associatedKeywords'] = [];
    user.keywords[searchWord] = keywordObj;
    //console.log('utility.js: keywordBuilder: multiple keywords detected, user.keywords:', user.keywords);
    cb(null, user);
  } else {
    //console.log('utility.js: keywordBuilder: single keywords detected, user.keywords:', user.keywords);
    var searchTerm = 'entry=';
    searchTerm = searchTerm.concat(searchWord);
    // console.log('utility.js: keywordBuilder: sending API with searchWord:', searchWord);    
    // console.log('utility.js: keywordBuilder: sending API with term:', searchTerm);
    unirest.post('https://twinword-word-associations-v1.p.mashape.com/associations/')
      .header('X-Mashape-Key', apiKey.wordAssocAPIk['key'])
      .header('Content-Type', 'application/x-www-form-urlencoded')
      .header('Accept', 'application/json')
      .send(searchTerm)
      .end(function (result) {
        // console.log('utility.js: keywordBuilder: word association API call complete: result.body', result.body);
        // console.log('utility.js: keywordBuilder: word association API call complete: result.error', result.error);
        if (result.error) {
          // console.log('utility.js: keywordBuilder: word association API call failed:', result.error);   
          cb(result.error);
        } else {
          var words = result.body['associations_array'];
          if (words !== undefined) {
            //if there are associated words found by API, map through results array from api and push to keyword object
            words.forEach(function(word) {
              keywordObj['associatedKeywords'].push(word);
            });
            user.keywords[searchWord] = keywordObj;
            // console.log('utility.js: keywordBuilder: word association API call success: results:', keywordObj);
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