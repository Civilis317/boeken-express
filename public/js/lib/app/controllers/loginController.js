/**
 * loginController.js
 */

//Reference the angular module for the app
var booksExpressApp = angular.module('booksExpress');
booksExpressApp.controller('loginController', function($scope, $location, $route, $routeParams, $rootScope, $timeout, alertService, httpService, pushPopService) {
	// array to hold error messages
	$scope.alerts = [];
	
	// page title
	$scope.pageTitle = 'Login';
	
	// menu
	httpService.get('../api/menu', null, $scope.alerts).then(function(data){
		$scope.menu = data.menu;
	});
	
	// is menuItem the current menuItem?
	$scope.isActive = function (menuItem) { 
        return menuItem.url === $location.path();
    };
	
	// implementing page
	$scope.implementingPage = 'login.html';
	
	// setup base url
	var url = '../api/authenticate';
	
	// provide function and object
	$scope.createNewUser = function() {
		return {username: "", pwd: ""};
	}

	$scope.newUser = $scope.createNewUser();
	
	// get app version
	httpService.get('../version', null, $scope.alerts).then(function(data){
		$scope.version = data;
	});
	
	// upsert new object
	$scope.performLogin = function () {
		console.log(JSON.stringify($scope.newUser));
		httpService.post(url, $scope.newUser, $scope.alerts).then(function(data){
			console.log(JSON.stringify(data));
			if (data.success) {
				var token = data.token;
				//console.log(JSON.stringify(token));
				
				// if returnUrl is given, head on to that location
				if ($routeParams.returnUrl) {
					$location.url($routeParams.returnUrl);
				} else {
					$location.url('/menu');
				}
		
			} else {
				// go back to route login?
			}
		});
	}

});
