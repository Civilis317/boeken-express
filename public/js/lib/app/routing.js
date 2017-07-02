//Define an angular module for the app
var booksExpressApp = angular.module('booksExpress');

// Define Routing for app
booksExpressApp.config([ '$routeProvider', function($routeProvider) {
	
	$routeProvider.when('/welcome', {
		templateUrl : 'welcome.html',
		controller : 'welcomeController'
			
	}).when('/content/:contentType', {
		templateUrl : 'implementingPageContainer.html',
		controller : 'contentController'
			
	}).when('/content/:contentType/:secret', {
		templateUrl : 'implementingPageContainer.html',
		controller : 'contentController'
			
	}).when('/login', {
		templateUrl : 'implementingPageContainer.html',
		controller : 'loginController'
			
	}).when('/logout', {
		templateUrl : 'welcome.html',
		controller : 'welcomeController'
			
	});
} ]);
