(function () {
    'use strict';

    /**
     * Tests for the grunt-ng-apimock plugin.
     */
    describe('ngApimock', function () {
        var gruntMock = require('gruntmock'),
            ngApimock = require('./../tasks/ngApimock.js'),
            fsExtra = require('fs-extra'),
            path = require('path');

        const DEFAULT_OPTIONS = {
            defaultOutputDir: '.tmp/mocks'
        };

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
        
        it('should generate the web interface, mock module and protractor mock module', function (done) {
            var opts = DEFAULT_OPTIONS;
            opts.defaultOutputDir = '.tmp/mocks';
            var mock = gruntMock.create({
                    target: 'all', options: DEFAULT_OPTIONS, data: {
                        moduleName: 'x',
                        src: 'test/mocks'
                    }
                }
            );
            mock.invoke(ngApimock, function (err) {
                expect(mock.logError.length).toBe(0);
                expect(mock.logOk.length).toBe(4);
                expect(mock.logOk[0]).toBe('Process all the mocks');
                expect(mock.logOk[1]).toBe('Register mocks');
                expect(mock.logOk[2]).toBe('Generate the mocking web interface');
                expect(mock.logOk[3]).toBe('Generate protractor.mock.js');
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'index.html')).toBeTruthy();
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'js' + path.sep + 'angular.min.js')).toBeTruthy();
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'js' + path.sep + 'angular-resource.min.js')).toBeTruthy();
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'js' + path.sep + '_ngApimock.js')).toBeTruthy();
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'js' + path.sep + 'ngapimock.component.js')).toBeTruthy();
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'js' + path.sep + 'ngapimock.controller.js')).toBeTruthy();
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'js' + path.sep + 'mocks.service.js')).toBeTruthy();
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'js' + path.sep + 'variables.service.js')).toBeTruthy();
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'css' + path.sep + 'main.css')).toBeTruthy();
                expect(fsExtra.existsSync(opts.defaultOutputDir + path.sep + 'protractor.mock.js')).toBeTruthy();
                done();
            });
        });
    });
})();