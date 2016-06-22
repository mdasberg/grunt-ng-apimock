(function () {
    'use strict';

    var hooker = require('hooker');

    /*
     * grunt-ng-apimock
     * https://github.com/mdasberg/grunt-ng-apimock
     *
     * Copyright (c) 2015 Mischa Dasberg and contributors
     * Licensed under the MIT license.
     */

    'use strict';
    module.exports = function (grunt) {
        console.log = function(){};
        hooker.hook(console, "log", function () {
            grunt.log.writeln(arguments[0]);
        });
        console.error = function(){};
        hooker.hook(console, "error", function () {
            grunt.fail.fatal(arguments[0]);
        });
        console.info = function(){};
        hooker.hook(console, 'info', function () {
            grunt.verbose.writeln(arguments[0]);
        });

        /** Sonar karma results. */
        grunt.registerMultiTask('ngApimock', 'Grunt plugin that provides the ability to use scenario based api mocking of angular apps",', function () {
            require('./index')(grunt).run(this);
        });
    };
})();