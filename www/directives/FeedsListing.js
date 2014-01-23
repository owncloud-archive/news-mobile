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

angular.module('News').directive('feedsListing',
    [function () {
        return {
            restrict:'E',
            scope:{
                feed:'=data',
                getFeedItems:'&getfeeditems'
            },
            replace:true,
            template:'<div></div>',
            compile:function (element, attrs) {
                var html = '' +
                    '<div class="listing {{feed.id}}">' +
                    '<a class="read-{{feed.unreadCount==0}}" data-toggle="collapse" href ng-click="getFeedItems(feed.id,0,feed.title)">' +
                    '<img ng-src="{{feed.faviconLink}}" width="32" height="32" alt="pic" class="hidden-phone">' +
                    '<span class="title">{{feed.title}} <em ng-show="feed.unreadCount">({{feed.unreadCount}})</em></span>' +
                    '<br/>' +
                    '<span ng-show="feed.added" class="itemadd hidden-phone">web site: <span>{{feed.link | clearurl}}</span></span>' +
                    '<span ng-show="feed.added" class="itemadd hidden-phone">date added: <span>{{feed.added}}</span></span>' +
                    '</a>' +
                    '</div>';

                element.append($(html));

                return this.link;
            },
            link:function (scope, element, attrs) {
                $(element).hide();
                $(element).fadeIn();
            }
        };
    }]);
