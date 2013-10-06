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

angular.module('News').directive('checkPresence',
    ['$location', '$timeout', 'LoginService', 'ExceptionsService',
        function ($location, $timeout, LoginService, ExceptionsService) {
            return {
                restrict:"E",
                link:function tick() {
                    if (LoginService.timerRef) {
                        LoginService.killTimer();
                    }
                    if (!LoginService.present) {
                        $location.path('/login');
                    }
                    else {
                        LoginService.login()
                            .success(function (data, status) {
                                if (status === 200) {
                                    $location.path('/');
                                }
                                else {
                                    LoginService.killTimer();
                                    $location.path('/login');
                                    ExceptionsService.makeNewException(data, status);
                                }
                            })
                            .error(function (data, status) {
                                LoginService.killTimer();
                                $location.path('/login');
                                ExceptionsService.makeNewException(data, status);
                            });
                    }
                    LoginService.startTimer(tick);
                }
            };
        }]);

