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
    ['$scope', '$location' , 'LoginService' , 'ItemsService', 'FoldersService', 'FeedsService',
        function ($scope, $location, LoginService, ItemsService, FoldersService, FeedsService) {
            $scope.view = ''; // view is way the results are presented, all and starred is equal
            $scope.action = ''; // action is button pressed to get the populated list
            $scope.folderId = '0';
            $scope.feedId = '0';
            $scope.currentFolderName = '';
            $scope.currentFeedTitle = '';

            $scope.actionTitles = function () {
                switch ($scope.action) {
                    case 'All':
                        return 'All feeds articles';
                    case 'Starred':
                        return 'Favourite articles';
                    case 'Folders':
                        return 'Folders list';
                    case 'Feeds':
                        return 'Feeds list';
                    case 'FolderItems':
                        return $scope.currentFolderName + ' articles';
                    case 'FeedItems':
                        return $scope.currentFeedTitle + ' articles';
                    default:
                        return 'need $$$';
                }
            };

            $scope.getStarred = function (offset) {
                $scope.action = 'Starred';
                ItemsService.getStarredItems(offset)
                    .success(function (data, status) {
                        $scope.view = 'All'; // should not be confused with action
                        $scope.data = data;
                    })
                    .error(function (data, status) {
                        alert("Status " + status + " [" + data.message + "]");
                    });
            };

            $scope.getAll = function (offset) {
                $scope.action = 'All';
                ItemsService.getAllItems(offset)
                    .success(function (data, status) {
                        $scope.view = 'All';
                        $scope.data = data;
                    })
                    .error(function (data, status) {
                        alert("Status " + status + " [" + data.message + "]");
                    });
            };

            $scope.getFolders = function () {
                $scope.action = 'Folders';
                FoldersService.getFolders()
                    .success(function (data, status) {
                        $scope.data = data;
                        $scope.view = 'Folders';
                    })
                    .error(function (data, status) {
                        alert("Status " + status + " [" + data.message + "]");
                    });
            };

            $scope.getFeeds = function () {
                $scope.action = 'Feeds';
                FeedsService.getFeeds()
                    .success(function (data, status) {
                        $scope.data = data;
                        $scope.view = 'Feeds';
                    })
                    .error(function (data, status) {
                        alert("Status " + status + " [" + data.message + "]");
                    });
            };

            $scope.getFolderItems = function (folderId, offset, folderName) {
                $scope.action = 'FolderItems';
                $scope.folderId = folderId;
                $scope.currentFolderName = folderName;

                FoldersService.getFolderItems(folderId, offset)
                    .success(function (data, status) {
                        $scope.data = data;
                        $scope.view = 'All';
                    })
                    .error(function (data, status) {
                        alert("Status " + status + " [" + data.message + "]");
                    });
            };

            $scope.getFeedItems = function (feedId, offset, feedTitle) {
                $scope.action = 'FeedItems';
                $scope.feedId = feedId;
                $scope.currentFeedTitle = feedTitle;

                FeedsService.getFeedItems(feedId, offset)
                    .success(function (data, status) {
                        $scope.data = data;
                        $scope.view = 'All';
                    })
                    .error(function (data, status) {
                        alert("Status " + status + " [" + data.message + "]");
                    });
            };

            $scope.getMoreItems = function (type) {
                var offset = $scope.data.items.slice(-1)[0].id - 1;

                if (type === 'All' && $scope.action === 'All') {
                    $scope.getAll(offset);
                }
                else if (type === 'Starred' && $scope.action === 'Starred') {
                    //console.log($scope.action + ", " + $scope.type + ", " + offset);
                    $scope.getStarred(offset);
                }
                else if (type === 'All' && $scope.action === 'FolderItems') {
                    //console.log(offset);
                    $scope.getFolderItems($scope.folderId, offset);
                }
                else if (type === 'All' && $scope.action === 'FeedItems') {
                    $scope.getFeedItems($scope.feedId, offset);
                }

            };

            $scope.logOut = function () {
                LoginService.present = false;
                LoginService.killTimer();
                $location.path('/login');
            };

            if (LoginService.present) {
                //console.log('This');
                $scope.getAll();
            }

        }]);
