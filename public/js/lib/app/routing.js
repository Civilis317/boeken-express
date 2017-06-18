//Define an angular module for the app
var booksExpressApp = angular.module('booksExpress');

// Define Routing for app
booksExpressApp.config([ '$routeProvider', function($routeProvider) {
	
	$routeProvider.when('/menu', {
		templateUrl : 'menu.html',
		controller : 'menuController'
			
	}).when('/content/:contentType', {
		templateUrl : 'implementingPageContainer.html',
		controller : 'contentController'
			
	});
} ]);
