(function() {
    'use strict';

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
     * The web interface (@see https://github.com/mdasberg/grunt-ng-apimock#howto-serve-selected-mocks)
     * allows the user to select a scenario for an api.
     *
     * This mock module uses the selections and uses $httpbackend (@see https://docs.angularjs.org/api/ngMockE2E/service/$httpBackend)
     * to serve the selected scenario responsesfor the api's.
     *
     * #1 load the mocks from storage
     * #2 add all the passThrough defaults
     * #3 iterate over each mock
     * #4 register the expression with $httpBackend (override the passThrough if present)
     *
     * @param $httpBackend The httpBackend service.
     */
    function Mock($httpBackend, $log) {
        var passThroughs = <%= passThroughs %>;
        // #1
        var mocks = JSON.parse(localStorage.getItem('mocks')) || {};

        // #2
        passThroughs.forEach(function (passThrough) {
            $httpBackend.when(passThrough['method'], new RegExp(passThrough['expression'])).passThrough();
        });

        // #3
        for (var key in mocks) {
            if (mocks.hasOwnProperty(key)) {
                var mock = mocks[key];
                var response = mock['response'];
                // #4
                if (angular.isUndefined(response.status) && angular.isUndefined(response.data)) {
                    $httpBackend.when(mock['method'], new RegExp(mock['expression'])).passThrough();
                } else {
                    $httpBackend.when(mock['method'], new RegExp(mock['expression'])).respond(
                        function (requestType, expression, requestData, requestHeaders) {
                            var matchingMock = findMatchingExpression(JSON.parse(localStorage.getItem('mocks')) || {}, requestType, expression);
                            if (matchingMock.echo) {
                                $log.info(requestType + ' request made on \'' + matchingMock['expression'] + '\' with payload: ', requestData);
                            }
                            var response = matchingMock.response;
                            return [response.status || 200, response.data || (matchingMock.isArray ? [] : {}), response.headers || {}, response.statusText || undefined];
                        }
                    );
                }
            }
        }
    }

    Mock.$inject = ['$httpBackend', '$log'];

    angular.module('mock', ['ngMockE2E']);
    angular.module('mock').run(Mock);
    angular.module('<%= moduleName %>').requires.push('mock');
})();