(function () {
    'use strict';
    var MockingPO = require('./po/mocking.po');
    
    describe('ngApimock - ng-apimock.js', function () {
        var mocking;
        
        describe('when provided without any selected scenarios', function () {
            beforeAll(function () {
                browser.get('/index.html');
            });

            it('should not show any data', function () {
                expect(element(by.binding('ctrl.data')).getText()).toBe('data:');
            });

            it('should not show any errors', function () {
                expect(element(by.binding('ctrl.error')).getText()).toBe('error:');
            });
        });

        describe('when provided with some selected scenarios', function () {
            beforeAll(function () {
                browser.get('/mocking');
                mocking = new MockingPO();
                mocking.api.sendKeys('some-meaningful-scenario-name');
                browser.get('/index.html');
            });

            it('should show no data', function () {
                expect(element(by.binding('ctrl.data')).getText()).toBe('data: [{"x":"y"}]');
            });

            it('should show no errors', function () {
                expect(element(by.binding('ctrl.error')).getText()).toBe('error:');
            });
            
            afterAll(function () {
                browser.get('/mocking');
                mocking.clear();
            });
        });

        describe('when provided with some selected error scenarios', function () {

            beforeAll(function () {
                browser.get('/mocking');
                mocking = new MockingPO();
                mocking.api.sendKeys('internal-server-error');
                browser.get('/index.html');
            });

            it('should show no data', function () {
                expect(element(by.binding('ctrl.data')).getText()).toBe('data:');
            });

            it('should show no errors', function () {
                expect(element(by.binding('ctrl.error')).getText()).toBe('error: 500');
            });

            afterAll(function () {
                browser.get('/mocking');
                mocking.clear();
            });
        });
    })
})();