(function () {
    'use strict';

    module.exports = function (grunt) {
        var glob = require('glob'),
            async = require('async'),
            _ = require('lodash'),
            processor = require('./processor.js')(grunt),
            defaultOptions = {
                sourceEncoding: 'UTF-8',
                defaultOutputDir: '.tmp/mocks/',
                defaultPassThrough: []
            };

        /**
         * Deep merge json objects.
         * @param original The original object.
         * @param override The override object.
         * @return merged The merged object.
         */
        function mergeJson(original, override) {
            return _.merge(original, override, function (a, b, key, aParent, bParent) {
                if (_.isUndefined(b)) {
                    aParent[key] = undefined;
                    return;
                }
            });
        }

        return {
            run: function (configuration) {
                var data = configuration.data;

                if (typeof data.moduleName === 'undefined') {
                    grunt.fail.fatal('No module name information has been specified.');
                }

                if (typeof data.src === 'undefined') {
                    grunt.fail.fatal('No mock source directory have been specified.');
                }

                if (typeof data.dependencies === 'undefined') {
                    grunt.fail.fatal('No dependencies have been provided.');
                }

                if (typeof data.dependencies.angular === 'undefined') {
                    grunt.fail.fatal('No path has been specified for dependency angular.');
                }

                var mockOptions = mergeJson(defaultOptions, configuration.options({})),
                    done = configuration.async(),
                    mocks;

                async.series({
                        // #1
                        processMocks: function (callback) {
                            grunt.verbose.writeln('Process all the mocks');
                            mocks = processor.processMocks(data.src, mockOptions.defaultPassThrough);
                            callback(null, 200);
                        },
                        // #1
                        generateMockingInterface: function (callback) {
                            grunt.verbose.writeln('Generate the mocking web interface');
                            processor.generateMockInterface(mocks, data.dependencies, mockOptions.defaultOutputDir);
                            callback(null, 200);
                        },
                        // #2
                        generateMockModule: function (callback) {
                            grunt.verbose.writeln('Generate ng-apimock.js');
                            processor.generateMockModule(data.moduleName, mockOptions.defaultOutputDir, mockOptions.defaultPassThrough);
                            callback(null, 200);
                        },
                        // #3
                        generateProtractorMock: function (callback) {
                            grunt.verbose.writeln('Generate protractor.mock.js');
                            processor.generateProtractorMock(mocks, mockOptions.defaultOutputDir, mockOptions.defaultPassThrough);
                            callback(null, 200);
                        },
                    },
                    function (err) {
                        if (err !== undefined && err !== null) {
                            grunt.fail.fatal(err);
                        }
                        done();
                    });
            }
        };
    };
})();