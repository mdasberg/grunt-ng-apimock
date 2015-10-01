(function () {
    'use strict';

    module.exports = function (grunt) {
        var glob = require("glob"),
            path = require('path');

        function process(src, dependencies, outputDir) {
            var mocks = [],
                o;

            glob.sync('**/*.json', {cwd: src, root: '/'}).forEach(function (file) {
                var json = grunt.file.readJSON(src + path.sep + file);
                mocks.push(json);
            });
            var template = grunt.template.process(grunt.file.read('templates/index.html'), {
                data: {
                    mocks: JSON.stringify(mocks),
                    angular: dependencies.angular
                }
            });
            grunt.file.write(outputDir + '/index.html', template, {encoding: 'utf8'});
        }

        return {
            process: process
        };
    };
})();
