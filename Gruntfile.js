(function () {
    /*
     * grunt-ng-apimock
     * https://github.com/mdasberg/grunt-ng-apimock
     *
     * Copyright (c) 2015 Mischa Dasberg
     * Licensed under the MIT license.
     */

    'use strict';

    module.exports = function (grunt) {

        // Project configuration.
        grunt.initConfig({
                jshint: {
                    all: [
                        'Gruntfile.js'
                    ],
                    options: {
                        jshintrc: '.jshintrc'
                    }
                },
                ngApimock: {
                    options: {
                        defaultOutputDir: '.tmp/some-other-dir'
                    },
                    mock: {
                        src: 'test/mocks'
                    }
                }
            }
        );

        // Actually load this plugin's task(s).
        grunt.loadTasks('tasks');

        // By default, lint and run all tests.
        grunt.registerTask('default', ['ngApimock']);

    };
})();