/**
 * Data Handler for Author objects
 */
var Author = require('../models/auteurs');

// retrieve array of authors
module.exports.findAll = function (request, response) {
	Author.find(function (err, auteurs) {
		if (err) {
			return next(err);
		}
		response.json(auteurs);
	})
}

// Insert new Author record in the db
module.exports.upsert = function (request, response) {
	var author = new Author({
		achternaam : request.body.achternaam,
		voornaam: request.body.voornaam,
		tussenvoegsel  : request.body.tussenvoegsel,
		specialiteit  : request.body.specialiteit
	});
	
	author.save(function (err, author) {
		// return error if there was one
		if (err) {
			return next(err);
		}
		
		// if OK: return status 201 (Created) and author object
		response.status(201).json(author);
	});
}

// delete author from db
module.exports.remove = function (request, response) {
	Author.remove({_id: request.params.id}, function (err, removed) {
		if (err) {
			return next(err);
		}
		response.status(200).json(removed);
	})
}
