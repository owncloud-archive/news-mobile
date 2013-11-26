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
angular.module('News', ['ngRoute', 'ui.bootstrap', 'ngSanitize', 'LocalStorageModule']);

// define your routes in here
angular.module('News').config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl:'templates/main.html',
            controller:'MainController',
            resolve:['$http' , '$locale' , 'TranslationService', function ($http, $locale, TranslationService) {
                return $http.get('languages/' + $locale.id + '.json')
                    .success(function (data, status) {
                        TranslationService.lang = data;
                    });
            }]
        })
        .when('/login', {
            templateUrl:'templates/login.html',
            controller:'LoginController',
            resolve:['$http' , '$locale' , 'TranslationService', function ($http, $locale, TranslationService) {
                return $http.get('languages/' + $locale.id + '.json')
                    .success(function (data, status) {
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

            UserService.retrieveFromStorage();
            $scope.data = UserService;

            $scope.testFormFields = function () {
                var hostNameRegExp = new RegExp(/^https?/); ///^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
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

                if (UserService.hostName.slice(-1) === '/') {
                    UserService.hostName = UserService.hostName.substring(0,UserService.hostName.length-1);
                }

                var hostNameParseResult = hostNameRegExp.test(UserService.hostName);

                if (!hostNameParseResult) {
                    UserService.hostName = 'http://' + UserService.hostName;
                    hostNameParseResult = true;
                }

                if (hostNameParseResult && userNameParseResult && passwordParseResult) {
                    UserService.storeToStorage();
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
    ['$scope', '$location', 'LoginService', 'ItemsService', 'FoldersService', 'FeedsService',
        function ($scope, $location, LoginService, ItemsService, FoldersService, FeedsService) {

            $scope.view = 'Loading'; // view is way the results are presented, all and starred is equal
            $scope.action = ''; // action is button pressed to get the populated list
            $scope.folderId = '0';
            $scope.feedId = '0';
            $scope.currentFolderName = '';
            $scope.currentFeedTitle = '';

            $scope.moreArticles = true;
            var articlesGet = 0;

            //console.log($location);

            $scope.getStarred = function (offset) {
                $scope.action = 'Starred';
                $scope.moreArticles = true;
                $scope.view = 'Loading';
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
                $scope.view = 'Loading';
                ItemsService.getAllItems(offset)
                    .then(function (result) {
                        $scope.view = 'All';
                        $scope.data = result.data;
                        articlesGet = result.data.items.length;
                    });
            };

            $scope.getFolders = function () {
                $scope.action = 'Folders';
                $scope.view = 'Loading';
                FoldersService.getFolders()
                    .then(function (result) {
                        $scope.view = 'Folders';
                        $scope.data = result.data;
                        articlesGet = result.data.folders.length;
                    });
            };

            $scope.getFeeds = function () {
                $scope.action = 'Feeds';
                $scope.view = 'Loading';
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
                $scope.view = 'Loading';

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
                $scope.view = 'Loading';

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

            $scope.setFavorite = function (feedId, guidHash) {
                ItemsService.setFavorite(feedId, guidHash).then(function (data) {
                });
            };

            $scope.unsetFavorite = function (feedId, guidHash) {
                ItemsService.unsetFavorite(feedId, guidHash).then(function (data) {
                });
            };

            $scope.setRead = function (itemId) {
                ItemsService.setRead(itemId).then(function (data) {
                });
            };

            $scope.unsetRead = function (itemId) {
                ItemsService.unsetRead(itemId).then(function (data) {
                });
            };

            $scope.logOut = function () {
                LoginService.present = false;
                LoginService.killTimer();
                $location.path('#/login');
            };

            if (LoginService.present) {
                $scope.getAll(0);
            }

        }]);



angular.module('News').directive('checkPresence',
    ['$location', '$timeout', 'LoginService', 'ExceptionsService',
        function ($location, $timeout, LoginService, ExceptionsService) {
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
                    LoginService.startTimer(tick);
                }
            };
        }]);


angular.module('News').directive('feedsListing',
    [function () {
        return {
            restrict:'E',
            scope:{
                feed:'=data',
                getFeedItems:'&getfeeditems'
            },
            replace:true,
            template:'<div class="accordion-group {{feed.id}}"></div>',
            compile:function (element, attrs) {
                var html = '' +
                    '<div class="accordion-heading">' +
                    '<a class="accordion-toggle read-{{feed.unreadCount==0}}" data-toggle="collapse" data-parent="#accordion3" href ng-click="getFeedItems(feed.id,0,feed.title)">' +
                    '<img ng-src="{{feed.faviconLink}}" width="32" height="32" alt="pic" class="hidden-phone">' +
                    '<span class="title">{{feed.title}} <em ng-show="feed.unreadCount>0">({{feed.unreadCount}})</em></span>' +
                    '<br/>' +
                    '<span ng-show="feed.added" class="itemadd">web site: <span>{{feed.link | clearurl}}</span></span>' +
                    '<span ng-show="feed.added" class="itemadd">date added: <span>{{feed.added}}</span></span>' +
                    '</a>' +
                    '</div>';

                element.append($(html));

                return this.link;
            },
            link:function (scope, element, attrs) {
                $(element).hide();
                $(element).fadeIn();
            }
        };
    }]);

angular.module('News').directive('foldersListing',
    [function () {
        return {
            restrict:'E',
            scope:{
                folder:'=data',
                getFolderItems:'&getfolderitems'
            },
            replace:true,
            template:'<div class="accordion-group {{folder.id}}"></div>',
            compile:function (element, attrs) {
                var html = '' +
                    '<div class="accordion-heading">' +
                    '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href ng-click="getFolderItems(folder.id,0,folder.name)">' +
                    '<i class="icon-folder-open"></i><span class="title">{{folder.name}}</span><br/>' +
                    '</a>' +
                    '</div>';

                element.append($(html));

                return this.link;
            },
            link:function (scope, element, attrs) {
                $(element).hide();
                $(element).fadeIn();
            }
        };
    }]);

angular.module('News').directive('itemsListing',
    ['ItemsService', '$window', function (ItemsService, $window) {
        return {
            restrict:'E',
            scope:{
                item:'=data'
            },
            template:'<div></div>',
            compile:function (element, attrs) {
                var html = '<div><accordion-group class="{{item.id}}" id="item{{item.id}}" >' +
                    '<accordion-heading class="accordion-heading">' +
                    '<a class="accordion-toggle">' +
                    '<span>{{item.title}}</span><i class=" pull-right" ng-class="{\'icon-star\':item.starred}"></i><i class="pull-right" ng-class="{\'icon-ok\':!item.unread}"></i>' +
                    '<br/>' +
                    '<span ng-show="item.autor" class="itemadd">author: <span>{{item.author}}</span></span>' +
                    '<span ng-hide="item.autor" class="itemadd">author: <span>unknown</span></span>' +
                    '<span ng-show="item.pubDate" class="itemadd">date published: <span>{{item.pubDate}}</span></span>' +
                    '<span ng-hide="item.pubDate" class="itemadd">date published: <span>unknown</span></span>' +
                    '</a>' +
                    '</accordion-heading>' +
                    '<div class="accordion-body" is-open="isopen">' +
                    '<div class="accordion-inner">' +
                    '<div class="accordion-heading">' +
                    '<div class="bodybox" ng-bind-html="item.body"></div>' +
                    '<div class="buttonsbox">' +
                    '<span class="itemaddurl"><a href ng-click="openUrl(item.url)" target="_blank"><i class="icon-file"></i></a></span>' +
                    '<span class="itemaddurl"><a class="read" href ng-click="readToggle(item.id)"><i ng-class="{\'icon-eye-open\':item.unread,\'icon-eye-close\':!item.unread}"></i></a></span>' +
                    '<span class="itemaddurl"><a class="star" href ng-click="starToggle(item.feedId,item.guidHash)"><i ng-class="{\'icon-star\':item.starred,\'icon-star-empty\':!item.starred}"></i></a></span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</accordion-group></div>';

                element.html($(html));

                return this.link;
            },
            link:function (scope, element, attrs) {
                scope.openUrl = function (url) {
                    $window.open(url, "_system");
                };

                scope.readToggle = function (id) {
                    if (scope.item.unread === true) {
                        //This method uses main controller's setRead exposed
                        //through scope and directive's isolate scope
                        //scope.setRead({id:id});

                        //This method uses service to mark item read
                        //which has option for checking if marking was successful
                        ItemsService.setRead(id).success(function (result, status) {
                            scope.item.unread = false;
                            $('.' + scope.item.id + ' a.read i').toggleClass('icon-eye-open icon-eye-close');
                            // $('.' + scope.item.id +' .accordion-toggle').toggleClass('read-true read-false');
                        });
                    }
                    else if (scope.item.unread === false) {
                        //scope.unsetRead({id:id});
                        ItemsService.unsetRead(id).success(function (result, status) {
                            scope.item.unread = true;
                            $('.' + scope.item.id + ' a.read i').toggleClass('icon-eye-open icon-eye-close');
                            // $('.' + scope.item.id +' .accordion-toggle').toggleClass('read-true read-false');
                        });
                    }
                };

                scope.starToggle = function (feedId, guidHash) {
                    if (scope.item.starred === false) {
                        ItemsService.setFavorite(feedId, guidHash).success(function (result, status) {
                            scope.item.starred = true;
                        });
                    }
                    else if (scope.item.starred === true) {
                        ItemsService.unsetFavorite(feedId, guidHash).success(function (result, status) {
                            scope.item.starred = false;
                        });
                    }
                };
            }
        };
    }]);

angular.module('News').directive('scrollTo',  function () {
    return {
        restrict:'A',
        link: function (scope, element, attrs) {
            element.bind('click', function (event) {

                event.stopPropagation();
                //scope.$on('$locationChangeStart', function (ev) {
                //    ev.preventDefault();
                //});
                var scrollto = attrs.scrollto;

                //$location.hash(location);
                //$anchorScroll(); //For scrolling without animation
                $('html,body').animate({ scrollTop: $('#'+scrollto).offset().top }, { duration: 'slow', easing: 'swing'});

            });
        }
    };
});

angular.module('News').filter('translator', ['TranslationService', function (TranslationService) {
	return function (text) {
        return TranslationService.translateLabel([text]);
	};
}]);

angular.module('News').filter('clearurl', function () {
    var reg = /https?:\/\/[^\/]*/;
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
                messageString = messageString + TranslationService.translateException(data.message);

                if (status === 0) {
                    messageString = TranslationService.translateException('connection.problem');
                    throw {message: messageString};
                }

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

                setFavorite:function (feedId,guidHash) {
                    return $http({ method:'PUT', url:UserService.hostName +
                        "/index.php/apps/news/api/v1-2/items/"+feedId+"/"+guidHash+"/star",
                        withCredentials:UserService.withCredentials})
                        .error(function (data, status) {
                            ExceptionsService.makeNewException(data,status);
                        });
                },

                unsetFavorite:function (feedId,guidHash) {
                    return $http({ method:'PUT', url:UserService.hostName +
                        "/index.php/apps/news/api/v1-2/items/"+feedId+"/"+guidHash+"/unstar",
                        withCredentials:UserService.withCredentials})
                        .error(function (data, status) {
                            ExceptionsService.makeNewException(data,status);
                        });
                },

                setRead:function (itemId) {
                    return $http({ method:'PUT', url:UserService.hostName +
                        "/index.php/apps/news/api/v1-2/items/"+itemId+"/read",
                        withCredentials:UserService.withCredentials})
                        .error(function (data, status) {
                            ExceptionsService.makeNewException(data,status);
                        });
                },

                unsetRead:function (itemId) {
                    return $http({ method:'PUT', url:UserService.hostName +
                        "/index.php/apps/news/api/v1-2/items/"+itemId+"/unread",
                        withCredentials:UserService.withCredentials})
                        .error(function (data, status) {
                            ExceptionsService.makeNewException(data,status);
                        });
                }

            };
        }]);

angular.module('News').factory('LocalStorageService', ['localStorageService', function (localStorageService) {
    return {
        addValue:function (key, value) {
            localStorageService.set(key, value);
        },
        getValue:function (key) {
            var value = localStorageService.get(key);
            return value;
        },
        removeValue:function (key) {
            localStorageService.remove(key);
        },
        clearAll:function () {
            localStorageService.clearAll();
        }
    };
}]);

angular.module('News').factory('LoginService',
    ['$http', '$timeout', 'UserService',
        function ($http, $timeout, UserService) {
            return {
                present:false,
                timerRef:null,
                timeout:60000,

                startTimer:function (tick) {
                    this.timerRef = $timeout(tick, this.timeout);
                },

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
                }
            };
        }]);

angular.module('News').factory('TimeService', [ function () {
    var day = 60 * 60 * 24 * 1000; //miliseconds in a day
    var hour = 60 * 60 * 1000; //miliseconds in a hour
    var minute = 60 * 1000; //miliseconds in a minute

    return {
        getDateFromUTC:function (utc) {
            var dateNow = Date.now();
            var itemDate = new Date(utc * 1000);
            var daysAgo = Math.floor((dateNow - itemDate) / day);
            var hoursAgo = Math.floor((dateNow - itemDate) / hour);
            var minutesAgo = Math.floor((dateNow - itemDate) / minute);

            if (daysAgo <= 0) {
                if (hoursAgo <= 0) {
                    if (minutesAgo <= 1 ) {
                        return "Moment ago";
                    }
                    else if (minutesAgo < 10) {
                        return "Couple of minutes ago";
                    }
                    else {
                        return "Half hour ago";
                    }
                }
                else if(hoursAgo === 1)
                {
                    return "1 hour ago";
                }
                else if (hoursAgo > 1) {
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

angular.module('News').factory('UserService', ['LocalStorageService', function (LocalStorageService) {
    return {
        userName:'',
        password:'',
        hostName:'',
        withCredentials:false,
        retrieveFromStorage:function () {
            this.userName = LocalStorageService.getValue('userName');
            this.password = LocalStorageService.getValue('password');
            this.hostName = LocalStorageService.getValue('hostName');
        },
        storeToStorage:function () {
            LocalStorageService.addValue('userName', this.userName);
            LocalStorageService.addValue('password', this.password);
            LocalStorageService.addValue('hostName', this.hostName);
        }
    };
}]);

})(window.angular, jQuery);