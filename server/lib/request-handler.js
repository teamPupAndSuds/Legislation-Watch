var request = require('request');
var path = require('path');

//change db path
var db = require('/../../db');
//

//TODO: implement bill search handler to return full bill text
exports.billSearch = function(req, res) {

}

//Renders home page
exports.renderIndex = function(req, res) {
	res.sendFile(path.join(__dirname, '/../../client/index.html'));
}