/**
 * Handler for jsonwebtoken authentication
 */

var jwt = require('jsonwebtoken');

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
	
	// create response:
	response.cookie('token',token,{ httpOnly: true });
//	response.cookie('x-test-5','httpOnly and secure',{ httpOnly: true, secure: true });
	response.json({
		success: true
	});
	
}

module.exports.verifyToken = function(request, response, next) {
	var token = request.cookies['token'];
	console.log('token: ' + token)

	if (!token) {
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