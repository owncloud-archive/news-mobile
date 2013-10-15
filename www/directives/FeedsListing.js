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
            template:'<div class="accordion-group {{feed.id}}"></div>',
            compile:function (element, attrs) {
                var html = '' +
                    '<div class="accordion-heading">' +
                    '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion3" href ng-click="getFeedItems(feed.id,0,feed.title)">' +
                    '<img ng-src="{{feed.faviconLink}}" width="32" height="32" alt="pic" class="hidden-phone">' +
                    '<span class="title"><em>{{feed.unreadCount}}</em> - {{feed.title}}</span>' +
                    '<br/>' +
                    '<span ng-show="feed.added" class="itemadd">web site: <span>{{feed.link | clearurl}}</span></span>' +
                    '<span ng-show="feed.added" class="itemadd">date added: <span>{{feed.added}}</span></span>' +
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
