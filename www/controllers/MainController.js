/**
 *
 * ownCloud - News
 *
 * @author Ilija Lazarevic
 * @copyright 2013 Ilija Lazarevic ikac.ikax@gmail.com
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 */

angular.module('News').controller('MainController',
    ['$scope', '$location', '$anchorScroll', 'LoginService', 'ItemsService', 'FoldersService', 'FeedsService', 'TimeService',
        function ($scope, $location, $anchorScroll, LoginService, ItemsService, FoldersService, FeedsService, TimeService) {

            console.log('Initialized main controller');
            $scope.view = ''; // view is way the results are presented, all and starred is equal
            $scope.action = ''; // action is button pressed to get the populated list
            $scope.folderId = '0';
            $scope.feedId = '0';
            $scope.currentFolderName = '';
            $scope.currentFeedTitle = '';

            $scope.moreArticles = true;
            var articlesGet = 0;

            console.log($location);

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

            $scope.setFavorite = function(feedId, guidHash) {
                ItemsService.setFavorite(feedId, guidHash).then(function(data){
                });
            };

            $scope.unsetFavorite = function(feedId, guidHash) {
                ItemsService.unsetFavorite(feedId, guidHash).then(function(data){
                });
            };

            $scope.setRead = function(itemId) {
                 ItemsService.setRead(itemId).then(function(data){
                 });
            };

            $scope.unsetRead = function(itemId) {
                ItemsService.unsetRead(itemId).then(function(data){
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


