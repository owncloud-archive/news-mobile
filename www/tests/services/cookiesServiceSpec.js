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

describe('cookiesService', function(){

    var cookiesService;

    beforeEach(module('News'));
    beforeEach(module('ngCookies'));

    beforeEach(inject(function(CookiesService){
        cookiesService = CookiesService;
    }));

    it('There should be no cookies object', function(){
       expect(cookiesService.checkIfExist()).toBe(false);
    });

    it('There should be cookies object', function(){
       cookiesService.createCookieObject();
       expect(cookiesService.checkIfExist()).toBe(true);
    });

    it('Service should retrieve nothing from cookies', function(){
        var data = cookiesService.retrieveCookie('data');
        expect(data).toBe('');
    });

    it('Service should store and retrieve data from cookies', function(){
        cookiesService.createCookieObject();
        cookiesService.storeCookie('data','test');
        var data = cookiesService.retrieveCookie('data');
        expect(data).toBe('test');
    });

    it('Service should delete cookie', function(){
        cookiesService.createCookieObject();
        cookiesService.storeCookie('data','test');
        cookiesService.deleteCookie('data');
        var data = cookiesService.retrieveCookie('data');
        expect(data).toBe('');
    });

    it('Service should reset cookies object', function(){
        cookiesService.createCookieObject();
        cookiesService.storeCookie('data','test');
        cookiesService.clearCookieObject();
        var data = cookiesService.retrieveCookie('data');
        expect(data).toBe('');
    });

});
