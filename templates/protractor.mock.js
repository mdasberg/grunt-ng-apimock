(function () {
    'use strict';

    var ngapimockid = require('node-uuid').v4(),
        request = require('sync-request'),
        baseUrl = require('url-join')(browser.baseUrl, 'ngapimock');

    var ProtractorMock = function () {
        function NgApimockHeader($http, ngApimockInstance) {
            $http.defaults.headers.common['ngapimockid'] = ngApimockInstance.ngapimockid;
        }

        NgApimockHeader.$inject = ['$http', 'ngApimockInstance'];

        angular.module('ngApimock', []);
        angular.module('ngApimock').constant('ngApimockInstance', arguments[0]);
        angular.module('ngApimock').run(NgApimockHeader)
    };

    browser.addMockModule('ngApimock', ProtractorMock, {'ngapimockid': ngapimockid});

    /**
     * The selectScenario function stores the relevant information from the given data that
     * matches the given scenario.
     *
     * #1 determine identifier
     * #2 call api
     *
     * @param {Object | String} data The data object containing all the information for an expression or the name of the mock.
     * @param scenario The scenario that is selected to be returned when the api is called.
     */
    function selectScenario(data, scenario) {
        var deferred = protractor.promise.defer();
        
        // #1
        var identifier;
        if (typeof data === 'string') { // name of the mock
            identifier = data;
        } else if (data.name) { // the data containing the name of the mock
            identifier = data.name;
        } else { 
            identifier = data.expression + '$$' + data.method;
        }
        // #2
        var response = request('PUT', baseUrl + '/mocks', {
            headers: {
                'Content-Type': 'application/json',
                'ngapimockid': ngapimockid
            },
            json: {
                identifier: identifier,
                scenario: scenario
            }
        });

        if (response.statusCode !== 200) {
            deferred.reject('Could not select scenario [' + scenario + ']');
        } else {
            deferred.fulfill();
        }
        return deferred.promise;
    }

    /** The setAllScenariosToDefault function sets all the scenarios to default. */
    function setAllScenariosToDefault() {
        var deferred = protractor.promise.defer();
        var response = request('PUT', baseUrl + '/mocks/defaults', {
            headers: {
                'Content-Type': 'application/json',
                'ngapimockid': ngapimockid
            }
        });

        if (response.statusCode !== 200) {
            deferred.reject('Could not set scenarios to default');
        } else {
            deferred.fulfill();
        }
        return deferred.promise;
    }

    /** The setAllScenariosToPassThrough function sets all the scenarios to passthrough. */
    function setAllScenariosToPassThrough() {
        var deferred = protractor.promise.defer();
        var response = request('PUT', baseUrl + '/mocks/passthroughs', {
            headers: {
                'Content-Type': 'application/json',
                'ngapimockid': ngapimockid
            }
        });

        if (response.statusCode !== 200) {
            deferred.reject('Could not set scenarios to passthroughs');
        } else {
            deferred.fulfill();
        }
        return deferred.promise;
    }

    /** The resetScenarios function resets the selected mocks. */
    function resetScenarios() {
        console.log('resetScenarios is no longer supported as of version 1.0.2, and will be removed in future versions.' +
            ' Use setAllScenariosToDefault or setAllScenariosToPassThrough');
    }

    /**
     * The setGlobalVariable function stores the global key/value pair so it is accessible for when the response
     * will returned.
     * @param key The key.
     * @param value The value.
     */
    function setGlobalVariable(key, value) {
       var deferred = protractor.promise.defer();
        var response = request('PUT', baseUrl + '/variables', {
            headers: {
                'Content-Type': 'application/json',
                'ngapimockid': ngapimockid
            },
            json: {
                key: key,
                value: value
            }
        });

        if (response.statusCode !== 200) {
            deferred.reject('Could not add or update variable key [' + key + ' with value [' + value + ']');
        } else {
            deferred.fulfill();
        }
        return deferred.promise;
    }

    /**
     * The deleteGlobalVariable function removes the global key/value pair.
     * @param key The key.
     */
    function deleteGlobalVariable(key) {
       var deferred = protractor.promise.defer();
        var response = request('DELETE', baseUrl + '/variables/' + key, {
            headers: {
                'Content-Type': 'application/json',
                'ngapimockid': ngapimockid
            }
        });

        if (response.statusCode !== 200) {
            deferred.reject('Could not delete variable with key [' + key + ']');
        } else {
            deferred.fulfill();
        }
        return deferred.promise;
    }

    /** The resetGlobalVariables function resets the provided variables to {}. */
    function resetGlobalVariables() {
        console.log('resetGlobalVariables is no longer supported as of version 1.0.0, and will be removed in future versions');
    }

    /**
     * The addMockModule function creates an angular mock module with all the selected scenario's with $httpBackend.
     * This module is then added as a protractor mock module to your application.
     */
    function addMockModule() {
        console.log('addMockModule is no longer supported as of version 1.0.0, and will be removed in future versions');
    }

    /** The removeMockModule function removes the angular mock module. */
    function removeMockModule() {
        console.log('removeMockModule is no longer supported as of version 1.0.0, and will be removed in future versions');
    }

    /** This Protractor mock allows you to specify which scenario from your json api files you would like to use for your tests. */
    module.exports = {
        selectScenario: selectScenario,
        addMockModule: addMockModule,
        removeMockModule: removeMockModule,
        setAllScenariosToDefault: setAllScenariosToDefault,
        setAllScenariosToPassThrough: setAllScenariosToPassThrough,
        resetScenarios: resetScenarios,
        setGlobalVariable: setGlobalVariable,
        resetGlobalVariables: resetGlobalVariables,
        deleteGlobalVariable: deleteGlobalVariable
    }
})();
