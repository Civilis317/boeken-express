//db.js - logica voor verbinden met MongoDB
/*
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/boeken', function () {
	console.log('mongoose connected');
});
module.exports = db;
*/

// express needed to set config path:
var express = require('express');
var app = express();
app.set('config', (process.env.CONFIG_PATH || 'application.yml'));


// Bring Mongoose into the app 
var mongoose = require('mongoose'); 

function assembleDbURI() {
	var readYaml = require('read-yaml');
	var config = readYaml.sync(app.get('config'));
//	console.log(JSON.stringify(config))
	
	var user = config.mongodb.username;
	var pwd = config.mongodb.password;
	var host = config.mongodb.host;
	var port = config.mongodb.port;
	var database = config.mongodb.db;
	
	var result = 'mongodb://';
	
	if (user && pwd) {
		result += user + ':' + pwd + '@'
	}
	
	result += host + ':' + port + '/' + database;
	
	return result;
}
  
//Build the connection string 
//var dbURI = 'mongodb://heroku_r250g6l4:m8m9pfp39aklpnskhbua06l7n1@ds155191.mlab.com:55191/heroku_r250g6l4';
var dbURI = assembleDbURI();
//console.log('dbURI: ' + dbURI);
  
// Create the database connection 
var db = mongoose.connect(dbURI); 

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + dbURI);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

module.exports = db;




