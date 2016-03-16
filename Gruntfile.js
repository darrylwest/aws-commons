/**
 * Standard Server Gruntfile
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 2014-04-12
 */
module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        dirs: {
            lib:'lib',
            test: 'test'
        },
        watch:{
            scripts:{
                files:[
                    '<%= dirs.lib %>/*.js',
                    '<%= dirs.test %>/*.js',
                    '<%= dirs.test %>/*/*.js'
                ],
                tasks: [
                    'mochaTest',
                    'jshint'
                ],
                options:{
                    spawn: true
                }
            }
        },
        jshint: {
            options:{
                jshintrc: '.jshintrc',
                verbose: true,
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= dirs.lib %>/*.js',
                '<%= dirs.test %>/*.js',
                '<%= dirs.test %>/*/*.js'
            ]
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: [
                    '<%= dirs.test %>/*.js'
                ]
            }
        }
    });

    grunt.registerTask('watchall', [
        'mochaTest',
        'jshint',
        'watch'
    ]);

    grunt.registerTask('test', [
        'mochaTest',
        'jshint'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'mochaTest',
        'validate-package'
    ]);
};

