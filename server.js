// server.js - applicatie voor het ophalen en
// opslaan van boeken in MongoDB
var express = require('express');
var bodyParser = require('body-parser');
//var http = require('http');
var readYaml = require('read-yaml');
var jwt = require('jsonwebtoken');
var bookController = require('./controllers/book-controller');
var authorController = require('./controllers/author-controller');
var authenticateController = require('./controllers/authenticate-controller');

var app = express();
var secureRoutes = express.Router();

// 0. Middleware: JSON & form-data verwerken in body van request

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

secureRoutes.use(bodyParser.json());
secureRoutes.use(bodyParser.urlencoded({
	extended: true
}));

// set defaultport to 5000 for use on heroku
app.set('port', (process.env.PORT || 5000));
app.set('config', (process.env.CONFIG_PATH || 'application.yml'));

// 0. Middleware: statische website serveren
app.use("/", express.static(__dirname + '/public'));
app.use('/secure-api', secureRoutes);

var config = readYaml.sync(app.get('config'));
var version = config.application.version;

// add authentication
process.env.SECRET_KEY = '033a0dc6-49e4-11e7-a919-92ebcb67fe33';
app.get("/api/authenticate", authenticateController.authenticate);

app.get("/version", function(request, response) {
	response.json(version);
});


// 1. Eenvoudige instructie
app.get('/api', function (req, res) {
	res.json({'Gebruik': 'voer een GET of POST-call uit naar /boeken'})
});

// validation middleware:
secureRoutes.use(function(req, res, next){
	var token = req.body.token || req.headers['token'];
	
	if (! token) {
		res.send ("please provide a token");
	} else {
		jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
			if (err) {
				res.status(500).send("Invalid Token");
			} else {
				console.log ("token verified")
				next();
			}
		});
	}
});

//2. POST-endpoint: nieuw boek in de database plaatsen.
secureRoutes.post('/boeken', function (req, res, next) {
	// 2a. nieuw boekobject maken.
	var boek = new Boek({
		titel : req.body.titel,
		auteur: req.body.auteur,
		ISBN  : req.body.isbn
	});
 
	// 2b. Opslaan in database.
	boek.save(function (err, boek) {
		// indien error: teruggeven
		if (err) {
			return next(err);
		}
		// indien OK: status 201 (Created) en boekobject teruggeven
		res.status(201).json(boek);
	})
});

//3. GET-endpoint: boeken ophalen
secureRoutes.get('/boeken', function (req, res, next) {
	Boek.find(function (err, boeken) {
		if (err) {
			return next(err);
		}
		res.json(boeken);
	})
});

// Config Book endpoints
app.get('/api/boeken', bookController.findAll);
app.post('/api/boeken', bookController.upsert);
app.delete('/api/boeken/:id', bookController.remove);

//Config Authors endpoints
app.get('/api/auteurs', authorController.findAll);
app.post('/api/auteurs', authorController.upsert);
app.delete('/api/auteurs/:id', authorController.remove);


// 5. Server startup
app.listen(app.get('port'), function () {
	console.log('NodeJS Server started and listening at port: ' + app.get('port'));
	console.log('version: ' + version);
	//console.log(process.env)
});
