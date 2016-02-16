(function () {
    'use strict';

    function MockingController(service, $window) {
        var vm = this;

        service.initialize();

        vm.mocks = service.mocks();
        vm.variables = service.variables();
        vm.variable = {
            key: undefined,
            value: undefined
        };

        /**
         * Gets the selected mock response.
         * @param mock The mock
         * @returns {string} response The selected response.
         */
        vm.selectedMock = function (mock) {
            return service.selected(mock);
        };

        /**
         * Gets the echo indicator.
         * @param mock The mock.
         * @returns {boolean} Indicator echo.
         */
        vm.isMockEchoed = function(mock) {
            return service.echoed(mock);
        };

        /**
         * Update the given Echo indicator.
         * @param mock The mock.
         * @param echo The echo.
         */
        vm.echoMock = function (mock, echo) {
            service.echo(mock, echo);
        };

        /**
         * Select the given response.
         * @param mock The mock.
         * @param selection The selection.
         */
        vm.selectMock = function (mock, selection) {
            service.select(mock, selection);
        };

        /** Clear all selections. */
        vm.clearMocks = function () {
            service.clear();
            $window.location.reload();
        };

        /** Adds the given variable. */
        vm.addVariable = function() {
            service.addOrUpdateVariable(vm.variable);
            vm.variable = {
                key: undefined,
                value: undefined
            };
            vm.variables = service.variables();
        };

        /**
         * Update the given variable.
         * @param key The key.
         * @param value The value.
         */
        vm.updateVariable = function(key, value) {
            service.addOrUpdateVariable({key: key, value: value});
        };

        /**
         * Delete the variable matching the given key.
         * @param key The key.
         */
        vm.deleteVariable = function(key) {
            service.deleteVariable(key);
            vm.variables = service.variables();
        };
    }

    MockingController.$inject = ['ngApimockStorage', '$window'];

    /**
     * @ngdoc controller
     * @name ng-apimock.ngApimockController
     * @description
     * # Controller for selecting mocks.
     * Controller in the ng-apimock
     */
    angular
        .module('ng-apimock')
        .controller('NgApimockController', MockingController);
})();