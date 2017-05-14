/**
 * Model voor auteurs in the boeken db
 */
// boeken.js : Model voor boeken in MongoDB-database
var db = require('../db');

var Auteur = db.model('Auteur', {
	achternaam : {type: String, required: true},
	voornaam   : {type: String, required: false},
	tussenvoegsel : {type: String, required: false},
	specialiteit : {type: String, required: true},
	
});

module.exports = Auteur;
