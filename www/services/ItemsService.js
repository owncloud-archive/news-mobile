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
