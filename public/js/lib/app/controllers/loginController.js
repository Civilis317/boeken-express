/**
 * loginController.js
 */

//Reference the angular module for the app
var booksExpressApp = angular.module('booksExpress');
booksExpressApp.controller('loginController', function($scope, $location, $route, $routeParams, $rootScope, $timeout, alertService, httpService, pushPopService) {

	// array to hold error messages
	$scope.alerts = [];
	
	$scope.closeAlert = function(index) {
		alertService.closeAlert(index, $scope.alerts);
	};
	
	// get app version
	httpService.get('../version', null, $scope.alerts).then(function(data){
		$scope.version = data;
	});
	
	// menu
	httpService.get('../api/menu', null, $scope.alerts).then(function(data){
		$scope.menu = data.menu;
	});
	
	// is menuItem the current menuItem?
	$scope.isActive = function (menuItem) { 
        return menuItem.url === $location.path();
    };
	
	// page title
	if ('/login' === $location.path()) {
		$scope.pageTitle = 'Login';
		$scope.implementingPage = 'login.html';
		var url = '../api/authenticate';
	} else if ('/register' === $location.path()) {
		$scope.pageTitle = 'Register';
		$scope.implementingPage = 'registration.html';
		var url = '../api/register';
	}
	
	// provide scope with empty user object
	httpService.get('../api/getEmptyUser', null, $scope.alerts).then(function(data){
		$scope.newUser= data;
	});
	
	// registration method
	$scope.performRegistration = function () {
		httpService.post('../api/register', $scope.newUser, $scope.alerts).then(function(data){
			if (data.success) {
				// redirect to login page
				$location.url('/login');
			} else {
				// show error
			}
			
		});
	}
	
	// login method
	$scope.performLogin = function () {
		httpService.post('../api/authenticate', $scope.newUser, $scope.alerts).then(function(data){
			if (data.success) {
				var token = data.token;
				
				// if returnUrl is given, head on to that location
				if ($routeParams.returnUrl) {
					$location.url($routeParams.returnUrl);
				} else {
					$location.url('/welcome');
				}
		
			} else {
				// go back to route login?
			}
		});
	}

});
