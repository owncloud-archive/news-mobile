(function(angular, $, undefined){

'use strict';

/**
 * Copyright (c) 2013, Bernhard Posselt <nukeawhale@gmail.com> 
 * Copyright (c) 2013, Alessandro Cosentino <cosenal@gmail.com> 
 * Copyright (c) 2013, Ilija Lazarevic <ikac.ikax@gmail.com> 
 * This file is licensed under the Affero General Public License version 3 or later. 
 * See the COPYING file.
 */

// this file is just for defining the main container to easily swap this in
// tests
angular.module('News', []);
// define your routes in here
angular.module('News').config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/', {
        templateUrl:'main.html',
        controller:'MainController'
    })
        .when('/login', {
            templateUrl:'login.html',
            controller:'LoginController',
            resolve: ['$http' , '$locale', 'TranslationService', function($http,$locale,TranslationService){
                return $http.get('../languages/'+$locale.id+'.json').success(function(data, status){
                    TranslationService.lang = data;
                });
            }]
        })
        .otherwise({
            redirectTo:'/'
        });

}]);

angular.module('News').config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

angular.module('News').config(function($provide) {
    $provide.decorator("$exceptionHandler", function($delegate) {
        return function(exception, cause) {
            //$delegate(exception, cause);
            alert(exception.message);
        };
    });
});

angular.module('News').controller('LoginController',
    ['$scope', '$location', '$route' , '$locale', 'LoginService', 'UserService', 'ExceptionsService',
        function ($scope, $location, $route, $locale, LoginService, UserService, ExceptionsService) {

            $scope.data = UserService;

            $scope.testFormFields = function () {
                var hostNameRegExp = new RegExp(/^https?:\/\/.*$/); ///^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
                var userNameRegExp = new RegExp(/^[a-zA-Z0-9_-]{3,18}$/); // /^[a-z0-9_-]{3,16}$/
                var passwordRegExp = new RegExp(/^[a-zA-Z0-9_-]{3,18}$/); // /^[a-z0-9_-]{6,18}$/

                var userNameParseResult = userNameRegExp.test(UserService.userName);

                $scope.userNameError = '';
                $scope.passwordError = '';
                $scope.hostNameError = '';

                if (!userNameParseResult) {
                    ExceptionsService.makeNewException({message:"user.name.is.not.in.correct.format"},-1);
                }

                var passwordParseResult = passwordRegExp.test(UserService.password);

                if (!passwordParseResult) {
                    ExceptionsService.makeNewException({message:"password.is.not.in.correct.format"},-1);
                }

                var hostNameParseResult = hostNameRegExp.test(UserService.hostName);

                if (!hostNameParseResult) {
                    ExceptionsService.makeNewException({message:"host.name.is.not.in.correct.format"},-1);
                }

                if (hostNameParseResult && userNameParseResult && passwordParseResult) {
                    return true;
                }
                return false;
            };

            $scope.logIn = function () {
                if ($scope.testFormFields()) {
                    LoginService.login()
                        .success(function (data, status) {
                            if (status === 200) {
                                LoginService.present = true;
                                $location.path("/");
                            }
                        })
                        .error(function (data, status) {
                            ExceptionsService.makeNewException(data, status);
                        });
                }
            };

            $scope.isLoggedIn = function () {
                if (LoginService.present) {
                    $location.path("/");
                }
            };

        }]);

angular.module('News').controller('MainController',
    ['$scope', '$location', 'LoginService', 'ItemsService', 'FoldersService', 'FeedsService', 'TimeService',
        function ($scope, $location, LoginService, ItemsService, FoldersService, FeedsService, TimeService) {

            console.log('Initialized main controller');
            $scope.view = ''; // view is way the results are presented, all and starred is equal
            $scope.action = ''; // action is button pressed to get the populated list
            $scope.folderId = '0';
            $scope.feedId = '0';
            $scope.currentFolderName = '';
            $scope.currentFeedTitle = '';

            $scope.moreArticles = true;
            var articlesGet = 0;

            $scope.getStarred = function (offset) {
                $scope.action = 'Starred';
                $scope.moreArticles = true;
                ItemsService.getStarredItems(offset)
                    .then(function (result) {
                        $scope.view = 'All';
                        $scope.data = result.data;
                        articlesGet = result.data.items.length;
                    });
            };

            $scope.getAll = function (offset) {
                $scope.action = 'All';
                $scope.moreArticles = true;
                ItemsService.getAllItems(offset)
                    .then(function (result) {
                        $scope.view = 'All';
                        $scope.data = result.data;
                        articlesGet = result.data.items.length;
                    });
            };

            $scope.getFolders = function () {
                $scope.action = 'Folders';
                FoldersService.getFolders()
                    .then(function (result) {
                        $scope.view = 'Folders';
                        $scope.data = result.data;
                        articlesGet = result.data.folders.length;
                    });
            };

            $scope.getFeeds = function () {
                $scope.action = 'Feeds';
                FeedsService.getFeeds()
                    .then(function (result) {
                        $scope.view = 'Feeds';
                        $scope.data = result.data;
                        articlesGet = result.data.feeds.length;
                    });

            };

            $scope.getFolderItems = function (folderId, offset, folderName) {
                $scope.action = 'FolderItems';
                $scope.folderId = folderId;
                $scope.currentFolderName = folderName;
                $scope.moreArticles = true;

                FoldersService.getFolderItems(folderId, offset)
                    .then(function (result) {
                        $scope.view = 'All';
                        $scope.data = result.data;
                        articlesGet = result.data.items.length;
                    });
            };

            $scope.getFeedItems = function (feedId, offset, feedTitle) {
                $scope.action = 'FeedItems';
                $scope.feedId = feedId;
                $scope.currentFeedTitle = feedTitle;
                $scope.moreArticles = true;

                FeedsService.getFeedItems(feedId, offset)
                    .then(function (result) {
                        $scope.view = 'All';
                        $scope.data = result.data;
                        articlesGet = result.data.items.length;
                    });
            };

            $scope.getMoreItems = function (type) {
                var offset = $scope.data.items.slice(-1)[0].id - 1;

                if (offset === 0 || articlesGet < 20) {
                    $scope.moreArticles = false;
                    return false;
                }

                if ($scope.action === 'All') {
                    ItemsService.getAllItems(offset)
                        .then(function (result) {
                            articlesGet = result.data.items.length;
                            for (var i in result.data.items) {
                                $scope.data.items.push(result.data.items[i]);
                            }
                        });
                }
                else if ($scope.action === 'Starred') {
                    ItemsService.getStarredItems(offset)
                        .then(function (result) {
                            articlesGet = result.data.items.length;
                            for (var i in result.data.items) {
                                $scope.data.items.push(result.data.items[i]);
                            }
                        });
                }
                else if (type === 'All' && $scope.action === 'FolderItems') {
                    FoldersService.getFolderItems($scope.folderId, offset).then(function (result) {
                        articlesGet = result.data.items.length;
                        for (var i in result.data.items) {
                            $scope.data.items.push(result.data.items[i]);
                        }
                    });
                }
                else if (type === 'All' && $scope.action === 'FeedItems') {
                    FeedsService.getFeedItems($scope.feedId, offset).then(function (result) {
                        articlesGet = result.data.items.length;
                        for (var i in result.data.items) {
                            $scope.data.items.push(result.data.items[i]);
                        }
                    });
                }

            };

            $scope.starItem = function(feedId, guidHash) {
                //console.log('Feed id = '+feedId+" guidHash = "+guidHash);
                ItemsService.starItem(feedId, guidHash).then(function(data){
                    //console.log("successfully starred item");
                });
            };

            $scope.unstarItem = function(feedId, guidHash) {
                //console.log('Feed id = '+feedId+" guidHash = "+guidHash);
                ItemsService.unstarItem(feedId, guidHash).then(function(data){
                    //console.log("successfully unstarred item");
                });
            };

            $scope.markItemRead = function(itemId) {
                /* This is for reading when opening article
                 * not very optimized for long articles list
                 *
                for (var i in $scope.data.items) {
                    if ($scope.data.items[i].id === itemId) {
                        if ($scope.data.items[i].unread === false) {
                            console.log("Ova je procitana");
                            return false;
                        }
                    }
                }*/
                ItemsService.markItemRead(itemId).then(function(data){
                   //console.log("successfully read item");
                });
            };

            $scope.markItemUnread = function(itemId) {
                ItemsService.markItemUnread(itemId).then(function(data){
                    //console.log("successfully read item");
                });
            };

            $scope.logOut = function () {
                LoginService.present = false;
                LoginService.killTimer();
                $location.path('/login');
            };

            if (LoginService.present) {
                //console.log('This');
                $scope.getAll(0);
            }

        }]);



angular.module('News').directive('checkPresence',
    ['$http', '$location', '$timeout', 'LoginService', 'ExceptionsService',
        function ($http, $location, $timeout, LoginService, ExceptionsService) {
            return {
                restrict:"E",
                link:function tick() {
                    if (LoginService.timerRef) {
                        LoginService.killTimer();
                    }
                    if (!LoginService.present) {
                        $location.path('/login');
                    }
                    else {
                        LoginService.login()
                            .success(function (data, status) {
                                if (status === 200) {
                                    $location.path('/');
                                }
                                else {
                                    LoginService.killTimer();
                                    $location.path('/login');
                                    ExceptionsService.makeNewException(data, status);
                                }
                            })
                            .error(function (data, status) {
                                LoginService.killTimer();
                                $location.path('/login');
                                ExceptionsService.makeNewException(data, status);
                            });
                    }
                    LoginService.timerRef = $timeout(tick, LoginService.timeout);
                }
            };
        }]);


angular.module('News').filter('translator', ['TranslationService', function (TranslationService) {
	return function (text) {
        return TranslationService.translateLabel([text]);
	};
}]);

angular.module('News').filter('clearurl', function () {
    var reg = /https?:\/\/[^#]*/;
    var regexp = new RegExp(reg);

	return function (text) {
        return regexp.exec(text)[0];
	};
});

angular.module('News').factory('ExceptionsService',
    ['TranslationService', function (TranslationService) {
        return {
            makeNewException:function (data, status) {
                var messageString = '';
                if (status > 0) {
                    messageString = '['+status+'] ';
                }
                messageString = messageString + TranslationService.translateException([data.message]);

                throw {message: messageString};
            }
        };
    }]);

angular.module('News').factory('FeedsService',
    ['$http', 'UserService', 'ExceptionsService', 'TimeService',
        function ($http, UserService, ExceptionsService, TimeService) {
            return {
                getFeeds:function () {
                    return $http({ method:'GET', url:UserService.hostName +
                        "/index.php/apps/news/api/v1-2/feeds",
                        cached:false, withCredentials:UserService.withCredentials})
                        .success(function (data, status) {
                            TimeService.convertFeedsDates(data.feeds);
                            return data;
                        })
                        .error(function (data, status) {
                            ExceptionsService.makeNewException(data, status);
                        });
                },

                getFeedItems:function (feedId, offset) {
                    var params = {
                        "batchSize":20, //  the number of items that should be returned, defaults to 20
                        "offset":offset, // only return older (lower than equal that id) items than the one with id 30
                        "type":0, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
                        "id":feedId, // the id of the folder or feed, Use 0 for Starred and All
                        "getRead":true // if true it returns all items, false returns only unread items
                    };

                    return $http({ method:'GET', url:UserService.hostName +
                        "/index.php/apps/news/api/v1-2/items",
                        params:params, cached:false, withCredentials:UserService.withCredentials})
                        .success(function (data, status) {
                            TimeService.convertItemsDates(data.items);
                            return data;
                        }).error(function (data, status) {
                            ExceptionsService.makeNewException(data, status);
                        });
                }
            };

        }]);

angular.module('News').factory('FoldersService',
    ['$http', 'UserService', 'ExceptionsService', 'TimeService',
        function ($http, UserService, ExceptionsService, TimeService) {
            return {
                getFolders:function () {
                    return $http({ method:'GET', url:UserService.hostName +
                        "/index.php/apps/news/api/v1-2/folders", cached:false,
                        withCredentials:UserService.withCredentials })
                        .success(function (data, status) {
                            return data;
                        })
                        .error(function (data, status) {
                            ExceptionsService.makeNewException(data, status);
                        });
                },

                getFolderItems:function (folderId, offset) {
                    var params = {
                        "batchSize":20, //  the number of items that should be returned, defaults to 20
                        "offset":offset, // only return older (lower than equal that id) items than the one with id 30
                        "type":1, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
                        "id":folderId, // the id of the folder or feed, Use 0 for Starred and All
                        "getRead":true // if true it returns all items, false returns only unread items
                    };

                    return $http({ method:'GET', url:UserService.hostName +
                        "/index.php/apps/news/api/v1-2/items", params:params,
                        cached:false, withCredentials:UserService.withCredentials })
                        .success(function (data, status) {
                            TimeService.convertItemsDates(data.items);
                            return data;
                        }).error(function (data, status) {
                            ExceptionsService.makeNewException(data, status);
                        });
                }
            };

        }]);

angular.module('News').factory('ItemsService',
    ['$http', 'UserService', 'ExceptionsService', 'TimeService',
        function ($http, UserService, ExceptionsService, TimeService) {
            return {
                getStarredItems:function (offset) {
                    var params = {
                        "batchSize":20, //  the number of items that should be returned, defaults to 20
                        "offset":offset, // only return older (lower than equal that id) items than the one with id 30
                        "type":2, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
                        "id":0, // the id of the folder or feed, Use 0 for Starred and All
                        "getRead":true // if true it returns all items, false returns only unread items
                    };

                    return $http({ method:'GET', url:UserService.hostName +
                        "/index.php/apps/news/api/v1-2/items",
                        params:params, cached:false, withCredentials:UserService.withCredentials})
                        .success(function (data, status) {
                            TimeService.convertItemsDates(data.items);
                            return data;
                        }).error(function (data, status) {
                            ExceptionsService.makeNewException(data,status);
                        });
                },

                getAllItems:function (offset) {
                    var params = {
                        "batchSize":20, //  the number of items that should be returned, defaults to 20
                        "offset":offset, // only return older (lower than equal that id) items than the one with id 30
                        "type":3, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
                        "id":0, // the id of the folder or feed, Use 0 for Starred and All
                        "getRead":true // if true it returns all items, false returns only unread items
                    };
                    return $http({ method:'GET', url:UserService.hostName +
                        "/index.php/apps/news/api/v1-2/items",
                        params:params, cached:false, withCredentials:UserService.withCredentials})
                        .success(function (data, status) {
                            TimeService.convertItemsDates(data.items);
                            return data;
                        }).error(function (data, status) {
                            ExceptionsService.makeNewException(data,status);
                        });
                },

                starItem:function (feedId,guidHash) {
                    return $http({ method:'PUT', url:UserService.hostName +
                        "/index.php/apps/news/api/v1-2/items/"+feedId+"/"+guidHash+"/star",
                        withCredentials:UserService.withCredentials})
                        .error(function (data, status) {
                            ExceptionsService.makeNewException(data,status);
                        });
                },

                unstarItem:function (feedId,guidHash) {
                    return $http({ method:'PUT', url:UserService.hostName +
                        "/index.php/apps/news/api/v1-2/items/"+feedId+"/"+guidHash+"/unstar",
                        withCredentials:UserService.withCredentials})
                        .error(function (data, status) {
                            ExceptionsService.makeNewException(data,status);
                        });
                },

                markItemRead:function (itemId) {
                    return $http({ method:'PUT', url:UserService.hostName +
                        "/index.php/apps/news/api/v1-2/items/"+itemId+"/read",
                        withCredentials:UserService.withCredentials})
                        .error(function (data, status) {
                            ExceptionsService.makeNewException(data,status);
                        });
                },

                markItemUnread:function (itemId) {
                    return $http({ method:'PUT', url:UserService.hostName +
                        "/index.php/apps/news/api/v1-2/items/"+itemId+"/unread",
                        withCredentials:UserService.withCredentials})
                        .error(function (data, status) {
                            ExceptionsService.makeNewException(data,status);
                        });
                }
            ///items/{itemId}/read

            };
        }]);

angular.module('News').factory('LoginService',
    ['$http', '$timeout', 'UserService',
        function ($http, $timeout, UserService) {
            return {
                present:false,
                timerRef:null,
                timeout:50000,

                killTimer:function () {
                    $timeout.cancel(this.timerRef);
                },

                isPresent:function () {
                    return this.present;
                },

                login:function () {
                    var auth = "Basic " + btoa(UserService.userName + ":" +
                        UserService.password);

                    $http.defaults.headers.common.Authorization = auth;

                    return $http({ method:'GET', url:UserService.hostName +
                        "/index.php/apps/news/api/v1-2/version" });


                    //console.log("http://"+this.userName+":"+this.password+"@"+this.hostname+"/version");
                    //return $http({ method: 'GET', url : "http://"+this.userName+":"+this.password+"@"+this.hostname+
                    // "/index.php/apps/news/api/v1-2/version", withCredentials : true });
                }

            };

        }]);

angular.module('News').factory('TimeService', [ function () {
    var day = 60 * 60 * 24 * 1000; //miliseconds in a day
    var hour = 60 * 60 * 1000; //miliseconds in a hour
    var dateNow = Date.now();

    return {
        getDateFromUTC:function (utc) {
            var itemDate = new Date(utc * 1000);
            var daysAgo = Math.floor((dateNow - itemDate) / day);
            var hoursAgo = Math.floor((dateNow - itemDate) / hour);

            if (daysAgo === 0) {
                if (hoursAgo === 0) {
                    return "Moment ago";
                }
                else if (hoursAgo === 1) {
                    return "1 hour ago";
                }
                else {
                    return hoursAgo + " hours ago";
                }
            }
            else if (daysAgo === 1) {
                return "1 day ago";
            }
            else if (daysAgo <= 10) {
                return daysAgo + " days ago";
            }
            else {
                return itemDate.toDateString();
            }
        },

        convertItemsDates:function (items) {
            for (var i in items) {
                items[i].pubDate = this.getDateFromUTC(items[i].pubDate);
            }
        },

        convertFeedsDates:function (items) {
            for (var i in items) {
                items[i].added = this.getDateFromUTC(items[i].added);
            }
        }


    };
}]);

angular.module('News').factory('TranslationService', [ function () {
    return {
        lang:null,
        translateLabel : function(text){
            return this.lang.labels[text];
        },
        translateException : function(text){
            return this.lang.exceptions[text];
        }
    };
}]);

angular.module('News').factory('UserService', ['$http', function ($http) {
    return {
        userName:'ikacikac',
        password:'ikacikac',
        hostName:'http://localhost/owncloud',
        withCredentials:false
    };
}]);

})(window.angular, jQuery);