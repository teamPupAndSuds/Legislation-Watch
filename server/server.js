// Initiate connection to DB
var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/billfetchertest');

var app = require('./server-config.js');

var port = process.env.PORT || 8080;

app.listen(port);

console.log('Server now listening on port ' + port);