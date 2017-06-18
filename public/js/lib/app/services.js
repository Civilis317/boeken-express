//Define the angular module for the app
var booksExpressApp = angular.module('booksExpress');

booksExpressApp.factory('alertService', function($timeout) {

	clearAlerts = function(alerts) {
		alerts = [];
	};

	return {
		getAlerts : function() {
			return alerts;
		},
		addInfoAlert : function(alertMsg, alerts) {
			this.addAlert('info', alertMsg, true, alerts);
		},
		addWarningAlert : function(alertMsg, alerts) {
			this.addAlert('warning', alertMsg, false, alerts);
		},
		addErrorAlert : function(alertMsg, alerts) {
			this.addAlert('danger', alertMsg, false, alerts);
		},
		addSuccessAlert : function(alertMsg, alerts) {
			this.addAlert('success', alertMsg, true, alerts);
		},
		addAlert : function(alertType, alertMsg, doTimeout, alerts) {
			clearAlerts(alerts);
			alerts.push({
				type : alertType,
				msg : alertMsg
			});
			
			if (doTimeout) {
				// message visible for 3 seconds
				$timeout(function() {
					alerts.splice(0, 1);
				}, 3000);
			}
		},
		closeAlert : function(index, alerts) {
			alerts.splice(index, 1);
		}
	};
});

function showSpinner(on){
	if(on){
		document.getElementById("page").style.display = "none"
		document.getElementById("page").parentNode.className = "loading"
	}
	else{
		document.getElementById("page").parentNode.className = ""
		document.getElementById("page").style.display = ""
	}

};

// Here we define the 'find' functionality that we 'add' to the Array prototype.
// This functionality is used to extract and return an Array element based on the given 'find' function (predicate).
// This 'find' function must return a boolean indicating whether the 'find' criteria have been met or not.
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    // 'this' is the Array we're searching in
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var targetObject;

    // Loop through all objects in the Array...
    for (var i = 0; i < length; i++) {
    	targetObject = list[i];
//      if (predicate.call(thisArg, value, i, list)) {
        if (predicate.call(thisArg, targetObject)) {
            return targetObject;
      }
    }
    return undefined;
  };
}

booksExpressApp.factory('httpService', function($q, $http, alertService) {
	var get = function(url, config, alerts) {
		var result;
		var deferred = $q.defer();
			
		$http.get(url, config).success(function(res, status, headers) {
			
			if ('text/html' == headers('Content-Type')) {
				alertService.addErrorAlert('Communication Timeout.', alerts);
			} else {
				result = res;
				deferred.resolve(result);
			}
		}).error(function(data, status, headers) {
				
			if (status == 403) {
				alertService.addErrorAlert('Not authorized', $scope.alerts);
			} else {
				if ('text/plain' == headers('Content-Type').substring(0, 10)) {
					alertService.addErrorAlert(data, alerts);
				} else {
					alertService.addErrorAlert('Unanticipated error', alerts);
					
				}
			}
			
			deferred.reject()
		});
		
		return deferred.promise;
	}
	
	var call = function(url, data, alerts) {
		var result;
		var deferred = $q.defer();
			
		$http.post(url, data).success(function(res, status, headers) {
			if ('text/html' == headers('Content-Type')) {
				alertService.addErrorAlert('Timeout in communicatie met webserver.', alerts);
			} else {
				result = res;
				deferred.resolve(result);
			}
		}).error(function(data, status, headers) {
			if (status == 403) {
				alertService.addErrorAlert('U bent niet geautoriseerd voor deze functie.', $scope.alerts);
			} else {
				if ('text/plain' == headers('Content-Type').substring(0, 10)) {
					alertService.addErrorAlert(data, alerts);
				} else {
					alertService.addErrorAlert('Er is een onverwachte fout opgetreden.', alerts);
					
				}
			}
			
			deferred.reject()
		});
		
		return deferred.promise;
	}
	
	var del = function(url, data, alerts) {
		var result;
		var deferred = $q.defer();
			
		$http.delete(url, data).success(function(res, status, headers) {
			if ('text/html' == headers('Content-Type')) {
				alertService.addErrorAlert('Timeout in communicatie met webserver.', alerts);
			} else {
				result = res;
				deferred.resolve(result);
			}
		}).error(function(data, status, headers) {
			if (status == 403) {
				alertService.addErrorAlert('U bent niet geautoriseerd voor deze functie.', $scope.alerts);
			} else {
				if ('text/plain' == headers('Content-Type').substring(0, 10)) {
					alertService.addErrorAlert(data, alerts);
				} else {
					alertService.addErrorAlert('Er is een onverwachte fout opgetreden.', alerts);
					
				}
			}
			
			deferred.reject()
		});
		
		return deferred.promise;
	}
	
	return {
		post : call,
		get  : get,
		delete : del
	};

});

booksExpressApp.factory('pushPopService', function() {
	var localStore = [];
	
	var push = function (data) {
		var guid = getGuid();
		localStore[guid] = data;
		return guid;
	};
	
	var pop = function(guid) {
		return localStore[guid];
	};
	
	return {
		push : push,
		pop : pop
	}
	
});