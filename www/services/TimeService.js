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


angular.module('News').factory('TimeService', [ function () {
    var day = 60 * 60 * 24 * 1000; //miliseconds in a day
    var hour = 60 * 60 * 1000; //miliseconds in a hour
    var minute = 60 * 1000; //miliseconds in a minute

    return {
        getDateFromUTC:function (utc) {
            var dateNow = Date.now();
            var itemDate = new Date(utc * 1000);
            var daysAgo = Math.floor((dateNow - itemDate) / day);
            var hoursAgo = Math.floor((dateNow - itemDate) / hour);
            var minutesAgo = Math.floor((dateNow - itemDate) / minute);

            if (daysAgo <= 0) {
                if (hoursAgo <= 0) {
                    if (minutesAgo <= 1 ) {
                        return "Moment ago";
                    }
                    else if (minutesAgo < 10) {
                        return "Couple of minutes ago";
                    }
                    else {
                        return "Half hour ago";
                    }
                }
                else if(hoursAgo === 1)
                {
                    return "1 hour ago";
                }
                else if (hoursAgo > 1) {
                    return hoursAgo + " hours ago";
                }
            }
            else if (daysAgo === 1) {
                return "1 day ago";
            }
            else if (daysAgo <= 10) {
                return daysAgo + " days ago";
            }
            else {
                return itemDate.toDateString();
            }
        },

        convertItemsDates:function (items) {
            for (var i in items) {
                items[i].pubDate = this.getDateFromUTC(items[i].pubDate);
            }
        },

        convertFeedsDates:function (items) {
            for (var i in items) {
                items[i].added = this.getDateFromUTC(items[i].added);
            }
        }


    };
}]);
