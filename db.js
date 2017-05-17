//db.js - logica voor verbinden met MongoDB
/*
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/boeken', function () {
	console.log('mongoose connected');
});
module.exports = db;
*/

// Bring Mongoose into the app 
var mongoose = require('mongoose'); 

// Import YamlReader 
var readYaml = require('read-yaml');
var config = readYaml.sync('application.yml');
//console.log(JSON.stringify(config))
  
var host = config.mongodb.host;
var port = config.mongodb.port;
var database = config.mongodb.db;
  
//Build the connection string 
var dbURI = 'mongodb://' + host + ':' + port + '/' + database
  
//var dbURI = 'mongodb://localhost/boeken'; 
//var dbURI = 'mongodb://newgrange:27017/boeken'; 

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




