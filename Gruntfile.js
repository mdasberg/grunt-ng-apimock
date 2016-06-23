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
                        'Gruntfile.js',
                        'tasks/*.js'
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
                },
                // Before generating any new files, remove any previously-created files.
                clean: {
                    tests: ['.tmp']
                },
                shell: {
                    jasmineNode: {
                        command: 'node node_modules/jasmine-node/bin/jasmine-node test/*.spec.js'
                    }
                }
            }
        );

        // Actually load this plugin's task(s).
        grunt.loadTasks('tasks');

        // These plugins provide necessary tasks.
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-shell');

        // Whenever the "test" task is run, first clean the "tmp" dir, then run this
        // plugin's task(s), then test the result.
        grunt.registerTask('test', 'Run tests', ['clean', 'shell']);

        // By default, lint and run all tests.
        grunt.registerTask('default', ['jshint', 'test']);

    };
})();