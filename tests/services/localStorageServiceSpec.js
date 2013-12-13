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

describe('localStorageService', function () {

    var localStorageService;

    beforeEach(module('News'));
    beforeEach(module('LocalStorageModule'));

    beforeEach(inject(function (LocalStorageService) {
        localStorageService = LocalStorageService;
    }));

    it('Service should retrieve null value of unset key', function () {
        var data = localStorageService.getValue('test');
        expect(data).toBeNull();
    });

    it('Service should store and retrieve data from local storage', function () {
        localStorageService.addValue('testKey', 'testValue');
        var data = localStorageService.getValue('testKey');
        expect(data).toBe('testValue');
    });

    it('Service should clear storage', function () {
        localStorageService.addValue('testKey', 'testValue');
        localStorageService.clearAll();
        var data = localStorageService.getValue('testKey');
        expect(data).toBeNull();
    });

    it('Service should reset cookies object', function () {
        localStorageService.addValue('testKey', 'testValue');
        localStorageService.clearAll();
        var data = localStorageService.getValue('testKey');
        expect(data).toBeNull();
    });

});
