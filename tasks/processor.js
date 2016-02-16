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
         * Process all the mocks.
         * @param {string} src The directory containing the mocks.
         * @param {string} passThroughs The default passThroughs
         *
         * #1 iterate over each json file
         * #2 add passThrough if not configured.
         * #3 add the content to the mocks collection
         * #4 check for default passThrough configuration
         * #5 add the default passThroughs if custom json file is omitted
         */
        function processMocks(src, passThroughs) {
            var mocks = [];

            // #1
            glob.sync('**/*.json', {cwd: src, root: '/'}).forEach(function (file) {
                var mock = grunt.file.readJSON(src + path.sep + file);

                // #2
                if(!mock.responses.passThrough) {
                    mock.responses.passThrough = {}
                }

                // #3
                mocks.push(mock);
            });

            // #4
            passThroughs.forEach(function(passThrough) {
                if(!_.find(mocks, function(mock) {
                        return mock.expression === passThrough.expression;
                    })) {
                    // #5
                    mocks.push(createPassThroughMock(passThrough));
                }
            });

            return mocks;
        }

        /**
         * Generate the mocking interface by processing all mocks.
         * @param {string} src The directory containing the mocks.
         * @param {object} dependencies The object containing the locations of the dependencies.
         * @param {string} outputDir The output directory.
         *
         * #1 update the template with the gathered mocks
         * #2 write the template to file
         */
        function generateMockInterface(mocks, dependencies, outputDir) {
            // #1
            var templateDir = path.resolve(__dirname, '..') + '/templates';
            var template = grunt.template.process(grunt.file.read(templateDir + '/index.html'), {
                data: {
                    mocks: JSON.stringify(mocks),
                    angular: dependencies.angular,
                    appJs: grunt.file.read(templateDir + '/index/app.js'),
                    registryProviderJs: grunt.template.process(grunt.file.read(templateDir + '/index/registry.provider.js'), {
                        data: {
                            mocks: JSON.stringify(mocks)
                        }
                    }),
                    storageFactoryJs: grunt.file.read(templateDir + '/index/storage.factory.js'),
                    controllerJs: grunt.file.read(templateDir + '/index/controller.js'),
                    css: grunt.file.read(templateDir + '/index/main.css'),
                    template: grunt.file.read(templateDir + '/index/template.html'),
                }
            });

            // #2
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
        function generateProtractorMock(mocks, outputDir, defaultPassThroughs) {
            var processedMocks = _.map(mocks,function(el){
                return {
                    expression: el['expression'],
                    method: el['method'],
                    isArray: el['isArray']
                };
            });

            var passThroughs = _.uniq(_(processedMocks).concat(defaultPassThroughs).value(), function(e) {
                return e['expression'] + (e['method'] || 'GET');
            });

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
            processMocks: processMocks,
            generateMockInterface: generateMockInterface,
            generateMockModule: generateMockModule,
            generateProtractorMock: generateProtractorMock
        };
    };
})();