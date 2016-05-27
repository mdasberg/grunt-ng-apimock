(function () {
    'use strict';

    module.exports = function (grunt) {
        var glob = require("glob"),
            fs = require('fs-extra'),
        //     _ = require('lodash'),
            path = require('path');

        /**
         * Process all the mocks.
         * @param {string} src The directory containing the mocks.
         *
         * #1 iterate over each json file
         * #2 add the content to the mocks collection
         */
        function processMocks(src) {
            var mocks = [];
            // #1
            glob.sync('**/*.json', {cwd: src, root: '/'}).forEach(function (file) {
                // #2
                mocks.push(grunt.file.readJSON(src + path.sep + file));
            });
            return mocks;
        }

        /**
         * Generate the mocking interface by processing all mocks.
         * @param {string} outputDir The output directory.
         *
         * #1 copy the interface to the output directory
         * #2 copy the dependencies to the output directory
         */
        function generateMockInterface(outputDir) {
            // #1
            var templateDir = path.join(path.resolve(__dirname, '..'),'/templates/interface');
            glob.sync('**/*', {cwd: templateDir, root: '/'}).forEach(function(file) {
                fs.copySync(templateDir + path.sep + file, outputDir + path.sep + file);
            });

            var nodeModulesDir = path.join(process.cwd(), '/node_modules');
            fs.copySync(nodeModulesDir + path.sep + 'angular' + path.sep + 'angular.min.js', outputDir + path.sep + 'js' + path.sep + 'angular.min.js');
            fs.copySync(nodeModulesDir + path.sep + 'angular-resource' + path.sep + 'angular-resource.min.js', outputDir + path.sep + 'js' + path.sep + 'angular-resource.min.js');
        }

        /**
         * Copy the protractor.mock.js file to the output dir.
         * @param {string} mocks The mocks
         * @param {string} outputDir The output directory.
         * @param {object} passThroughs The passThroughs.
         * @param {number} sessionStorageDelay The Session storage delay.
         *
         * #1 update the template with the module name
         * #2 write the template to file
         */
        function generateProtractorMock(mocks, outputDir, defaultPassThroughs, sessionStorageDelay) {
        //     var processedMocks = _.map(mocks,function(el){
        //         return {
        //             expression: el['expression'],
        //             method: el['method'],
        //             isArray: el['isArray']
        //         };
        //     });
        //
        //     var passThroughs = _.uniqBy(processedMocks.concat(defaultPassThroughs), function(e) {
        //         return e['expression'] + (e['method'] || 'GET');
        //     });
        //
        //     passThroughs.forEach(function(p) {
        //         p.response = {};
        //     });
        //
        //
        //     // #1
        //     var template = grunt.template.process(grunt.file.read(path.resolve(__dirname, '..') + '/templates/protractor.mock.js'), {
        //         data: {
        //             passThroughs: JSON.stringify(passThroughs),
        //             sessionStorageDelay: sessionStorageDelay
        //         }
        //     });
        //
        //     // #2
        //     grunt.file.write(outputDir + '/protractor.mock.js', template, {encoding: 'utf8'});

        }

        return {
            processMocks: processMocks,
            generateMockInterface: generateMockInterface,
            generateProtractorMock: generateProtractorMock
        };
    };
})();