var apiKey = require('./api_config.js');
var path = require('path');
var unirest = require('unirest');
var User = require('./../../db/models/user');
var util = require('./utility.js');
var BillAssociate = require('./billAssociate.js');
var Q = require('q');
var Favorites = require('./../../db/models/favorites');
var Comment = require('./../../db/models/comment');

// Promisifying Database functions
var addFavorite = Q.nbind(Favorites.create, Favorites);
var getFavorite = Q.nbind(Favorites.find, Favorites);
//var getUser = Q.nbind(User.find, User);

var createComment = Q.nbind(Comment.create, Comment);
var findComments = Q.nbind(Comment.find, Comment);

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
              //After successful authentication, an express session is created for the user
                //and user data is sent to client. See utility.js - createSession/sendUserData for more info.   
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
            newUser.hashPassword(function() {
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
// HANDLES NEW USER MONITORED WORDS
/////////////////////////////////////////////////////////////////

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
            user['keywords'] = {};
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
                console.log('request-handler.js: insertWordMonitor: keyword building success, calling billAssociate method');

                BillAssociate.billAssociate(user['keywords'][keywords], function(error, data) {
                  if (error) {
                    res.stats(500).send(error);
                    res.end();
                  } else {
                  // Save to DB
                  
                    user.markModified('keywords');
                    user.save(function (err) {
                      if (err) {
                        console.log('request-handler.js: insertWordMonitor: saving user object failed', err);
                        res.stats(500).send(err);
                        res.end();
                      } else {
                        // Send the client the user object with the new results
                        console.log('request-handler.js: insertWordMonitor: keyword added, sending user object back to client:', user);
                        util.sendUserData(req, res, user);
                      }
                    });
                  }
                });
              } else {
                console.log('request-handler.js: insertWordMonitor: keyword adding failed');                   
                res.status(500).send(err);
                res.end();
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
// HANDLES DELETION OF MONITORED WORDS
/////////////////////////////////////////////////////////////////
exports.deleteWordMonitor = function(req, res) {
  var username = req.params.username;
  var keywordsToBeDeleted = req.body.keywords;
  keywordsToBeDeleted = keywordsToBeDeleted.trim();

  console.log('request-handler.js: deleteWordMonitor: entered: keyword to delete:', keywordsToBeDeleted);

  User.findOne( {username: username} )
    .exec(function(err, user) {
      if (!err) {
        if (!user) {
          res.status(401);
          res.end();
        } else {
          // Locate and delete the keyword
          if (user['keywords'][keywordsToBeDeleted] !== undefined) {
            delete user['keywords'][keywordsToBeDeleted];
            // Save to database
            user.markModified('keywords');
            user.save(function(err) {
              if (err) {
                res.statu(500);
                res.end(err);
              } else {
                // Ensure the session is pointed to this newly updated user model instance
                req.session.user = user;
                util.sendUserData(req, res);
              }
            });

            return;
          }
          // If we did not manage to find the keyword to be deleted
          console.log('request-handler.js: deleteWordMonitor: keyword to be deleted not found');
          res.status(404);
          res.end();
        }
      } else {
        res.status(401).send(err);
        res.end();
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

/////////////////////////////////////////////////////////////////
//FAVORITE LEGISLATION ADD
exports.insertFavoriteBills = function(req, res) {
  var newFavorite = {
    legislationId: req.body.legislationId,
    userName: req.params.username
  };

  console.log('this is the object ' + JSON.stringify(newFavorite));
  console.log('this is req body ' + JSON.stringify(req.body));

  addFavorite(newFavorite).then(function(data) {
    console.log('Favorite saved');
    return res.status(201).json(data);
  }).fail(function(err) {
    console.log('error saving favorite');
    console.log(err);
    return res.status(404).end();
  });
};

//
exports.getFavoriteBills = function(req, res) {
  getFavorite({}).then(function(data) {
    console.log('got all favs ' + JSON.stringify(data));
    return res.status(200).send(data);
  }).fail(function(err) {
    console.log('error getting favs');
    console.log(err);
    return res.stats(404).end();
  });
};

exports.addComment = function(req, res) {
  
  let commentObj = {
    billId: req.params.billId,
    username: req.params.username,
    text: req.body.text
  };

  createComment(commentObj)
  .then((newComment) => {
    console.log('Comment added!');
    return res.status(201).json(newComment);
  })
  .fail((err) => {
    console.error('Comment not added', err);
    return res.status(404).end();
  });
};

exports.getComments = function(req, res) {
  let billId = req.params.billId;

  findComments({billId: billId})
  .then((comments) => {
    console.log('Comments retrieved!');
    return res.status(200).json(comments);
  })
  .fail((err) => {
    console.error('Comments not found', err);
    return res.status(404).end();
  });
};