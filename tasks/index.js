(function () {
    'use strict';

    module.exports = function (grunt) {
        var glob = require('glob'),
            async = require('async'),
            _ = require('lodash'),
            utils = require('../lib/utils.js'),
            processor = require('./processor.js')(grunt),
            defaultOptions = {
                sourceEncoding: 'UTF-8',
                defaultOutputDir: '.tmp/mocks/',
                defaultPassThrough: [],
                sessionStorageDelay: 10
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

                var mockOptions = mergeJson(defaultOptions, configuration.options({})),
                    done = configuration.async(),
                    mocks;
                
                async.series({
                        processMocks: function (callback) {
                            grunt.verbose.writeln('Process all the mocks');
                            mocks = processor.processMocks(data.src, mockOptions.defaultPassThrough);
                            callback(null, 200);
                        },
                        registerMocks: function(callback) {
                            grunt.verbose.writeln('Register mocks');
                            utils.registerMocks(mocks);
                            callback(null, 200);
                        },
                        generateMockingInterface: function (callback) {
                            grunt.verbose.writeln('Generate the mocking web interface');
                            processor.generateMockInterface(mockOptions.defaultOutputDir);
                            callback(null, 200);
                        },
                        generateProtractorMock: function (callback) {
                            grunt.verbose.writeln('Generate protractor.mock.js');
                        //     processor.generateProtractorMock(mocks, mockOptions.defaultOutputDir, mockOptions.defaultPassThrough, mockOptions.sessionStorageDelay);
                            callback(null, 200);
                        }
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