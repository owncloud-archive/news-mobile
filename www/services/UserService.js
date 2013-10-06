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

angular.module('News').factory('UserService', [ 'CookiesService', function (CookiesService) {
    return {
        userName:'',
        password:'',
        hostName:'',
        withCredentials:false,
        retrieveFromCookies:function () {
            if(CookiesService.checkIfExist()){
                this.userName = CookiesService.retreiveCookie('userName');
                this.password = CookiesService.retreiveCookie('password');
                this.hostName = CookiesService.retreiveCookie('hostName');
            }
        },
        storeToCookies:function () {
             if(!CookiesService.checkIfExist()){
                CookiesService.createCookieObject();
            }
            CookiesService.clearCookieObject();
            CookiesService.storeCookie('userName',this.userName);
            CookiesService.storeCookie('password',this.password);
            CookiesService.storeCookie('hostName',this.hostName);

        }
    };
}]);
