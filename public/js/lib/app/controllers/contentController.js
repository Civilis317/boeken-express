/**
 * bookController.js
 */
//Reference the angular module for the app
var booksExpressApp = angular.module('booksExpress');
booksExpressApp.controller('contentController', function($scope, $location, $route, $routeParams, $rootScope, $timeout, alertService, httpService, pushPopService) {
	// array to hold error messages
	$scope.alerts = [];
	
	// page title
	$scope.pageTitle = $routeParams.contentType;
	
	// menu
	httpService.get('../api/menu', null, $scope.alerts).then(function(data){
		$scope.menu = data.menu;
	});
	
	// is menuItem the current menuItem?
	$scope.isActive = function (menuItem) { 
        return menuItem.url === $location.path();
    };
	
	// implementing page
	$scope.implementingPage = $routeParams.contentType + '.html';
	
	// setup base url
	var baseUrl = '../api/';
	if ($routeParams.secret) {
		baseUrl = '../secure-api/';
	}
	var url = baseUrl + $routeParams.contentType;
	
	// provide function and object
	$scope.createNewObject = function() {
		var result;
		if ("books" === $routeParams.contentType) {
			result = {title: "", auteur: "", isbn: ""};
		} else if ("authors" === $routeParams.contentType) {
			result = {achternaam: "", voornaam: "", tussenvoegsel: "", specialiteit: ""};
		}
		return result;
	}

	$scope.newObject = $scope.createNewObject();
	
	// get app version
	httpService.get('../version', null, $scope.alerts).then(function(data){
		$scope.version = data;
	});
	
	// get the content
	httpService.get(url, null, $scope.alerts).then(function(data){
		$scope.data = data;
	});
	
	// toggle visibility of add-new-object-form
	$scope.formVisible = false;
	$scope.showForm = function () {
		$scope.formVisible = !$scope.formVisible;
	};
	
	// upsert new object
	$scope.addObject = function () {
		httpService.post(url, $scope.newObject, $scope.alerts).then(function(data){
			$scope.data.push(data);
			$scope.result = 'Object added!';
			$timeout(function () {
				// reset velden
				$scope.formVisible = false;
				$scope.result = '';
				$scope.newObject = $scope.createNewObject();
				}, 1500)			
		});
	}
	
	// delete specific object
	$scope.deleteObject = function (object) {
		var objectID;
		if ("books" === $routeParams.contentType) {
			objectID = object.titel;
		} else if ("authors" === $routeParams.contentType) {
			objectID = object.achternaam;
		}
		if (confirm(objectID + ' will be removed, are you sure?')) {
			
			httpService.delete(url + '/' + object._id, null, $scope.alerts).then(function(data){
				$scope.data.forEach(function(currentObject, index){
					if(currentObject._id === object._id){
						$scope.data.splice(index, 1);
					}
				});
			});
		}
	};
	


});
