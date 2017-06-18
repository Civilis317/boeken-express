//Reference the angular module for the app
var booksExpressApp = angular.module('booksExpress');

booksExpressApp.controller('menuController', function($scope, $location, $route, $routeParams, $rootScope, alertService, httpService, pushPopService) {
	// array to hold error messages
	$scope.alerts = [];
	
	// page title
	$scope.pageTitle = 'Menu';
	
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
