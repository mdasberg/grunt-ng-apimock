(function () {
    /*
     * grunt-ng-apimock
     * https://github.com/mdasberg/grunt-ng-apimock
     *
     * Copyright (c) 2015 Mischa Dasberg and contributors
     * Licensed under the MIT license.
     */

    'use strict';
    module.exports = function (grunt) {
        /** Sonar karma results. */
        grunt.registerMultiTask('ngApimock', 'Grunt plugin that provides the ability to use scenario based api mocking of angular apps",', function () {
            require('./index')(grunt).run(this);
        });
    };
})();