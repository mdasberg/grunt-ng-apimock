(function() {
    'use strict';

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
    function Mock($httpBackend) {
        var passThroughs = [{"expression":"partials/.*","method":"GET"},{"expression":"non-existing-custom-json/.*"}];
        // #1
        var mocks = JSON.parse(localStorage.getItem('mocks')) || {};

        // #2
        passThroughs.forEach(function(passThrough) {
            $httpBackend.when(passThrough['method'], new RegExp(passThrough['expression'])).passThrough();
        });

        // #3
        for (var key in mocks) {
            if (mocks.hasOwnProperty(key)) {
                var mock = mocks[key];
                var response = mock['response'];
                // #4
                if(mock.echo) {
                    $httpBackend.when(mock['method'], new RegExp(mock['expression'])).respond(
                        function (requestType, expression, requestData, requestHeaders) {
                            console.log(requestType + ' request made on \'' + expression + '\' with payload: ', requestData);
                            var response = mocks[expression + '$$' + requestType].response;
                            return [response.status || 200, response.data || {}, response.headers || {}, response.statusText || undefined];
                        }
                    )
                } else if(angular.isUndefined(response.status) && angular.isUndefined(response.data)){
                    $httpBackend.when(mock['method'], new RegExp(mock['expression'])).passThrough();
                } else {
                    $httpBackend.when(mock['method'], new RegExp(mock['expression'])).respond(response.status || 200, response.data || {}, response.headers || {}, response.statusText || undefined);
                }
            }
        }
    }

    Mock.$inject = ['$httpBackend'];

    angular.module('mock', ['ngMockE2E']);
    angular.module('mock').run(Mock);
    angular.module('x').requires.push('mock');
})();