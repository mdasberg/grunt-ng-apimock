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
     * #2 iterate over each mock and register it with $httpBackend
     * 
     * @param $httpBackend The httpBackend service.
     */
    function Mock($httpBackend) {
        var mocks = JSON.parse(localStorage.getItem('mocks')) || {};

        for (var key in mocks) {
            if (mocks.hasOwnProperty(key)) {
                var mock = mocks[key];
                var response = mock['response'],
                    statusCode = response.status ? response.status : 200,
                    data = response.data,
                    headers = response.headers ? response.headers : {},
                    statusText = response.statusText ? response.statusText : undefined;

                if(angular.isUndefined(response.status) && angular.isUndefined(response.data)){
                    $httpBackend.when(mock['method'], new RegExp(mock['expression'])).passThrough();
                } else {
                    $httpBackend.when(mock['method'], new RegExp(mock['expression'])).respond(statusCode, data, headers, statusText);
                }
            }
        }
    }

    Mock.$inject = ['$httpBackend'];
    
    angular.module('mock', ['ngMockE2E']);
    angular.module('mock').run(Mock);
    angular.module('<%= moduleName %>').requires.push('mock');

})();