(function () {
    'use strict';
    var passThroughs = <%= passThroughs %>;
    var mocks = [].concat(passThroughs);

    /**
     * The selectScenario function stores the relevant information from the given data that
     * matches the given scenario.
     * The information is stored in an array which is used to register api mocks with $httpBackend.
     *
     * #1 remove the previously selected scenario
     * #2 add the newly selected scenario
     *
     * @param data The data object containing all the information for an expression.
     * @param scenario The scenario that is selected to be returned when the api is called.
     */
    function selectScenario(data, scenario) {
        var response = data.responses[scenario];
        // #1
        mocks.filter(function(mock) {
            return (mock['expression'] === data['expression']) && (mock['method'] === data['method']);
        }).forEach(function(match) {
            mocks.splice(mocks.indexOf(match), 1)
        });

        // #2
        mocks.push({
            expression: data.expression,
            method: data.method,
            response: response
        });
    }

    /** The resetScenarios function resets the selected mocks. */
    function resetScenarios() {
        mocks = [].concat(passThroughs);
    }

    /**
     * The addMockModule function creates an angular mock module with all the selected scenario's with $httpBackend.
     * This module is then added as a protractor mock module to your application.
     */
    function addMockModule() {
        var ProtractorMock = function () {
            /**
             * The actual mocks.
             * @param $httpBackend The injected $httpBackend.
             * @param mockData The mock data.
             */
            function Mock($httpBackend, mockData) {
                for (var i = 0; i < mockData.mocks.length; i++) {
                    var mock = mockData.mocks[i],
                        response = mock.response,
                        statusCode = response.status ||  200, // fallback to 200
                        data = response.data || {},
                        headers = response.headers || {}, // fallback to {}
                        statusText = response.statusText || undefined;

                    if (angular.isUndefined(response.status) && angular.isUndefined(response.data)) {
                        $httpBackend.when(mock['method'], new RegExp(mock['expression'])).passThrough();
                    } else {
                        $httpBackend.when(mock['method'], new RegExp(mock['expression'])).respond(statusCode, data, headers, statusText);
                    }
                }
            }

            Mock.$inject = ['$httpBackend', 'mockData'];

            angular.module('ngApimock', ['ngMockE2E']);
            angular.module('ngApimock').value('mockData', arguments[0])
            angular.module('ngApimock').run(Mock);
        };
        browser.addMockModule('ngApimock', ProtractorMock, {'mocks': mocks});
    }

    /** The removeMockModule function removes the angular mock module. */
    function removeMockModule() {
        browser.removeMockModule('ngApimock');
    }

    /** This Protractor mock allows you to specify which scenario from your json api files you would like to use for your tests. */
    module.exports = {
        selectScenario: selectScenario,
        addMockModule: addMockModule,
        removeMockModule: removeMockModule,
        resetScenarios: resetScenarios
    }
})();
