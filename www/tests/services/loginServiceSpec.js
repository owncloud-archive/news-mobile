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

describe('LoginService', function () {
    var loginService, userService;

    beforeEach(module('News'));
    beforeEach(module('ngCookies'));

    beforeEach(inject(function(LoginService, $timeout, $httpBackend, UserService){
        loginService = LoginService;
    }));

    it('Should check initial presence',function(){
        expect(loginService.isPresent()).toBe(loginService.present);
    });

    it('Should call callback function on timeout', inject(function($timeout){
        var timerCallback = jasmine.createSpy('timerCallback');

        expect(loginService.timerRef).toBeNull();

        expect(timerCallback).not.toHaveBeenCalled();

        loginService.startTimer(timerCallback);

        expect(loginService.timerRef).not.toBeNull();

        $timeout.flush();

        expect(timerCallback).toHaveBeenCalled();
    }));

});
