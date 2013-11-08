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

describe('TranslationService', function () {

    var translationService;

    beforeEach(module('News'));

    beforeEach(inject(function(TranslationService){
        translationService = TranslationService;
    }));

    it('Language reference variable should be null', function(){
        expect(translationService.lang).toBe(null);
    });

    if('Service should return translated label', function(){
        translationService.lang = {
            labels:{
                'testing.label' : 'testing',
                'nocontent.label' : ''
            }
        };

        expect(translationService.translateLabel('testing.label')).toBe('testing');
        expect(translationService.translateLabel('nocontent.label')).toBe('');
    });

    it('Service should return translated exception', function(){
        translationService.lang = {
            exceptions:{
                'testing.exception' : 'testing',
                'nocontent.exception' : ''
            }
        };

        expect(translationService.translateException('testing.exception')).toBe('testing');
        expect(translationService.translateException('nocontent.exception')).toBe('');
    });
});
