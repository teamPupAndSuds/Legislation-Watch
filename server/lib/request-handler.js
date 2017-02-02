//import { wordAssocAPIk } from './api_config.js';
var apiKey = require('./api_config.js');
var path = require('path');
var unirest = require('unirest');
var User = require('./../../db/models/user');
var util = require('./utility.js');
//var db = require('/../../db');

/////////////////////////////////////////////////////////////////
//AUTHENTICATION

exports.userLogin = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne( {username: username} )
    .exec(function(err, user) {
      if(!err) {
        if(!user) {
          res.writeHead(401);
          res.end();
        } else {
          util.comparePassword(password, user.password, function(err, match) {
            if (match) {
              util.createSession(req, res, user);
            } else {
              res.writeHead(401);
              res.end();
            }
          });
        }
      } else {
        res.send(err);
      }
    });
};

exports.userLogout = function(req, res) {
  req.session.destroy(function() {
    res.writeHead(200);
    res.end();
  });
};


exports.userSignup = function(req, res) {
  var username = req.params.username;
  var password = req.body['password'];
  var userEmail = req.body['email'];
  var userAddress = req.body['address'];
  var streetAddress = userAddress['houseNum'];
  streetAddress = streetAddress.toString();
  streetAddress = streetAddress.concat(
    userAddress['streetName'],
    ', ',
    userAddress['city'],
    ', ',
    userAddress['state']
    );

  util.geoCodeit(res, streetAddress, function(err, response) {
    if (!err) {
      var geoLocation = response.json.results[0].geometry.location;
      var geoLoc = {location: {}};
      geoLoc.location['lat'] = geoLocation.lat;
      geoLoc.location['long'] = geoLocation.lng;
      res.send(geoLoc);
    }
  });
};


/////////////////////////////////////////////////////////////////
//BILL SEARCH
//termSearch function that utilizes a word-association API to get
//list of word associated with user search word(s)
exports.termSearch = function(req, res) {
  //searchTerm format: "entry=term"
  var searchTerm = 'entry=';

  //req.body.term comes in as an array of search terms input from user
  //convert search term array to string
  var searchTerms = req.body['term'].slice();
  searchTerms = searchTerms.toString();
  searchTerm = searchTerm.concat(searchTerms);

  //sends post request to Twinword API with user entered search term
  unirest.post("https://twinword-word-associations-v1.p.mashape.com/associations/")
    .header("X-Mashape-Key", apiKey.wordAssocAPIk['key'])
    .header("Content-Type", "application/x-www-form-urlencoded")
    .header("Accept", "application/json")
    .send(searchTerm)
    .end(function (result) {
      if (result.error) {
        res.send("Error fetching associated keywords");
      } else {
      //sends word association back to client as an array of words
        var words = result.body['associations_array'];
        if (words !== undefined) {
          res.send(result.body['associations_array']);
        } else {
          res.send('No associated keywords found');
        }
      }
  });
};
