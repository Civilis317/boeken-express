/**
 * Model for users in mongodb
 */

var db = require('../db');

var User = db.model('User', {
	username    : {type: String,  required: true},
	displayname : {type: String,  required: true},
	pwdhash     : {type: String,  required: true},
	admin       : {type: Boolean, required: true},
	active      : {type: Boolean, required: true},
	
});

module.exports = User;