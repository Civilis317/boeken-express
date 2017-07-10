//Reference the angular module for the app
var booksExpressApp = angular.module('booksExpress');

booksExpressApp.controller('welcomeController', function($scope, $location, $route, $routeParams, $rootScope, alertService, httpService, pushPopService) {
	// array to hold error messages
	$scope.alerts = [];
	
	// if this controller was reached by route /logout, first perform logout
	if ('/logout' === $location.path()) {
		httpService.get('../secure-api/logout', null, $scope.alerts).then(function(data){
			console.log(JSON.stringify(data));
		});
	}
	
	// page title
	$scope.pageTitle = 'Welcome';
	
	// call rest service to get page object
	var url = '../version';
	httpService.get(url, null, $scope.alerts).then(function(data){
		$scope.version = data;
	});
	
	url = '../api/menu';
	httpService.get(url, null, $scope.alerts).then(function(data){
		$scope.menu = data.menu;
	});

});