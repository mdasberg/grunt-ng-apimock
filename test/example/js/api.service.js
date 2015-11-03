(function () {
    'use strict';

    function Api($resource) {
        return $resource('/online/rest/some/api', {}, {
            get: {
                method: 'GET',
                isArray: true
            }
        });
    }

    Api.$inject = ['$resource'];

    angular
        .module('ngApimock-example')
        .service('api', Api);

})();