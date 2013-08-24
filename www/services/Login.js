/**
 * 
 * ownCloud - News
 * 
 * @author Bernhard Posselt
 * @copyright 2012 Bernhard Posselt nukeawhale@gmail.com
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

angular.module('News').factory('Login', ['$http', '$timeout', function ($http, $timeout) {

	return {
		userName: 'ikacikac',
		password: 'ikacikac',
        present: false,
        timerRef : null,
        timeout: 5000,
        hostname : 'localhost/owncloud/index.php/apps/news/api/v1-2',
        //this.userName+":"+this.password+"@"+this.url+"/version"
        //TODO treba odraditi servis isLoggedIn u okviru ovog fajla posto je logicki u ovoj celini
        killTimer : function(){
            $timeout.cancel(this.timerRef);
        },

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