(function () {
    'use strict';

    function MockRegistry() {
        var mocks = <%= mocks %>;

        function Registry() {
            this.mocks = function () {
                return mocks;
            }
        }

        this.$get = function () {
            return new Registry();
        };
    }

    /**
     * @ngdoc service
     * @name ng-apimock.ngApimockRegistry
     * @description
     * # Registry provider for mocks.
     * Service in the ng-apimock
     */
    angular
        .module('ng-apimock')
        .provider('ngApimockRegistry', MockRegistry);
})();