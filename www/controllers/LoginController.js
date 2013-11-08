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
