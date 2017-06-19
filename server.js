/**
 * server.js - main js for the "Boeken-Express" app that maintains books and authors in a MongoDB datastor.
 */

// imports - npm
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var readYaml = require('read-yaml');
var jwt = require('jsonwebtoken');

// local resources
var bookController = require('./controllers/book-controller');
var authorController = require('./controllers/author-controller');
var authenticateController = require('./controllers/authenticate-controller');

// public api
//app.use(cookieParser());
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
var secureRoutes = express.Router();
secureRoutes.use(bodyParser.json());
secureRoutes.use(bodyParser.urlencoded({
	extended : true
}));
secureRoutes.use(cookieParser());

// define context of secure api
app.use('/secure-api', secureRoutes);

// validation middleware:
secureRoutes.use(authenticateController.verifyToken);

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
	var result = { "menu": [{ "url": "/content/books", "name": "Books" }, { "url": "/content/authors", "name": "Authors" }, { "url": "/content/books/true", "name": "Secrets" }]};
	response.json(result);
});

// call to get a jwt token
app.post("/api/authenticate", authenticateController.authenticate);

// Config Book endpoints
app.get('/api/books', bookController.findAll);
app.post('/api/books', bookController.upsert);
app.delete('/api/books/:id', bookController.remove);

//Config Authors endpoints
app.get('/api/authors', authorController.findAll);
app.post('/api/authors', authorController.upsert);
app.delete('/api/authors/:id', authorController.remove);

// Secure api calls
secureRoutes.get('/books', bookController.findAll);


// Server startup
app.listen(app.get('port'), function() {
	console.log('NodeJS Server started and listening at port: ' + app.get('port'));
	console.log('version: ' + version);
//console.log(process.env)
});