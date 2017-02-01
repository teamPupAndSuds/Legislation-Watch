var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var path = require('path');
var handler = require('./lib/request-handler');

var app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/../client')));

app.post('/searchterm', handler.termSearch);

module.exports = app;
