(function(angular, $, undefined){

'use strict';

/**
 * Copyright (c) 2013, Bernhard Posselt <nukeawhale@gmail.com> 
 * Copyright (c) 2013, Alessandro Cosentino <cosenal@gmail.com> 
 * This file is licensed under the Affero General Public License version 3 or later. 
 * See the COPYING file.
 */

// this file is just for defining the main container to easily swap this in
// tests
angular.module('News', []);
// define your routes in here
angular.module('News').config(['$routeProvider', function ($routeProvider) {

	$routeProvider.when('/', {
		templateUrl: 'main.html',

	}).when('/login', {
		templateUrl: 'login.html',
		controller: 'LoginController'

	}).otherwise({
		redirectTo: '/'
	});

}]);
angular.module('News').controller('LoginController', ['$scope', function ($scope) {

	$scope.val = 'test';

}]);
angular.module('News').factory('Login', ['$http', function ($http) {

	return {
		userName: '',
		password: ''
	};

}]);
})(window.angular, jQuery);