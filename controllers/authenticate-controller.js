/**
 * Handler for jsonwebtoken authentication
 */

var jwt = require('jsonwebtoken');

module.exports.authenticate = function (request, response) {
	// create user object
	var user = {
			username: "johnDoe",
			email: "john.doe@acme.com"
	}
	
	// define expiration 
	var expiration = {
			expiresIn: 4000
	}
	
	// create token
	var token = jwt.sign(user, process.env.SECRET_KEY, expiration);
	
	// create response:
	response.json({
		success: true,
		token: token
	});
	
}
 