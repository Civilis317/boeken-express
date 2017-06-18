/**
 * server.js - main js for the "Boeken-Express" app that maintains books and authors in a MongoDB datastor.
 */

// imports - npm
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var readYaml = require('read-yaml');
var jwt = require('jsonwebtoken');

// local resources
var bookController = require('./controllers/book-controller');
var authorController = require('./controllers/author-controller');
var authenticateController = require('./controllers/authenticate-controller');

// public api
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : true
}));



// some special stuff for Heroku deployment:
app.set('port', (process.env.PORT || 5000));
app.set('config', (process.env.CONFIG_PATH || 'application.yml'));

// static content
app.use("/", express.static(__dirname + '/public'));

// secure api
process.env.SECRET_KEY = '033a0dc6-49e4-11e7-a919-92ebcb67fe33';
app.use(session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: true }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

var secureRoutes = express.Router();
secureRoutes.use(bodyParser.json());
secureRoutes.use(bodyParser.urlencoded({
	extended : true
}));

// define context of secure api
app.use('/secure-api', secureRoutes);

// validation middleware:
secureRoutes.use(function(req, res, next) {
	var token = req.body.token || req.headers['token'];

	if (!token) {
		res.send("please provide a token");
	} else {
		jwt.verify(token, process.env.SECRET_KEY, function(err, decode) {
			if (err) {
				res.status(500).send("Invalid Token");
			} else {
				console.log("token verified")
				next();
			}
		});
	}
});

// call to get instruction
app.get('/api', function(req, res) {
	res.json({
		'Gebruik' : 'voer een GET of POST-call uit naar /boeken'
	})
});

// call to retrieve application version
var config = readYaml.sync(app.get('config'));
var version = config.application.version;
app.get("/version", function(request, response) {
//	
//	if (!request.session.token) {
//        return response.redirect('/login?returnUrl=' + encodeURIComponent('/version' + request.path));
//    }
	
//	// what cookies are sent from the browser:
//	console.log(JSON.stringify(request.headers));
//	
//	// or:
//	for(var item in request.headers) {
//	    console.log(item + ": " + request.headers[item]);
//	  }
//	
//
//	// set cookies:
//	response.cookie('x-test-1','httpOnly',{ httpOnly: true });
//	response.cookie('x-test-2','not httpOnly',{ httpOnly: false });
//	response.cookie('x-test-3','no options');
//	
//	response.cookie('x-test-4','secure',{ secure: true });
//	response.cookie('x-test-5','httpOnly and secure',{ httpOnly: true, secure: true });


	response.json(version);
});

app.get("/api/menu", function(request, response) {
	var result = { "menu": [{ "url": "/content/books", "name": "Books" }, { "url": "/content/authors", "name": "Authors" }]};
	response.json(result);
});

app.get("/login", function(request, response) {
	//response.json("should login");
    
	// log user out
    delete request.session.token;

    // move success message into local variable so it only appears once (single read)
    var viewData = { success: request.session.success };
    delete request.session.success;

    response.render('login', viewData);
    //response.json("should login");
});


// call to get a jwt token
app.get("/api/authenticate", authenticateController.authenticate);

// Config Book endpoints
app.get('/api/books', bookController.findAll);
app.post('/api/books', bookController.upsert);
app.delete('/api/books/:id', bookController.remove);

//Config Authors endpoints
app.get('/api/authors', authorController.findAll);
app.post('/api/authors', authorController.upsert);
app.delete('/api/authors/:id', authorController.remove);

// Secure api calls
secureRoutes.get('/boeken', function(req, res, next) {
	Boek.find(function(err, boeken) {
		if (err) {
			return next(err);
		}
		res.json(boeken);
	})
});

secureRoutes.post('/boeken', function(req, res, next) {
	// 2a. nieuw boekobject maken.
	var boek = new Boek({
		titel : req.body.titel,
		auteur : req.body.auteur,
		ISBN : req.body.isbn
	});

	// 2b. Opslaan in database.
	boek.save(function(err, boek) {
		// indien error: teruggeven
		if (err) {
			return next(err);
		}
		// indien OK: status 201 (Created) en boekobject teruggeven
		res.status(201).json(boek);
	})
});


// Server startup
app.listen(app.get('port'), function() {
	console.log('NodeJS Server started and listening at port: ' + app.get('port'));
	console.log('version: ' + version);
//console.log(process.env)
});