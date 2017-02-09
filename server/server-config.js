var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var path = require('path');
var morgan = require('morgan');
var cors = require('cors');
var handler = require('./lib/request-handler');
var util = require('./lib/utility.js');
var cors = require('cors');

var corsOptions = {
  origin: 'http://127.0.0.1:8080',
  credentials: true
};

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors(corsOptions));

/////////////////////////////////////////////////////////////////
//AUTHENTICATION
//express session
app.use(session({
  secret: 'shhh, it\'s a secret',
  resave: false,
  saveUninitialized: true,
}));

//endpoint for client request for current session's validity
//if current session logged in: respond with logged in user's information to client (status code: 200)
//if current session is not logged in: response with (status:code 401)
app.get('/login', util.checkUser);

//endpoint for user attempting to login with {username, password}
app.post('/login', handler.userLogin);

//handles user logout action
app.get('/logout', handler.userLogout);

//handles user signup action
app.post('/signup/:username', handler.userSignup);

//endpoints for adding and deleteing 'monitored keywords' for a particular user with :username
/////////////////////////////////////////////////////////////////
app.put('/user/:username/keywords', handler.insertWordMonitor);

app.delete('/user/:username/keywords', handler.deleteWordMonitor);
/////////////////////////////////////////////////////////////////

//endpoints for adding favorites
app.post('/user/:username/favorites', handler.insertFavoriteBills);

app.get('/user/:username/favorites', handler.getFavoriteBills);

//endpoints for adding comments
app.post('/comments/:billId/:username', handler.addComment);

app.get('/comments/:billId', handler.getComments);
//server up static files
app.use(express.static(path.join(__dirname + '/../client')));

//handles bill search
app.post('/searchterm', handler.termSearch);

module.exports = app;
