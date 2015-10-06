(function () {
    'use strict';

    module.exports = function (grunt) {
        var glob = require("glob"),
            path = require('path');

        /**
         * Generate the mocking interface by processing all mocks.
         * @param {string} src The directory containing the mocks.
         * @param {object} dependencies The object containing the locations of the dependencies.
         * @param {string} outputDir The output directory. 
         * 
         * #1 iterate over each json file
         * #2 add the content to the mocks collection
         * #3 update the template with the gathered mocks
         * #4 write the template to file 
         */ 
        function generateMockInterface(src, dependencies, outputDir) {
            var mocks = [];

            // #1
            glob.sync('**/*.json', {cwd: src, root: '/'}).forEach(function (file) {
                // #2
                mocks.push(grunt.file.readJSON(src + path.sep + file));
            });
            
            // #3
            var template = grunt.template.process(grunt.file.read(path.resolve(__dirname, '..') + '/templates/index.html'), {
                data: {
                    mocks: JSON.stringify(mocks),
                    angular: dependencies.angular
                }
            });
            
            // #4
            grunt.file.write(outputDir + '/index.html', template, {encoding: 'utf8'});
        }

        /**
         * Generate the mock module. 
         * @param {string} moduleName The module name
         * @param {string} outputDir The output directory.
         * 
         * #1 update the template with the module name
         * #2 write the template to file
         */
        function generateMockModule(moduleName, outputDir) {
            // #1
            var template = grunt.template.process(grunt.file.read(path.resolve(__dirname, '..') + '/templates/ng-apimock.js'), {
                data: {
                    moduleName: moduleName
                }
            });

            // #2
            grunt.file.write(outputDir + '/ng-apimock.js', template, {encoding: 'utf8'});
        }

        /**
         * Copy the protractor.mock.js file to the output dir.
         * @param {string} outputDir The output directory.
         */
        function copyProtractorMock(outputDir) {
            grunt.file.write(outputDir + '/protractor.mock.js', grunt.file.read(path.resolve(__dirname, '..') + '/templates/protractor.mock.js'), {encoding: 'utf8'});
            
        }

        return {
            generateMockInterface: generateMockInterface,
            generateMockModule: generateMockModule,
            copyProtractorMock: copyProtractorMock
        };
    };
})();
