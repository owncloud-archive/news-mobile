/**
 *
 * ownCloud - News
 *
 * @author Bernhard Posselt, Ilija Lazarevic
 * @copyright 2012 Bernhard Posselt nukeawhale@gmail.com
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
