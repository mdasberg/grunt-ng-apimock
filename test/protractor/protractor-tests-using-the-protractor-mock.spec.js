(function () {
    'use strict';
    
    describe('ngApimock - protractor.mock.js', function () {
        var ngApimock = require('../../.tmp/some-other-dir/protractor.mock.js');
        
        describe('when provided without any selected scenarios', function () {
            beforeAll(function () {
                ngApimock.addMockModule();
                browser.get('/index.html');
            });

            it('should not show any data', function () {
                expect(element(by.binding('ctrl.data')).getText()).toBe('data:');
            });

            it('should not show any errors', function () {
                expect(element(by.binding('ctrl.error')).getText()).toBe('error:');
            });

            afterAll(function () {
                ngApimock.removeMockModule();
                ngApimock.resetScenarios();
            });
        });

        describe('when provided with some selected scenarios', function () {
            beforeAll(function () {
                ngApimock.selectScenario(require('../mocks/some-api.json'), 'some-meaningful-scenario-name');
                ngApimock.addMockModule();

                browser.get('/index.html');
            });

            it('should show no data', function () {
                expect(element(by.binding('ctrl.data')).getText()).toBe('data: [{"x":"y"}]');
            });

            it('should show no errors', function () {
                expect(element(by.binding('ctrl.error')).getText()).toBe('error:');
            });
            
            afterAll(function () {
                ngApimock.removeMockModule();
                ngApimock.resetScenarios();
            });
        });

        describe('when provided with some selected error scenarios', function () {

            beforeAll(function () {
                ngApimock.selectScenario(require('../mocks/some-api.json'), 'internal-server-error');
                ngApimock.addMockModule();

                browser.get('/index.html');
            });

            it('should show no data', function () {
                expect(element(by.binding('ctrl.data')).getText()).toBe('data:');
            });

            it('should show no errors', function () {
                expect(element(by.binding('ctrl.error')).getText()).toBe('error: 500');
            });

            afterAll(function () {
                ngApimock.removeMockModule();
                ngApimock.resetScenarios();
            });

        });
    })
})();