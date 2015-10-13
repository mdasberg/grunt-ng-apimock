(function () {
    'use script';

    /**
     * Tests for the grunt-ng-apimock plugin.
     */
    describe('ngApimock', function () {
        var gruntMock = require('gruntmock'),
            ngApimock = require('./../tasks/ngApimock.js'),
            fs = require('fs'),
            fsExtra = require('fs-extra'),
            path = require('path'),
            bufferEqual = require('buffer-equal');

        /**
         * Indicates if the file content matches.
         * @param actual The actual.
         * @param expected The expected.
         * @returns {*}
         */
        function fileContentMatches(actual, expected) {
            if (!fs.existsSync(actual) || !fs.existsSync(expected)) {
                return false;
            }
            return bufferEqual(new Buffer(fs.readFileSync(actual, {encoding: 'utf8'})), new Buffer(fs.readFileSync(expected, {encoding: 'utf8'})));
        }

        const DEFAULT_OPTIONS = {
            defaultOutputDir: '.tmp/mocks'
        };

        it('should fail when no module name has been provided in the configuration', function (done) {
            var mock = gruntMock.create({
                    target: 'all', options: DEFAULT_OPTIONS, data: {}
                }
            );
            mock.invoke(ngApimock, function (err) {
                expect(mock.logError[0]).toBe('No module name information has been specified.');
                done();
            });
        });

        it('should fail when no sources directory has been provided in the configuration', function (done) {
            var mock = gruntMock.create({
                    target: 'all', options: DEFAULT_OPTIONS, data: {
                        moduleName: 'x'
                    }
                }
            );
            mock.invoke(ngApimock, function (err) {
                expect(mock.logError[0]).toBe('No mock source directory have been specified.');
                done();
            });
        });

        it('should fail when no dependency paths have been provided in the configuration', function (done) {
            var mock = gruntMock.create({
                    target: 'all', options: DEFAULT_OPTIONS, data: {
                        moduleName: 'x',
                        src: 'mocks'
                    }
                }
            );
            mock.invoke(ngApimock, function (err) {
                expect(mock.logError[0]).toBe('No dependencies have been provided.');
                done();
            });
        });

        it('should fail when no dependency paths have been provided in the configuration', function (done) {
            var mock = gruntMock.create({
                    target: 'all', options: DEFAULT_OPTIONS, data: {
                        moduleName: 'x',
                        src: 'mocks',
                        dependencies: {}
                    }
                }
            );
            mock.invoke(ngApimock, function (err) {
                expect(mock.logError[0]).toBe('No path has been specified for dependency angular.');
                done();
            });
        });

        it('should generate the web interface, mock module and protractor mock module', function (done) {
            var opts = DEFAULT_OPTIONS;
            opts.defaultOutputDir = '.tmp/mocks';
            var mock = gruntMock.create({
                    target: 'all', options: DEFAULT_OPTIONS, data: {
                        moduleName: 'x',
                        src: 'mocks',
                        dependencies: {
                            angular: '/some/path/to/angular.js'
                        }
                    }
                }
            );
            mock.invoke(ngApimock, function (err) {
                expect(mock.logError.length).toBe(0);
                expect(mock.logOk.length).toBe(3);
                expect(mock.logOk[0]).toBe('Generate the mocking web interface');
                expect(mock.logOk[1]).toBe('Generate mock module');
                expect(mock.logOk[2]).toBe('Copy protractor.mock.js');
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'ng-apimock.js')).toBeTruthy();
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'index.html')).toBeTruthy();
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'protractor.mock.js')).toBeTruthy();
                expect(fileContentMatches(opts.defaultOutputDir + path.sep + 'index.html', 'test/expected/mocks/index.html')).toBeTruthy();
                expect(fileContentMatches(opts.defaultOutputDir + path.sep + 'ng-apimock.js', 'test/expected/mocks/ng-apimock.js')).toBeTruthy();
                expect(fileContentMatches(opts.defaultOutputDir + path.sep + 'protractor.mock.js', 'test/expected/mocks/protractor.mock.js')).toBeTruthy();
                done();
            });
        });

        it('should generate the web interface, mock module and protractor mock module with default passThroughs', function (done) {
            var opts = DEFAULT_OPTIONS;
            opts.defaultOutputDir = '.tmp/mocks-with-defaults';
            opts.defaultPassThrough = [
                {
                    "expression": "partials/.*",
                    "method": "GET"
                }, {
                    "expression": "non-existing-custom-json/.*"
                }
            ];
            var mock = gruntMock.create({
                    target: 'all', options: opts, data: {
                        moduleName: 'x',
                        src: 'mocks',
                        dependencies: {
                            angular: '/some/path/to/angular.js'
                        }
                    }
                }
            );
            mock.invoke(ngApimock, function (err) {
                expect(mock.logError.length).toBe(0);
                expect(mock.logOk.length).toBe(3);
                expect(mock.logOk[0]).toBe('Generate the mocking web interface');
                expect(mock.logOk[1]).toBe('Generate mock module');
                expect(mock.logOk[2]).toBe('Copy protractor.mock.js');
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'ng-apimock.js')).toBeTruthy();
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'index.html')).toBeTruthy();
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'protractor.mock.js')).toBeTruthy();
                expect(fileContentMatches(opts.defaultOutputDir + path.sep + 'index.html', 'test/expected/mocks-with-defaults/index.html')).toBeTruthy();
                expect(fileContentMatches(opts.defaultOutputDir + path.sep + 'ng-apimock.js', 'test/expected/mocks-with-defaults/ng-apimock.js')).toBeTruthy();
                expect(fileContentMatches(opts.defaultOutputDir + path.sep + 'protractor.mock.js', 'test/expected/mocks-with-defaults/protractor.mock.js')).toBeTruthy();
                done();
            });
        });
    });
})();