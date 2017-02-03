var bcrypt = require('bcrypt-nodejs');
var unirest = require('unirest');
var apiKey = require('./api_config.js');
var googleMapsClient = require('@google/maps').createClient({
  key: apiKey.geoCode['key']
});

exports.isLoggedIn = function(req, res) {
	return req.session ? !!req.session.user : false;
};

exports.sendUserData = function(req, res) {
	req.session.user = newUser;
	var userInfo = {};
	userInfo['name'] = res.session.user.name;
	userInfo['username'] = res.session.user.username;
	userInfo['location'] = res.session.user.location;
	userInfo['geoLocation'] = {};
	userInfo['geoLocation']['lat'] = res.session.user.latitude;
	userInfo['geoLocation']['long'] = res.session.user.longitude;
	var keywords = [];
	for (var key in res.session.user.keywords) {
		var word = {};
		word[key] = res.session.user.keywords[key];
		keywords.push(word);
	}
	userInfo['keywords'] = keywords;
    res.send(userInfo);
};

exports.checkUser = function(req, res) {
	if (!exports.isLoggedIn(req)) {
	    res.writeHead(401);
	    res.end();
	 } else {
	  	exports.sendUserData(req, res);
	}
};

exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
      req.session.user = newUser;
      exports.sendUserData(req, res);
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
		if(err) {
			return cb(err);
		} else {
			cb(null, response);
		}
	});
};

exports.keywordBuilder = function(user, searchWord, cb) {
	var strArr = searchTerm.split(' ');
	var keywordObj = {keyword: searchWord, associatedKeywords: []};

	if (strArr.length > 1) {
		keywordObj['associatedKeywords'] = [];
		user.keywords.push(keywordObj);
		cb(null, user);
	} else {
		var searchTerm = 'entry=';
		searchTerm.concat(searchWord);
		unirest.post("https://twinword-word-associations-v1.p.mashape.com/associations/")
	    .header("X-Mashape-Key", apiKey.wordAssocAPIk['key'])
	    .header("Content-Type", "application/x-www-form-urlencoded")
	    .header("Accept", "application/json")
	    .send(searchTerm)
	    .end(function (result) {
	      if (result.error) {
	        cb(result.error);
	      } else {
	        var words = result.body['associations_array'];
	        if (words !== undefined) {
	          words.forEach(function(word) {
	          	keywordObj['associatedKeywords'].push(word);
	          });
	          user.keywords.push(keywordObj);
	          cb(null, user);
	        } else {
	          cb(null, user);
	        }
	      }
	  });
	}
};