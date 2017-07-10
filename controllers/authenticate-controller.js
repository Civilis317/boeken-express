/**
 * Handler for jsonwebtoken authentication
 */
var User = require('../models/users');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

module.exports.getUser = function (request, response) {
	var data;
	var userId = request.params.id;
	
	if (!userId) {
		data = new User({
			username    : '',
			displayname : '',
			pwdhash     : '',
			admin       : false,
			active      : false
		});
	}
	response.json(data);
}


module.exports.logout = function(request, response) {
	response.clearCookie('token');
	response.json({authenticated: false});
}

module.exports.register = function (request, response) {
	var successFlag = false;
	var reason;
	var user = request.body;
	console.log(JSON.stringify(user));
	
	// check for existing user:
	User.find({username: user.username}, function(err, data) {
		if (err) {
			return next(err);
		}
		
		if (0 == data.length) {
			console.log('existing user not found, ready to insert')
			var pwdhash = crypto.createHash('md5').update(user.pwdhash).digest("hex");
			
			var newUser = new User({
				username    : user.username,
				displayname : user.displayname,
				pwdhash     : pwdhash,
				admin       : false,
				active      : true
			});
			
			newUser.save(function (err, data) {
				if (err) {
					return next(err);
				}
				console.log('saved user: ' + JSON.stringify(data))
			})

			successFlag = true;
		} else {
			console.log('existing user found')
			successFlag = false;
			reason = 'username already taken';
		}
	});
	
	response.json({
		success: successFlag,
		reason: reason
	});
}

module.exports.authenticate = function (request, response) {
	// provided credentials
	var username = request.body.username;
	var password = request.body.pwdhash;
	
	// find db user having the provided username
	User.find({username: username}, function(err, data) {
		if (err) {
			return next(err);
		}
		
		if (1 == data.length) {
			// user found, now check provided password
			var user = data[0];
			var pwdhash = crypto.createHash('md5').update(password).digest("hex");
			
			if (pwdhash === user.pwdhash) {
				// authentication successful, now create jwt token
				var token = jwt.sign(user, process.env.SECRET_KEY, {expiresIn: 4000});

				// add token to cookie httpOnly = not accessible by browser-javascript, secure=cookie will only be sent over https
				response.cookie('token',token,{ httpOnly: true, maxAge: 10000 });
//				response.cookie('x-test-5','httpOnly and secure',{ httpOnly: true, secure: true });
				
				response.json({success: true});
			} else {
				response.status(403).send("authentication failed");
			}
		} else {
			response.status(403).send("authentication failed");
		}
	});
}

module.exports.verifyToken = function(request, response, next) {
	var token = request.cookies['token'];
	console.log('token: ' + token)

	if (!token) {
		console.log(request.path)
		response.status(403).send("please provide a token");
	} else {
		jwt.verify(token, process.env.SECRET_KEY, function(err, decode) {
			if (err) {
				response.status(500).send("Invalid Token");
			} else {
				// refersh cookie
				response.cookie('token',token,{ httpOnly: true, maxAge: 10000 });
				console.log("token verified")
				next();
			}
		});
	}
}