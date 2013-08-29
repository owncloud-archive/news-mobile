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

angular.module('News').factory('LoginService',
    ['$http', '$timeout', 'UserService',
        function ($http, $timeout, UserService) {
            return {
                present:false,
                timerRef:null,
                timeout:500000,

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
