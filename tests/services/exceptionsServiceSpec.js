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

describe('ExceptionsService', function () {

    var exceptionsService, translationService;

    beforeEach(module('News'));

    beforeEach(inject(function (ExceptionsService, TranslationService) {
        exceptionsService = ExceptionsService;
        translationService = TranslationService;

        exceptionsService.$inject = ['TranslationService'];
    }));

    it('Should test return message', function () {
        translationService.lang = {
            "exceptions":{
                "connection.problem":"There are connection problems."
            }
        };

        var data = {message:'connection.problem'};

        expect(exceptionsService.makeNewException.bind(null, data, 0))
            .toThrow({message:translationService.translateException('connection.problem')});

        expect(exceptionsService.makeNewException.bind(null, data, 200))
            .toThrow({message:'[200] ' + translationService.translateException('connection.problem')});

        expect(exceptionsService.makeNewException.bind(null, data, -1))
            .toThrow({message:translationService.translateException('connection.problem')});

    });

});
