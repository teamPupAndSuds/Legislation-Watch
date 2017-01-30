var request = require('request');
var mongoose = require('mongoose');
var fs = require('fs');

var config = require('./config');
var helpers = require('./httpHelpers');

mongoose.connect(config.databaseURL);





