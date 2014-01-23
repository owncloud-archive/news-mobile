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

angular.module('News').directive('itemsListing',
    ['ItemsService', '$window', function (ItemsService, $window) {
        return {
            restrict:'E',
            scope:{
                item:'=data'
            },
            template:'<div></div>',
            compile:function (element, attrs) {
                var html = '<div><accordion-group class="{{item.id}}" id="item{{item.id}}" >' +
                    '<accordion-heading class="accordion-heading">' +
                    '<a class="accordion-toggle">' +
                    '<span>{{item.title}}</span><i class=" pull-right" ng-class="{\'icon-star\':item.starred}"></i><i class="pull-right" ng-class="{\'icon-ok\':!item.unread}"></i>' +
                    '<br/>' +
                    '<span ng-show="item.autor" class="itemadd">author: <span>{{item.author}}</span></span>' +
                    '<span ng-hide="item.autor" class="itemadd">author: <span>unknown</span></span>' +
                    '<span ng-show="item.pubDate" class="itemadd">date published: <span>{{item.pubDate}}</span></span>' +
                    '<span ng-hide="item.pubDate" class="itemadd">date published: <span>unknown</span></span>' +
                    '</a>' +
                    '</accordion-heading>' +
                    '<div class="accordion-body" is-open="isopen">' +
                    '<div class="accordion-inner">' +
                    '<div class="accordion-heading">' +
                    '<div class="bodybox" ng-bind-html="item.body"></div>' +
                    '<div class="buttonsbox">' +
                    '<span class="itemaddurl"><a href ng-click="openUrl(item.url)" target="_blank"><i class="icon-file"></i></a></span>' +
                    '<span class="itemaddurl"><a class="read" href ng-click="readToggle(item.id)"><i ng-class="{\'icon-eye-open\':item.unread,\'icon-eye-close\':!item.unread}"></i></a></span>' +
                    '<span class="itemaddurl"><a class="star" href ng-click="starToggle(item.feedId,item.guidHash)"><i ng-class="{\'icon-star\':item.starred,\'icon-star-empty\':!item.starred}"></i></a></span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</accordion-group></div>';

                element.html($(html));

                return this.link;
            },
            link:function (scope, element, attrs) {
                scope.openUrl = function (url) {
                    $window.open(url, "_system");
                };

                scope.readToggle = function (id) {
                    if (scope.item.unread === true) {
                        //This method uses main controller's setRead exposed
                        //through scope and directive's isolate scope
                        //scope.setRead({id:id});

                        //This method uses service to mark item read
                        //which has option for checking if marking was successful
                        ItemsService.setRead(id).success(function (result, status) {
                            scope.item.unread = false;
                            $('.' + scope.item.id + ' a.read i').toggleClass('icon-eye-open icon-eye-close');
                            // $('.' + scope.item.id +' .accordion-toggle').toggleClass('read-true read-false');
                        });
                    }
                    else if (scope.item.unread === false) {
                        //scope.unsetRead({id:id});
                        ItemsService.unsetRead(id).success(function (result, status) {
                            scope.item.unread = true;
                            $('.' + scope.item.id + ' a.read i').toggleClass('icon-eye-open icon-eye-close');
                            // $('.' + scope.item.id +' .accordion-toggle').toggleClass('read-true read-false');
                        });
                    }
                };

                scope.starToggle = function (feedId, guidHash) {
                    if (scope.item.starred === false) {
                        ItemsService.setFavorite(feedId, guidHash).success(function (result, status) {
                            scope.item.starred = true;
                        });
                    }
                    else if (scope.item.starred === true) {
                        ItemsService.unsetFavorite(feedId, guidHash).success(function (result, status) {
                            scope.item.starred = false;
                        });
                    }
                };

                $(element).hide();
                $(element).fadeIn();
            }
        };
    }]);
