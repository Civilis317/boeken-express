/**
 * Handler for jsonwebtoken authentication
 */

var jwt = require('jsonwebtoken');

module.exports.logout = function(request, response) {
	response.clearCookie('token');
	response.json({authenticated: false});
}

module.exports.authenticate = function (request, response) {
	// construct user object
	var user = {
			username: "",
			pwd: ""
	}
	
    user.username = request.body.username;
    user.pwd = request.body.pwd;
	console.log(JSON.stringify(user));
	
	// define expiration 
	var expiration = {
			expiresIn: 4000
	}
	
	// create token
	var token = jwt.sign(user, process.env.SECRET_KEY, expiration);

	// add token to cookie httpOnly = not accessible by browser-javascript, secure=cookie will only be sent over https
	response.cookie('token',token,{ httpOnly: true });
//	response.cookie('x-test-5','httpOnly and secure',{ httpOnly: true, secure: true });

	// create response:
	response.json({
		success: true
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
				console.log("token verified")
				next();
			}
		});
	}
}