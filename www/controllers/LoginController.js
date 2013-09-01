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

angular.module('News').controller('LoginController',
    ['$scope', '$location', '$route' , 'LoginService', 'UserService',
        function ($scope, $location, $route, LoginService, UserService) {

            $scope.data = UserService;

            $scope.testFormFields = function () {
                var hostNameRegExp = new RegExp(/^https?:\/\/.*$/); ///^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
                var userNameRegExp = new RegExp(/^[a-z0-9_-]{3,10}$/); // /^[a-z0-9_-]{3,16}$/
                var passwordRegExp = new RegExp(/^[a-z0-9_-]{3,10}$/); // /^[a-z0-9_-]{6,18}$/

                var userNameParseResult = userNameRegExp.test(UserService.userName);

                $scope.userNameError = '';
                $scope.passwordError = '';
                $scope.hostNameError = '';

                if (!userNameParseResult) {
                    $scope.userNameError = "User name is not in correct format!";
                }

                var passwordParseResult = passwordRegExp.test(UserService.password);

                if (!passwordParseResult) {
                    $scope.passwordError = "Password is not in correct format!";
                }

                var hostNameParseResult = hostNameRegExp.test(UserService.hostName);

                if (!hostNameParseResult) {
                    $scope.hostNameError = "Host name is not in correct format!";
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
                            alert("Status " + status + " [" + data.message + "]");
                        });
                }
            };

            $scope.isLoggedIn = function () {
                if (LoginService.present) {
                    $location.path("/");
                }
            };

        }]);
