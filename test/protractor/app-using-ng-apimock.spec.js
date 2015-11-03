(function () {
    'use strict';
    var MockingPO = require('./po/mocking.po');
    
    describe('ngApimock - ng-apimock.js', function () {
        var mocking;
        
        describe('when provided without any selected scenarios', function () {
            beforeAll(function () {
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
            
        });

        describe('when provided with some selected scenarios', function () {
            beforeAll(function () {
                browser.get('/mocking');
                mocking = new MockingPO();
                mocking.apiGET.sendKeys('some-meaningful-scenario-name');
                mocking.apiPOST.sendKeys('successful');
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
                    expect(element(by.binding('ctrl.postedData')).getText()).toBe('data: {"some":"thing"}');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.postedError')).getText()).toBe('error:');
                });
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
                mocking.apiGET.sendKeys('internal-server-error');
                mocking.apiPOST.sendKeys('internal-server-error');
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
                browser.get('/mocking');
                mocking.clear();
            });
        });
    })
})();