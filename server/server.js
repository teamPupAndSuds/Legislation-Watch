// Initiate connection to DB
var mongoose = require('mongoose');
//MONGODB CONNECTION
mongoose.connect('mongodb://localhost/billfetchertest');

var app = require('./server-config.js');
//HTTP SERVER CONNECTION
var port = process.env.PORT || 8080;

app.listen(port);

console.log('Server now listening on port ' + port);