(function() {
    'use strict';

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
    //
    angular.module('mock', ['ngMockE2E']);
    angular.module('mock').run(Mock);
    angular.module('<%= moduleName %>').requires.push('mock');

})();