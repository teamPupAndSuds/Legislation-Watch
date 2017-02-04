//import { wordAssocAPIk } from './api_config.js';
var apiKey = require('./api_config.js');
var path = require('path');
var unirest = require('unirest');
var User = require('./../../db/models/user');
var util = require('./utility.js');

/////////////////////////////////////////////////////////////////
//AUTHENTICATION

exports.userLogin = function(req, res) {

  console.log('request-handler.js: userLogin: entered');  
  var username = req.body.username;
  var password = req.body.password;

  console.log('request-handler.js: userLogin: username is:', username);
  console.log('request-handler.js: userLogin: password is:', password);

  User.findOne( {username: username} )
    .exec(function(err, user) {
      if (!err) {
        if (!user) {
          console.log('request-handler.js: userLogin: username not found');
          res.status(401);
          res.end();
        } else {
          console.log('request-handler.js: userLogin: username found, comparing passwords');          
          util.comparePassword(password, user.password, function(err, match) {
            if (match) {
              console.log('request-handler.js: userLogin: username found, password match');                 
              util.createSession(req, res, user);
            } else {
              console.log('request-handler.js: userLogin: username found, password DO NOT match');                    
              res.status(401);
              res.end();
            }
          });
        }
      } else {
        console.log('request-handler.js: userLogin: database error on locating username');    
        res.status(401).send(err);
      }
    });
};

exports.userLogout = function(req, res) {
  req.session.destroy(function() {
    res.status(200);
    res.end();
  });
};


exports.userSignup = function(req, res) {
  var username = req.params.username;

  console.log('request-handler.js: userSignup: entered');

/////////////////////////////////////////////////////////////////
//CHECKS USER DB 
/////////////////////////////////////////////////////////////////

  User.findOne({ username: username})
    .exec(function(err, user) {
      if (!user) {

        console.log('request-handler.js: userSignup: username free');
        console.log('request-handler.js: userSignup: signup data:', req.body);

      //If user profile is not taken, creates a new user profile
        var password = req.body['password'];
        var userEmail = req.body['email'];
        var userAddress = req.body['address'];


        ///////////////////////////////////////////////
        //building location object to save to userdb
        ///////////////////////////////////////////////

        var location = {};
        location['houseNum'] = userAddress['houseNum'].toString();
        location['street'] = userAddress['streetName'];
        location['city'] = userAddress['city'];
        location['state'] = userAddress['state'];
        var userInfo = {
          username: username,
          password: password,
          location: location,
          email: userEmail,
          keywords: {}
        };

        console.log('request-handler.js: userSignup: userinfo:', userInfo);

        ///////////////////////////////////////////////
        // building address string to feed to geoCode
        ///////////////////////////////////////////////

        var streetAddress = userAddress['houseNum'].toString();        
        streetAddress = streetAddress.concat(
          ' ',
          userAddress['streetName'],
          ', ',
          userAddress['city'],
          ', ',
          userAddress['state']
          );

        console.log('request-handler.js: userSignup: streetAddress:', streetAddress);        

        ////////////////////////////////////////////
        util.geoCodeit(res, userInfo, streetAddress, function(err, response) {
          if (!err) {
            var geoLocation = response.json.results[0].geometry.location;
            userInfo['latitude'] = geoLocation.lat;
            userInfo['longitude'] = geoLocation.lng;
            ////////////////////////////////////////////
            // creates new user and save to DB
            ////////////////////////////////////////////
            var newUser = new User(userInfo);
            newUser.save(function(err, newUser) {
              if (err) {
                console.log('request-handler.js: userSignup: fail to SaveUser to DB');
                res.status(500).send(err);
              } else {
              /////////////////////////////////////////////////////////
              // creates new client session for a successful sign-up
              /////////////////////////////////////////////////////////
                console.log('request-handler.js: userSignup: save user OK: newUser is:', newUser);
                util.createSession(req, res, newUser);
              }
            });
          } else {
            console.log('request-handler.js: userSignup: geolocation failed');
            res.status(401).send('Unable to get user geolocation');
          }
        });
      } else {
        //USER PROFILE IN USE
        res.status(401);

        console.log('request-handler.js: userSignup: user profile already in use');

        res.send('Username already in use');
      }
    });
};

/////////////////////////////////////////////////////////////////
//HANDLES NEW USER WORD MONITOR

exports.insertWordMonitor = function(req, res) {
  var username = req.params.username;
  var keywords = req.body.keywords;
  keywords = keywords.trim();

  console.log('request-handler.js: insertWordMonitor: insert keywords:', keywords);

  User.findOne( {username: username} ) 
    .exec(function(err, user) {
      if (!err) {
        if (!user) {
          console.log('request-handler.js: insertWordMonitor: user does not exist', username);
          res.status(401);
          res.end();
        } else {
          console.log('request-handler.js: insertWordMonitor: user exist', user);

          // Initialize User Keyword if it doesn't already exist
          if (user['keywords'] === undefined) {
            user['keywords'] = [];
          }

          // See if this keyword already exist
          if (user['keywords'][keywords] !== undefined) {
            // If so, don't need to do anything
            console.log('request-handler.js: insertWordMonitor: keyword already exist');            
            res.status(200).end();
          } else {
            // Else we create a new keyword
            console.log('request-handler.js: insertWordMonitor: adding new keyword', keywords);
            util.keywordBuilder(user, keywords, function(err, user) {
              if (!err) {
                //call billassociator

                // Send the client the user object with the new results
                console.log('request-handler.js: insertWordMonitor: keyword added, sending user object back to client:', user);      
                res.status(200).send(user);
              } else {
                console.log('request-handler.js: insertWordMonitor: keyword adding failed');                   
                res.status(500).send(err);
              }
            });
          }
        }
      } else {
        res.status(401).send(err);
      }
    });
};

/////////////////////////////////////////////////////////////////
//HANDLES DELETION OF WORD MONITOR

exports.deleteWordMonitor = function(req, res) {
  var username = req.params.username;
  var keywords = req.body.keywords;
  keywords = keywords.trim();

  User.findOne( {username: username} )
    .exec(function(err, user) {
      if (!err) {
        if (!user) {
          res.status(401);
          res.end();
        } else {
          if (user['keywords'][keywords] !== undefined) {
            delete user['keywords'][keywords];
            util.sendUserData(req, res);
          } else {
            util.sendUserData(req, res);
          }
        }
      } else {
        res.status(401).send(err);
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
  unirest.post('https://twinword-word-associations-v1.p.mashape.com/associations/')
    .header('X-Mashape-Key', apiKey.wordAssocAPIk['key'])
    .header('Content-Type', 'application/x-www-form-urlencoded')
    .header('Accept', 'application/json')
    .send(searchTerm)
    .end(function (result) {
      if (result.error) {
        res.status(401).end('Error fetching associated keywords');
      } else {
      //sends word association back to client as an array of words
        var words = result.body['associations_array'];
        if (words !== undefined) {
          res.status(200).send(result.body['associations_array']);
        } else {
          res.status(200).send('No associated keywords found');
        }
      }
  });
};
