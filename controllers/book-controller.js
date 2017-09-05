/**
 * Data Handler for Book objects
 */
var Book = require('../models/boeken');


//retrieve array of books
module.exports.findAll = function (request, response) {
	Book.find(function (err, books) {
		if (err) {
			console.log(err)
			return next(err);
		}
		response.json(books);
	})
}

//Insert new Book object in the db
module.exports.upsert = function (request, response) {
	var book = new Book({
		titel : request.body.titel,
		auteur: request.body.auteur,
		ISBN  : request.body.isbn
	});
 
	book.save(function (err, book) {
		if (err) {
			return next(err);
		}
		response.status(201).json(book);
	})
}

//delete book from db
module.exports.remove = function (request, response) {
	Book.remove({_id: request.params.id}, function (err, removed) {
		if (err) {
			return next(err);
		}
		response.status(200).json(removed);
	})
}
