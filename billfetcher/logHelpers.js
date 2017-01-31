var config = require('./config');
var fs = require('fs');

var log = function(log) {
  fs.appendFile(config.logFile, new Date(Date.now()) + ': ' + log + '\n', function(err) {
    if (err) {
      console.log('Failed to write to log file: ', err);
    } 
  });
};

module.exports.log = log;