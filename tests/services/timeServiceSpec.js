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

describe('TimeService', function () {

    var timeService;

    beforeEach(module('News'));

    beforeEach(inject(function (TimeService) {
        timeService = TimeService;
    }));


    it('Check returning of \'moment ago\' string', function () {
        var timeNow = Date.now() / 1000;

        expect(timeService.getDateFromUTC(timeNow - 119)).toBe('Moment ago');
        expect(timeService.getDateFromUTC(timeNow - 1)).toBe('Moment ago');
        expect(timeService.getDateFromUTC(timeNow - 60)).toBe('Moment ago');
        expect(timeService.getDateFromUTC(timeNow - 120)).not.toBe('Moment ago');
    });


    it('Check returning of \'couple of minutes ago\' string', function () {
        var timeNow = Date.now() / 1000;

        expect(timeService.getDateFromUTC(timeNow - 599)).toBe('Couple of minutes ago');
        expect(timeService.getDateFromUTC(timeNow - 600)).not.toBe('Moment ago');
    });

    it('Check returning of \'Half hour ago\' string', function () {
        var timeNow = Date.now() / 1000;

        // This is 10 minutes ago
        expect(timeService.getDateFromUTC(timeNow - 600)).toBe('Half hour ago');

        // This is still less than a hour ago
        expect(timeService.getDateFromUTC(timeNow - 3599)).toBe('Half hour ago');

        // This is more than a hour ago
        expect(timeService.getDateFromUTC(timeNow - 3600)).not.toBe('Half hour ago');
    });

    it('Check returning of \'N hour(s) ago\'', function () {
        var timeNow = Date.now() / 1000;

        // This is more than 1 hour ago
        expect(timeService.getDateFromUTC(timeNow - 3600)).toBe('1 hour ago');

        // This is still more than 1 hour ago
        expect(timeService.getDateFromUTC(timeNow - 4000)).toBe('1 hour ago');

        // This is more than a 2 hours ago
        expect(timeService.getDateFromUTC(timeNow - 7200)).toBe('2 hours ago');

        // This is more than a 10 hours ago
        expect(timeService.getDateFromUTC(timeNow - 36000)).toBe('10 hours ago');

        // This is more than a 24 hours ago
        expect(timeService.getDateFromUTC(timeNow - 3600 * 24)).not.toBe('10 hours ago');
    });

    it('Check returning of \'N day(s) ago\'', function () {
        var timeNow = Date.now() / 1000;

        // This is more than a day ago
        expect(timeService.getDateFromUTC(timeNow - 3600 * 24)).toBe('1 day ago');

        // This is still more than a day ago
        expect(timeService.getDateFromUTC(timeNow - (3600 * 24 + 1200))).toBe('1 day ago');

        // This is more than a two days ago
        expect(timeService.getDateFromUTC(timeNow - 3600 * 48)).not.toBe('1 day ago');

        // This is more than a two days ago
        expect(timeService.getDateFromUTC(timeNow - (3600 * 48 + 60))).toBe('2 days ago');

        // This is more than a three days ago
        expect(timeService.getDateFromUTC(timeNow - (3600 * 72 + 60))).toBe('3 days ago');

        // This is more than a ten days ago
        expect(timeService.getDateFromUTC(timeNow - (3600 * 24 * 10 + 60))).not.toBe('3 days ago');
    });

    it('Check what returns for date half year ago', function () {
        var timeNow = Date.now() / 1000;
        var halfYearAgo = 60 * 60 * 24 * 183;

        //This is more than a half year ago
        expect(timeService.getDateFromUTC(timeNow - halfYearAgo)).toBe(new Date((timeNow - halfYearAgo) * 1000).toDateString());
    });

});

