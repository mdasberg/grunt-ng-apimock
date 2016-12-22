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
            var configuration = {
                src: this.data.src,
                outputDir: this.options({}).defaultOutputDir,
                done: this.async()
            };
            require('ng-apimock')(grunt).run(configuration);
        });
    };
})();