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


describe('ItemsService', function () {

    var itemsService, httpBackend, userService;

    beforeEach(module('News'));
    beforeEach(module('ngCookies'));

    beforeEach(inject(function(ItemsService, UserService, $httpBackend){
        itemsService = ItemsService;
        httpBackend = $httpBackend;
        userService = UserService;

        userService.userName = "test";
        userService.password = "test";
        userService.hostName = "https://example.com";
    }));

    it('Should return starred item',function(){
        var offset = 0;

        var params = {
            "batchSize":20, //  the number of items that should be returned, defaults to 20
            "offset":offset, // only return older (lower than equal that id) items than the one with id 30
            "type":2, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
            "id":0, // the id of the folder or feed, Use 0 for Starred and All
            "getRead":true // if true it returns all items, false returns only unread items
        };

        var result = {
            "items": [
                {
                    "id": 3443,
                    "guid": "http://grulja.wordpress.com/?p=76",
                    "guidHash": "3059047a572cd9cd5d0bf645faffd077",
                    "url": "http://grulja.wordpress.com/2013/04/29/plasma-nm-after-the-solid-sprint/",
                    "title": "Plasma-nm after the solid sprint",
                    "author": "Jan Grulich (grulja)",
                    "pubDate": 1367270544,
                    "body": "<p>At first I have to say...</p>",
                    "enclosureMime": null,
                    "enclosureLink": null,
                    "feedId": 67,
                    "unread": true,
                    "starred": false,
                    "lastModified": 1367273003
                } // etc
            ]
        };

        httpBackend.expectGET(userService.hostName + "/index.php/apps/news/api/v1-2/items", {params: params}).respond(result);

        var returnedData = itemsService.getStarredItems(offset);

        httpBackend.flush();

        expect(returnedData).toEqual(result);
    });

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });
});
