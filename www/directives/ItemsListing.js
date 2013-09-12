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
    ['ItemsService',function (ItemsService) {
            return {
                restrict:'E',
                scope:{
                    item:'=data'
                    //setFavorite:'&setfav',
                    //unsetFavorite:'&unsetfav',
                    //setRead:'&setread',
                    //unsetRead:'&unsetread'
                },
                replace:true,
                template:'<div class="accordion-group {{item.id}}"></div>',
                compile:function (element, attrs) {
                    var html = '' +
                        '<div class="accordion-heading">' +
                            '<a class="accordion-toggle read-{{!item.unread}} starred-{{item.starred}}" data-toggle="collapse" data-parent="#accordion1" href="#collapse{{item.id}}">' +
                                '<span>{{item.title}}</span>' +
                                '<br/>' +
                                '<span ng-show="item.autor" class="itemadd">author: <span>{{item.author}}</span></span>' +
                                '<span ng-hide="item.autor" class="itemadd">author: <span>unknown</span></span>' +
                                '<span ng-show="item.pubDate" class="itemadd">date published: <span>{{item.pubDate}}</span></span>' +
                                '<span ng-hide="item.pubDate" class="itemadd">date published: <span>unknown</span></span>' +
                            '</a>' +
                        '</div>' +
                        '<div id="collapse{{item.id}}" class="accordion-body collapse">' +
                        '<div class="accordion-inner">' +
                        '<div class="accordion-heading">' +
                        '<div class="bodybox" ng-bind-html-unsafe="item.body"></div>' +
                        '<div class="buttonsbox">' +
                            '<span class="itemaddurl"><a ng-href="{{item.url}}" target="_blank"><i class="icon-file"></i></a></span>' +
                            '<span class="itemaddurl">' +
                                '<a class="read" href ng-click="readToggle(item.id)"><i ng-class="{\'icon-eye-open\':item.unread,\'icon-eye-close\':!item.unread}"></i></a>' +
                            '</span>' +
                            '<span class="itemaddurl">' +
                                '<a class="star" href ng-click="starToggle(item.feedId,item.guidHash)"><i ng-class="{\'icon-star\':item.starred,\'icon-star-empty\':!item.starred}"></i></a>' +
                            '</span>' +
                        //'<span class="itemaddurl"><a ng-click="alert(\'sasa\');" target="_blank"><i class="icon-ban-circle"></i></a></span>' +
                    '</div></div></div></div>';

                    element.append($(html));

                    return this.link;
                },
                link:function (scope, element, attrs) {
                    scope.readToggle = function (id) {

                        if(scope.item.unread === true) {
                            //This method uses main controller's setRead exposed
                            //through scope and directive's isolate scope
                            //scope.setRead({id:id});

                            //This method uses service to mark item read
                            //which has option for checking if marking was successful
                            ItemsService.setRead(id).success(function(result, status){
                                scope.item.unread = false;
                                $('.' + scope.item.id + ' a.read i').toggleClass('icon-eye-open icon-eye-close');
                                $('.' + scope.item.id +' .accordion-toggle').toggleClass('read-true read-false');
                            });
                        }
                        else if (scope.item.unread === false) {
                            //scope.unsetRead({id:id});
                            ItemsService.unsetRead(id).success(function(result, status){
                                scope.item.unread = true;
                                $('.' + scope.item.id + ' a.read i').toggleClass('icon-eye-open icon-eye-close');
                                $('.' + scope.item.id +' .accordion-toggle').toggleClass('read-true read-false');
                            });
                        }
                    };

                    scope.starToggle = function (feedId, guidHash) {
                        if(scope.item.starred === false) {
                            //scope.setFavorite({feedId:feedId, guidHash: guidHash});
                            ItemsService.setFavorite(feedId, guidHash).success(function(result, status){
                                scope.item.starred = true;
                                $('.' + scope.item.id + ' a.star i').toggleClass('icon-star icon-star-empty');
                                $('.' + scope.item.id +' .accordion-toggle').toggleClass('starred-true starred-false');
                            });
                        }
                        else if (scope.item.starred === true) {
                            //scope.unsetFavorite({feedId:feedId, guidHash: guidHash});
                            ItemsService.unsetFavorite(feedId, guidHash).success(function(result, status){
                                scope.item.starred = false;
                                $('.' + scope.item.id + ' a.star i').toggleClass('icon-star icon-star-empty');
                                $('.' + scope.item.id +' .accordion-toggle').toggleClass('starred-true starred-false');
                            });
                        }
                    };

                    $(element).hide();
                    $(element).fadeIn();
                }
            };


        }]);
