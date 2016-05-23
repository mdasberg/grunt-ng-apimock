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
                        defaultOutputDir: '.tmp/some-other-dir',
                        sessionStorageDelay: 100,
                        defaultPassThrough: [
                            {
                                "expression": "partials/.*",
                                "method": "GET"
                            }, {
                                "expression": "non-existing-custom-json/.*"
                            }
                        ]
                    },
                    mock: {
                        src: 'test/mocks',
                        moduleName: 'ngApimock-example',
                        dependencies: {
                            angular: '/node_modules/angular/angular.js'
                        }
                    }
                },

                // Before generating any new files, remove any previously-created files.
                clean: {
                    tests: ['.tmp']
                },
                protractor: {
                    options: {
                        keepAlive: true,
                        noColor: false,
                    },
                    local: {
                        options: {
                            configFile: 'test/protractor/config/protractor-local.conf.js'
                        }
                    },
                    travis: {
                        options: {
                            configFile: 'test/protractor/config/protractor-travis.conf.js'
                        }
                    }
                },
                connect: {
                    yourTarget: {
                        options: {
                            open:false,
                            port:9900,
                            middleware: function (connect) {
                                var serveStatic = require('serve-static');
                                return [
                                    connect().use('/node_modules', serveStatic('node_modules')),
                                    connect().use('/mocking', serveStatic('.tmp/some-other-dir')),
                                    connect().use('/', serveStatic('test/example')),
                                    connect().use('/online/rest/some/api', function(request, response, next){
                                        response.writeHead(200, {'Content-Type': 'application/json' });
                                        if(request.method === 'GET') {
                                            response.end("[{\"a\":\"b\"}]");
                                        } else if(request.method === 'POST') {
                                            response.end("{\"some\": \"thing\"}");
                                        }
                                    })
                                ];
                            }
                        }
                    }
                },
                watch: {
                    all: { // only update the ngApimock in case a file has been changed
                        files: [
                            'templates/**/*'
                        ],
                        tasks: ['ngApimock']
                    }
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
        grunt.loadNpmTasks('grunt-contrib-connect');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-protractor-runner');
        grunt.loadNpmTasks('grunt-shell');

        // Whenever the "test" task is run, first clean the "tmp" dir, then run this
        // plugin's task(s), then test the result.
        grunt.registerTask('local', 'Run tests locally', ['clean', 'shell', 'ngApimock', 'connect', 'protractor:local']);
        grunt.registerTask('travis', 'Run tests on Travis CI', ['clean', 'shell', 'ngApimock', 'connect', 'protractor:travis']);

        grunt.registerTask('serve', ['clean', 'ngApimock', 'connect', 'watch']);

        // By default, lint and run all tests.
        grunt.registerTask('default', ['jshint', 'test']);

    };
})();