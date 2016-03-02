(function () {
    'use strict';
    var passThroughs = <%= passThroughs %>;
    var mocks = [].concat(passThroughs),
        variables = {},
        identifier = (Math.random().toString(16) + "000000000").substr(2, 8),
        addedMockModule = false;

    /**
     * The selectScenario function stores the relevant information from the given data that
     * matches the given scenario.
     * The information is stored in an array which is used to register api mocks with $httpBackend.
     *
     * #1 remove the previously selected scenario
     * #2 add the newly selected scenario
     * #3 push the change to the running protractor instance if the module has already been added.
     *
     * @param data The data object containing all the information for an expression.
     * @param scenario The scenario that is selected to be returned when the api is called.
     */
    function selectScenario(data, scenario) {
        var response = data.responses[scenario];
        // #1
        mocks.filter(function (mock) {
            return (mock['expression'] === data['expression']) && (mock['method'] === data['method']);
        }).forEach(function (match) {
            mocks.splice(mocks.indexOf(match), 1)
        });

        // #2
        var mock = {
            expression: data.expression,
            method: data.method,
            isArray: data.isArray || false,
            response: response
        };
        mocks.push(mock);

        // #3
        if (addedMockModule) {
            return browser.executeScript('window.sessionStorage.setItem(\''+identifier + mock['expression'] +'$$'+mock['method'] +'\',  arguments[0]);', JSON.stringify(mock)).then(function() {
                console.log('Switched scenario to: ' + scenario + ' for expression: ' + mock['expression'] + ' with method: ' + mock['method']);
            });
        }
    }

    /** The resetScenarios function resets the selected mocks. */
    function resetScenarios() {
        mocks = [].concat(passThroughs);
    }

    /**
     * The setGlobalVariable function stores the global key/value pair so it is accessible for when the response
     * will returned.
     * @param key The key.
     * @param value The value.
     */
    function setGlobalVariable(key, value) {
        variables[key] = value;

        if (addedMockModule) {
            return browser.executeScript('window.sessionStorage.setItem(\''+identifier +'$$variables' +'\',  arguments[0]);', JSON.stringify(variables)).then(function() {
                console.log('Updated global variables');
            });
        }
    }

    /**
     * The deleteGlobalVariable function removes the global key/value pair.
     * @param key The key.
     */
    function deleteGlobalVariable(key) {
        delete variables[key];

        if (addedMockModule) {
            return browser.executeScript('window.sessionStorage.setItem(\''+identifier +'$$variables' +'\',  arguments[0]);', JSON.stringify(variables)).then(function() {
                console.log('Updated global variables');
            });
        }
    }

    /** The resetGlobalVariables function resets the provided variables to {}. */
    function resetGlobalVariables() {
        variables = {};
    }

    /**
     * The addMockModule function creates an angular mock module with all the selected scenario's with $httpBackend.
     * This module is then added as a protractor mock module to your application.
     */
    function addMockModule() {
        var ProtractorMock = function () {
            /**
             * Find the expression that matches.
             * @param mocks The mocks.
             * @param requestType The request type.
             * @param expression The expression.
             * @returns {*}
             */
            function findMatchingExpression(mocks, requestType, expression) {
                for (var key in mocks) {
                    if (mocks.hasOwnProperty(key)) {
                        var mock = mocks[key],
                            mockExpression = mock.expression;
                        if (mock['method'] === requestType && new RegExp(mockExpression).test(expression)) {
                            return mock;
                        }
                    }
                }
                return expression;
            }

            /**
             * The actual mocks.
             * @param $httpBackend The injected $httpBackend.
             * @param mockData The mock data.
             */
            function Mock($httpBackend, mockData, $window) {
                /**
                 * Find the expression that matches.
                 * @param mocks The mocks.
                 * @param requestType The request type.
                 * @param expression The expression.
                 * @returns {*}
                 */
                function findMatchingExpression(mocks, requestType, expression) {
                    for (var key in mocks) {
                        if (mocks.hasOwnProperty(key)) {
                            var mock = mocks[key],
                                mockExpression = mock.expression;
                            if (mock['method'] === requestType && new RegExp(mockExpression).test(expression)) {
                                return mock;
                            }
                        }
                    }
                    return expression;
                }

                /**
                 * Delay the response for the given amount of milliseconds.
                 * @param ms The number of milliseconds.
                 */
                function delay(ms) {
                    var curr = new Date().getTime();
                    ms += curr;
                    while (curr   < ms) {
                        curr = new Date().getTime();
                    }
                }

                /**
                 * Update the response data with the globally available variables.
                 * @param data The data.
                 * @return updatedData The updated data.
                 */
                function updateData(data){
                    var json = JSON.stringify(data);
                    Object.keys(mockData.variables).forEach(function(key) {
                        if(mockData.variables.hasOwnProperty(key)) {
                            json = json.replace(new RegExp("%%" + key + "%%", "g"), mockData.variables[key]);
                        }
                    });
                    return JSON.parse(json);
                }

                mockData.mocks.forEach(function (mock) {
                    var response = mock.response;

                    if (angular.isUndefined(response.status) && angular.isUndefined(response.data)) {
                        $httpBackend.when(mock['method'], new RegExp(mock['expression'])).passThrough();
                    } else {
                        $httpBackend.when(mock['method'], new RegExp(mock['expression'])).respond(
                            function (requestType, expression) {
                                delay(<%= sessionStorageDelay %>); // makes sure the session storage is up-to-date.

                                var matchingMock = findMatchingExpression(mockData.mocks, requestType, expression),
                                    storedMock = $window.sessionStorage.getItem(mockData.identifier + matchingMock.expression + '$$' + requestType),
                                    storedVariables = $window.sessionStorage.getItem(mockData.identifier + '$$variables');

                                if(storedMock !== null) {
                                    var storedMockJson = JSON.parse(storedMock);
                                    response = storedMockJson.response;

                                    $window.sessionStorage.removeItem(mockData.identifier + matchingMock.expression + '$$' + requestType);
                                    matchingMock.response = response;
                                }

                                delay(<%= sessionStorageDelay %>); // makes sure the session storage is up-to-date.
                                if(storedVariables !== null) {
                                    mockData.variables = JSON.parse(storedVariables);
                                    $window.sessionStorage.removeItem(mockData.identifier + '$$variables');
                                }
                                var statusCode = matchingMock.response.status ||  200, // fallback to 200
                                    data = matchingMock.response.data ? updateData(matchingMock.response.data) : (matchingMock.isArray ? [] : {}),
                                    headers = matchingMock.response.headers || {}, // fallback to {}
                                    statusText = matchingMock.response.statusText || undefined;
                                return [statusCode, data, headers, statusText];
                            }
                        );
                    }
                });
            }

            Mock.$inject = ['$httpBackend', 'mockData', '$window'];
            angular.module('ngApimock', ['ngMockE2E']);
            angular.module('ngApimock').value('mockData', arguments[0]);
            angular.module('ngApimock').run(Mock);
        };
        browser.addMockModule('ngApimock', ProtractorMock, {'mocks': mocks, 'identifier': identifier, 'variables': variables});
        addedMockModule = true;
    }

    /** The removeMockModule function removes the angular mock module. */
    function removeMockModule() {
        browser.removeMockModule('ngApimock');
        addedMockModule = false;
    }

    /** This Protractor mock allows you to specify which scenario from your json api files you would like to use for your tests. */
    module.exports = {
        selectScenario: selectScenario,
        addMockModule: addMockModule,
        removeMockModule: removeMockModule,
        resetScenarios: resetScenarios,
        setGlobalVariable: setGlobalVariable,
        resetGlobalVariables: resetGlobalVariables,
        deleteGlobalVariable: deleteGlobalVariable
    }
})();
