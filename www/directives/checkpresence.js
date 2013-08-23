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

