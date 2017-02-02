//import { wordAssocAPIk } from './api_config.js';
var apiKey = require('./api_config.js');
var path = require('path');
var unirest = require('unirest');
var User = require('/../../db/models/user');
var util = require('./utility.js');
//var db = require('/../../db');

/////////////////////////////////////////////////////////////////
//AUTHENTICATION

exports.userLogin = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne( {username: username} )
    .exec(function(err, user) {
      if(!user) {
        res.writeHead(401).send();
      } else {
        util.comparePassword(password, user.password, function(err, match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.writeHead(401).send();
          }
        });
      }
    });
};

exports.userLogout = function(req, res) {
  req.session.destroy(function() {
    res.writeHead(200).send();
  });
};


exports.userSignup = function(req, res) {
  var username = req.params.username;
  var password = req.body.password;
  var userEmail = req.body.email;
  var userAddress = req.body.address;
  var streetAddress = userAddress['houseNum'];
  streeAddress.concat(
    userAddress['streetName'],
    ', ',
    userAddress['city'],
    ', ',
    userAddress['state']
    );

};


/////////////////////////////////////////////////////////////////
//BILL SEARCH
//termSearch function that utilizes a word-association API to get
//list of word associated with user search word(s)
exports.termSearch = function(req, res) {
  //searchTerm format: "entry=term"
  var searchTerm = 'entry=';

  //req.body.term comes in as an array of search terms input form user
  //convert search term array to string
  var searchTerms = req.body['term'].slice();
  searchTerms.toString();
  searchTerm.concat(searchTerms);

  //sends post request to Twinword API with user entered search term
  unirest.post("https://twinword-word-associations-v1.p.mashape.com/associations/")
    .header("X-Mashape-Key", apiKey.wordAssocAPIk['key'])
    .header("Content-Type", "application/x-www-form-urlencoded")
    .header("Accept", "application/json")
    .send(searchTerm)
    .end(function (result) {
      //sends word association back to client as an array of words
      res.writeHead(200).send(result.body['associations_array']);
  });
};
