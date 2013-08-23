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
        controller : 'MainController'

	}).when('/login', {
		templateUrl: 'login.html',
		controller: 'LoginController'

	}).otherwise({
		redirectTo: '/'
	});

}]);
angular.module('News').controller('LoginController', ['$scope', '$location', '$route' , 'Login', function ($scope, $location, $route, Login) {

	$scope.data = Login;

    $scope.logIn = function(){
        Login.login()
            .success(function(data,status){
                if(status == 200) {
                    Login.present = true;
                    $location.path("/");
                }
            })
            .error(function(data,status){
                alert("Status "+status+" ["+data.message+"]");
            });
    };

    $scope.isLoggedIn = function(){
        if(Login.present) {
            $location.path("/");
        }
    };

}]);
angular.module('News').controller('MainController', ['$scope', 'Login', function ($scope, Login) {
    $scope.view = '';
    $scope.action = '';
    $scope.folderId = '0';
    $scope.feedId = '0';

    $scope.getStarred = function(offset){
        $scope.action = 'Starred';
        Login.getStarredItems(offset)
            .success(function(data,status){
                $scope.view = 'Starred';
                $scope.data = data;
            })
            .error(function(data,status){
                alert("Status "+status+" ["+data.message+"]");
            });
    };

    $scope.getAll = function(offset){
        $scope.action = 'All';
        Login.getAllItems(offset)
            .success(function(data,status){
                $scope.view = 'All';
                $scope.data = data;
            })
            .error(function(data,status){
                alert("Status "+status+" ["+data.message+"]");
            });
    };

    $scope.getFolders = function(){
        Login.getFolders()
            .success(function(data, status){
                $scope.data = data;
                $scope.view = 'Folders';
            })
            .error(function(data, status){
                alert("Status "+status+" ["+data.message+"]");
            });
    };

    $scope.getFeeds = function(){
        Login.getFeeds()
            .success(function(data, status){
                $scope.data = data;
                $scope.view = 'Feeds';
            })
            .error(function(data, status){
                alert("Status "+status+" ["+data.message+"]");
            });
    };

    $scope.getFolderItems = function(folderId,offset){
        $scope.action = 'FolderItems';
        $scope.folderId = folderId;

        console.log(folderId+","+offset);
        Login.getFolderItems(folderId,offset)
            .success(function(data, status){
                $scope.data = data;
                console.log(data);
                $scope.view = 'All';
            })
            .error(function(data, status){
                alert("Status "+status+" ["+data.message+"]");
            });
    };

    $scope.getFeedItems = function(feedId,offset){
        $scope.action = 'FeedItems';
        $scope.feedId = feedId;

        Login.getFeedItems(feedId,offset)
            .success(function(data, status){
                $scope.data = data;
                console.log(data);
                $scope.view = 'All';
            })
            .error(function(data, status){
                alert("Status "+status+" ["+data.message+"]");
            });
    };

    $scope.getMoreItems = function(type){
        var offset = $scope.data.items.slice(-1)[0].id - 1;

        if(type == 'All' && $scope.action == 'All'){
            $scope.getAll(offset);
        }
        else if (type == 'Starred' && $scope.action == 'Starred'){
            console.log($scope.action+", "+$scope.type+", "+offset);
            $scope.getStarred(offset);
        }
        else if (type == 'All' && $scope.action == 'FolderItems'){
            //console.log(offset);
            $scope.getFolderItems($scope.folderId,offset);
        }
        else if (type == 'All' && $scope.action == 'FeedItems'){
            $scope.getFeedItems($scope.feedId,offset);
        }

    };

}]);
angular.module('News').directive('checkPresence', ['$http', '$location', '$timeout','Login', function ($http, $location, $timeout, Login) {
    return {
        restrict : "E",
        link : function tick(){
            if(Login.timerRef){
                $timeout.cancel(Login.timerRef);
            }
            if(Login.present){
                //$location.path('/');
            }
            else {
                Login.login()
                    .success(function(data, status){
                        if(status == 200){
                            //alert("Status "+status+" ["+data.message+"]");
                            $location.path('/');
                        }
                        else {
                            alert("Status "+status+" ["+data.message+"]");
                            $location.path('/login');
                        }
                    })
                    .error(function(data, status){
                        alert("Status "+status+" ["+data.message+"]");
                        $location.path('/login');
                    });
            }
            Login.timerRef = $timeout(tick,Login.timeout);
            console.log("ping");
        }
    };
}]);


angular.module('News').filter('trans', ['$locale', function ($locale) {

	return function (text) {
        if($locale.id == "sr-rs") {
            switch (text) {
                case "Username" :
                    return "Korisnicko ime";
                case "Password" :
                    return "Lozinka";
                case "Hostname" :
                    return "Lokacija servera";
                case "Sign in" :
                    return "Prijavi se";
                case "All":
                    return "Sve";
                case "Starred":
                    return "Favoriti";
                case "Folders":
                    return "Folderi";
                default:
                    return text;
            }

        } else if($locale.id == "en-us") {
            return text;
        }
	};

}]);
angular.module('News').factory('ExceptionHandler', ['$exceptionHandler', function ($exceptionHandler) {
    return function (exception, cause) {
        alert(exception.message);
    };
}]);
angular.module('News').factory('Login', ['$http', function ($http) {

	return {
		userName: 'ikacikac',
		password: 'ikacikac',
        present: false,
        timerRef : null,
        timeout: 20000,
        hostname : 'localhost/owncloud/index.php/apps/news/api/v1-2',
        //this.userName+":"+this.password+"@"+this.url+"/version"
        //TODO treba odraditi servis isLoggedIn u okviru ovog fajla posto je logicki u ovoj celini
		login: function	() {
            console.log("http://"+this.userName+":"+this.password+"@"+this.hostname+"/version");
			return $http.get("http://"+this.userName+":"+this.password+"@"+this.hostname+"/version");
		},

        getFolders : function(){
            return $http({ method : 'GET', url : "http://"+this.userName+":"+this.password+"@"+this.hostname+"/folders", cached : false });
        },

        getFeeds : function(){
            return $http({ method : 'GET', url : "http://"+this.userName+":"+this.password+"@"+this.hostname+"/feeds", cached : false });
        },

        getStarredItems : function(offset){
            var params = {
                "batchSize": 20, //  the number of items that should be returned, defaults to 20
                "offset": offset, // only return older (lower than equal that id) items than the one with id 30
                "type": 2, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
                "id": 0, // the id of the folder or feed, Use 0 for Starred and All
                "getRead": true // if true it returns all items, false returns only unread items
            };

            return $http({ method : 'GET', url : "http://"+this.userName+":"+this.password+"@"+this.hostname+"/items", params : params, cached : false });
        },

        getAllItems : function(offset){
            var params = {
                "batchSize": 20, //  the number of items that should be returned, defaults to 20
                "offset": offset, // only return older (lower than equal that id) items than the one with id 30
                "type": 3, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
                "id": 0, // the id of the folder or feed, Use 0 for Starred and All
                "getRead": true // if true it returns all items, false returns only unread items
            };
            return $http({ method : 'GET', url : "http://"+this.userName+":"+this.password+"@"+this.hostname+"/items", params : params, cached : false });
        },

        getFolderItems : function(folderId, offset){
            var params = {
                "batchSize": 20, //  the number of items that should be returned, defaults to 20
                "offset": offset, // only return older (lower than equal that id) items than the one with id 30
                "type": 1, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
                "id": folderId, // the id of the folder or feed, Use 0 for Starred and All
                "getRead": true // if true it returns all items, false returns only unread items
            };

            return $http({ method : 'GET', url : "http://"+this.userName+":"+this.password+"@"+this.hostname+"/items", params : params, cached : false });
        },

        getFeedItems : function(feedId,offset){
            var params = {
                "batchSize": 20, //  the number of items that should be returned, defaults to 20
                "offset": offset, // only return older (lower than equal that id) items than the one with id 30
                "type": 0, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
                "id": feedId, // the id of the folder or feed, Use 0 for Starred and All
                "getRead": true // if true it returns all items, false returns only unread items
            };

            return $http({ method : 'GET', url : "http://"+this.userName+":"+this.password+"@"+this.hostname+"/items", params : params, cached : false });
        }


	};

}]);
})(window.angular, jQuery);