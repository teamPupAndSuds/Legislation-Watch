var bcrypt = require('bcrypt-nodejs');
//check if user is logged in
exports.isLoggedIn = function(req, res) {
	return req.session ? !!req.session.user : false;
};

exports.checkUser = function(req, res, next) {
	if (!exports.isLoggedIn(req)) {
	    res.writeHead(401).send();
	  } else {
	    res.writeHead(200).send();
	  }
	};

exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
      req.session.user = newUser;
      res.writeHead(200).send();
    });
};

exports.comparePassword = function(candidatePassword, savedPassword, cb) {
	bcrypt.compare(candidatePassword, savedPassword, function(err, isMatch) {
		if (err) {
			return cb(err);
		} else {
			cb(null, isMatch);
		}
	});
};