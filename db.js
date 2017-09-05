//db.js - logica voor verbinden met MongoDB

var express = require('express'); // express is needed to set config path:
var mongoose = require('mongoose'); 
var readYaml = require('read-yaml');

// Read config yml:
var app = express();
app.set('config', (process.env.CONFIG_PATH || 'application.yml'));
var config = readYaml.sync(app.get('config'));

// Build connection string and authentication
var dbURI = `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}?authSource=admin`;
dbAuth = {
		useMongoClient: false,
		user: config.mongodb.username,
		pass: config.mongodb.password
}
  
// Create the database connection 
var db = mongoose.connect(dbURI, dbAuth); 

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
