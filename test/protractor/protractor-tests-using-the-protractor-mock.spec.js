(function () {
    'use strict';
    
    describe('ngApimock - protractor.mock.js', function () {
        var ngApimock = require('../../.tmp/some-other-dir/protractor.mock.js');
        
        describe('when provided without any selected scenarios', function () {
            beforeAll(function () {
                ngApimock.addMockModule();
                browser.get('/index.html');
            });

            describe('when fetching data with a service', function() {
                it('should not show any data', function () {
                    expect(element(by.binding('ctrl.data')).getText()).toBe('data:');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.error')).getText()).toBe('error:');
                });
            });

            describe('when posting data with a service', function() {
                beforeAll(function() {
                    element(by.buttonText('post me')).click();
                });

                it('should not show any data', function () {
                    expect(element(by.binding('ctrl.postedData')).getText()).toBe('data:');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.postedError')).getText()).toBe('error:');
                });
            });

            afterAll(function () {
                ngApimock.removeMockModule();
                ngApimock.resetScenarios();
            });
        });

        describe('when provided with some selected scenarios', function () {
            beforeAll(function () {
                ngApimock.selectScenario(require('../mocks/some-api-get.json'), 'some-meaningful-scenario-name');
                ngApimock.selectScenario(require('../mocks/some-api-post.json'), 'successful');
                ngApimock.addMockModule();

                browser.get('/index.html');
            });

            describe('when fetching data with a service', function() {
                it('should show data', function () {
                    expect(element(by.binding('ctrl.data')).getText()).toBe('data: [{"x":"y"}]');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.error')).getText()).toBe('error:');
                });
            });

            describe('when posting data with a service', function() {
                beforeAll(function() {
                    element(by.buttonText('post me')).click();
                });

                it('should show data', function () {
                    browser.sleep(3000)
                    expect(element(by.binding('ctrl.postedData')).getText()).toBe('data: {"some":"thing"}');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.postedError')).getText()).toBe('error:');
                });
            });
            
            afterAll(function () {
                ngApimock.removeMockModule();
                ngApimock.resetScenarios();
            });
        });

        describe('when provided with some selected error scenarios', function () {

            beforeAll(function () {
                ngApimock.selectScenario(require('../mocks/some-api-get.json'), 'internal-server-error');
                ngApimock.selectScenario(require('../mocks/some-api-post.json'), 'internal-server-error');
                ngApimock.addMockModule();

                browser.get('/index.html');
            });

            describe('when fetching data with a service', function() {
                it('should not show any data', function () {
                    expect(element(by.binding('ctrl.data')).getText()).toBe('data:');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.error')).getText()).toBe('error: 500');
                });
            });

            describe('when posting data with a service', function() {
                beforeAll(function() {
                    element(by.buttonText('post me')).click();
                });

                it('should not show any data', function () {
                    expect(element(by.binding('ctrl.postedData')).getText()).toBe('data:');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.postedError')).getText()).toBe('error: 500');
                });
            });

            afterAll(function () {
                ngApimock.removeMockModule();
                ngApimock.resetScenarios();
            });

        });
    })
})();