(function () {
    'use strict';

    module.exports = function (grunt) {
        var glob = require('glob'),
            async = require('async'),
            _ = require('lodash'),
            processor = require('./processor.js')(grunt),
            defaultOptions = {
                sourceEncoding: 'UTF-8',
                defaultOutputDir: '.tmp/mocks/'
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

                if (typeof data.module === 'undefined') {
                    grunt.fail.fatal('No module information has been specified.');
                }

                if (typeof data.src === 'undefined') {
                    grunt.fail.fatal('No mock sources have been specified.');
                }

                var mockOptions = mergeJson(defaultOptions, configuration.options({})),
                    done = configuration.async();

                async.series({
                        // #1
                        processMocks: function (callback) {
                            grunt.verbose.writeln('Processing mocks');
                            processor.process(data.src, data.dependencies, mockOptions.defaultOutputDir);
                            callback(null, 200);
                        },
                        // #2
                        generateMockModule: function (callback) {
                            grunt.verbose.writeln('Generate mock module');
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