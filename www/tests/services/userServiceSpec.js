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

describe('UserService', function() {

	var userService;

	// use the news container
	beforeEach(module('News'));
    beforeEach(module('ngCookies'));

	beforeEach(inject(function (UserService, CookiesService) {
		userService = UserService;

        userService.$inject = ['CookiesService'];
	}));


	it('All fields should be cleared', function () {
		expect(userService.userName).toBe('');
		expect(userService.password).toBe('');
        expect(userService.hostName).toBe('');
        expect(userService.withCredentials).toBe(false);
	});

    it('All fields from cookies should be undefined', function(){
        userService.retrieveFromCookies();

        expect(userService.userName).toBe('');
        expect(userService.password).toBe('');
        expect(userService.hostName).toBe('');
    });

    it('All fields should be storred in cookies', inject([ 'CookiesService', function(CookiesService){
        userService.userName = 'test';
        userService.password = 'test123';
        userService.hostName = 'http://test.com';

        userService.storeToCookies();

        userService.userName = '';
        userService.password = '';
        userService.hostName = '';

        userService.retrieveFromCookies();

        expect(userService.userName).toBe('test');
        expect(userService.password).toBe('test123');
        expect(userService.hostName).toBe('http://test.com');
    }]));

});
