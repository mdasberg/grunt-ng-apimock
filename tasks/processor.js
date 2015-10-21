(function () {
    'use strict';

    module.exports = function (grunt) {
        var glob = require("glob"),
            _ = require('lodash'),
            path = require('path');

        /**
         * Creates a passThrough mock object that is used for adding $httpBackend passThrough for the given expression.
         * @param passThrough The passThrough object.
         * @returns mockObject The passThrough mock object.
         */
        function createPassThroughMock(passThrough) {
            return {
                "expression": passThrough.expression,
                "method": passThrough['method'] || "GET",
                "responses": {
                    "passThrough": {}
                }
            };
        }

        /**
         * Generate the mocking interface by processing all mocks.
         * @param {string} src The directory containing the mocks.
         * @param {object} dependencies The object containing the locations of the dependencies.
         * @param {string} outputDir The output directory. 
         * 
         * #1 iterate over each json file
         * #2 add the content to the mocks collection
         * #3 check for default passThrough configuration
         * #4 add the default passThroughs if custom json file is omitted
         * #5 update the template with the gathered mocks
         * #6 write the template to file
         */
        function generateMockInterface(src, dependencies, outputDir, passThroughs) {
            var mocks = [];
            
            // #1
            glob.sync('**/*.json', {cwd: src, root: '/'}).forEach(function (file) {
                // #2
                mocks.push(grunt.file.readJSON(src + path.sep + file));
            });

            // #3
            passThroughs.forEach(function(passThrough) {
                if(!_.find(mocks, function(mock) {
                        return mock.expression === passThrough.expression;
                    })) {
                    // #4
                    mocks.push(createPassThroughMock(passThrough));
                }
            });
            
            // #5
            var template = grunt.template.process(grunt.file.read(path.resolve(__dirname, '..') + '/templates/index.html'), {
                data: {
                    mocks: JSON.stringify(mocks),
                    angular: dependencies.angular
                }
            });
            
            // #6
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
        function generateMockModule(moduleName, outputDir, passThroughs) {
            // #1
            var template = grunt.template.process(grunt.file.read(path.resolve(__dirname, '..') + '/templates/ng-apimock.js'), {
                data: {
                    moduleName: moduleName,
                    passThroughs: JSON.stringify(passThroughs)
                }
            });

            // #2
            grunt.file.write(outputDir + '/ng-apimock.js', template, {encoding: 'utf8'});
        }

        /**
         * Copy the protractor.mock.js file to the output dir.
         * @param {string} outputDir The output directory.
         *
         * #1 update the template with the module name
         * #2 write the template to file 
         */
        function copyProtractorMock(outputDir, passThroughs) {
            passThroughs.forEach(function(p) {
                p.response = {};
            });
            
            // #1
            var template = grunt.template.process(grunt.file.read(path.resolve(__dirname, '..') + '/templates/protractor.mock.js'), {
                data: {
                    passThroughs: JSON.stringify(passThroughs)
                }
            });
            
            // #2
            grunt.file.write(outputDir + '/protractor.mock.js', template, {encoding: 'utf8'});
            
        }

        return {
            generateMockInterface: generateMockInterface,
            generateMockModule: generateMockModule,
            copyProtractorMock: copyProtractorMock
        };
    };
})();