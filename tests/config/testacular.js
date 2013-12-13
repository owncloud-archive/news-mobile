/**
 *
 * ownCloud - News
 *
 * @author Bernhard Posselt
 * @copyright 2012 Bernhard Posselt nukeawhale@gmail.com
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

// Testacular configuration
// Generated on Tue Feb 12 2013 19:27:01 GMT+0100 (CET)


// base path, that will be used to resolve files and exclude
basePath = '../../';


// list of files / patterns to load in the browser
files = [
    JASMINE,
    JASMINE_ADAPTER,
    'www/vendor/jquery/jquery.js',
    'www/vendor/angular/angular.js',
    'www/vendor/angular-mocks/angular-mocks.js',
    'www/vendor/angular-route/angular-route.js',
    'www/vendor/angular-sanitize/angular-sanitize.js',
    'www/vendor/angular-local-storage/angular-local-storage.js',
    'tests/stubs/app.js',
    'www/config/routes.js',
    'www/directives/*.js',
    'www/filters/*.js',
    'www/services/**/*.js',
    'www/controllers/**/*.js',
    'tests/**/*Spec.js'
];


// list of files to exclude
exclude = [
    'app/app.js'
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 8080;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Firefox'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
