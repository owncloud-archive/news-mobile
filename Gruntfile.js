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

module.exports = function(grunt) {

	// load needed modules
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-wrap');
	grunt.loadNpmTasks('gruntacular');

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');


	grunt.initConfig({

		meta: {
			pkg: grunt.file.readJSON('package.json'),
			version: '<%= meta.pkg.version %>',
            name: '<%= meta.pkg.name %>',
			production: 'www/public/'
		},

        copy: {
            assets: {
                files: [
                    {
                        expand: true,
                        cwd: 'www/',
                        src: [
                            'css/**',
                            'images/**',
                            'img/**',
                            'languages/**',
                            'public/**',
                            'templates/**',
                            'vendor/**',
                            'index_ffos.html'
                        ],
                        dest: 'platforms/firefoxos/assets/'
                    },
                    {
                        expand: true,
                        cwd: 'platforms/firefoxos/templates/',
                        src: 'manifest.webapp',
                        dest: 'platforms/firefoxos/assets/'
                    },
                    {
                        expand: true,
                        cwd: 'platforms/firefoxos/templates/',
                        src: ['package.manifest','index.html'],
                        dest: 'platforms/firefoxos/bin/'
                    }
                ]
            },
            archive: {
                files: [
                    {
                        src: '<%= meta.name %>.<%= meta.version %>.zip',
                        dest: 'platforms/firefoxos/bin/'
                    }
                ]
            }
        },

        compress: {
            main: {
                options: {
                    mode: 'zip',
                    archive: '<%= meta.name %>.<%= meta.version %>.zip'
                },
                expand: true,
                cwd: 'platforms/firefoxos/assets/',
                src: '**',
                dest: '/'
            }
        },

        clean: {
            firefoxos_assets: ['platforms/firefoxos/assets/','platforms/firefoxos/bin/'],
            firefoxos_archive: ['<%= meta.name %>.<%= meta.version %>.zip']
        },

		concat: {
			options: {
				// remove license headers
				stripBanners: true,
				banner: '/**\n' +
				' * Copyright (c) 2013, Bernhard Posselt ' +
				'<nukeawhale@gmail.com> \n' +
				' * Copyright (c) 2013, Ilija Lazarevic ' +
				'<ikac.ikax@gmail.com> \n' +
				' * This file is licensed under the Affero ' +
				'General Public License version 3 or later. \n' +
				' * See the COPYING file.\n */\n\n'
			},
			dist: {
				src: [
					'www/config/app.js',
					'www/config/routes.js',
					'www/config/cors.js',
					'www/config/exceptions.js',
					'www/controllers/**/*.js',
					'www/directives/**/*.js',
					'www/filters/**/*.js',
					'www/services/**/*.js'
				],
				dest: '<%= meta.production %>app.js'
			}
		},

		wrap: {
			app: {
				src: ['<%= meta.production %>app.js'],
				dest: '',
				wrapper: [
					'(function(angular, $, undefined){\n\n\'use strict\';\n\n',
					'\n})(window.angular, jQuery);'
				]
			}
		},

		jshint: {
			files: [
				'Gruntfile.js',
				'www/controllers/**/*.js',
				'www/directives/**/*.js',
				'www/filters/**/*.js',
				'www/services/**/*.js',
				'tests/**/*.js',
				'www/config/*.js'],
			options: {
				// options here to override JSHint defaults
				globals: {
					console: true
				}
			}
		},

		watch: {
			// this watches for changes in the app directory and runs the concat
			// and wrap tasks if something changed
			concat: {
				files: [
					'www/controllers/**/*.js',
					'www/directives/**/*.js',
					'www/filters/**/*.js',
					'www/services/**/*.js',
					'www/config/*.js'
				],
				tasks: ['build']
			}
		},

		testacular: {
			unit: {
				configFile: 'tests/config/testacular.js'
			},
			continuous: {
				configFile: 'tests/config/testacular.js',
				singleRun: true,
				browsers: ['PhantomJS'],
				reporters: ['progress', 'junit'],
				junitReporter: {
					outputFile: 'test-results.xml'
				}
			}
		}

	});

	// make tasks available under simpler commands
	grunt.registerTask('build', ['jshint', 'concat', 'wrap']);
	grunt.registerTask('watchjs', ['watch:concat']);
	grunt.registerTask('ci', ['testacular:continuous']);
	grunt.registerTask('testjs', ['testacular:unit']);
    grunt.registerTask('firefoxos', ['clean:firefoxos_assets','clean:firefoxos_archive','copy:assets','compress','copy:archive','clean:firefoxos_archive']);

};
