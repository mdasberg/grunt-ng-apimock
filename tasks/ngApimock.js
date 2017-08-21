(function () {
    'use strict';

    /*
     * grunt-ng-apimock
     * https://github.com/mdasberg/grunt-ng-apimock
     *
     * Copyright (c) 2015 Mischa Dasberg and contributors
     * Licensed under the MIT license.
     */

    module.exports = function (grunt) {

        /** Ng apimock. */
        grunt.registerMultiTask('ngApimock', 'Grunt plugin that provides the ability to use scenario based api mocking of angular apps",', function () {
            var async = require("async");
            var options = this.options({});

            var configuration = {
                src: this.data.src,
                outputDir: options.defaultOutputDir,
                done: function () {
                }
            };
            var done = this.async();
            var watch = options.watch;

            var ngApimock = require('ng-apimock')(grunt);

            async.series({
                    run: function (callback) {
                        ngApimock.run(configuration);
                        callback(null, 'run');
                    },
                    watch: function (callback) {
                        if(watch) {
                            ngApimock.watch(configuration.src);
                        }
                        callback(null, 'watch');
                    }
                },
                function (err) {
                    if (err !== undefined && err !== null) {
                        console.error(err);
                    }
                    done();
                });
        });
    };
})();