(function () {
    'use strict';

    function MockStorage(registry) {
        /**
         * Initialize the mock storage by iterating over each mock that is not available in the local storage.
         * #1 get all the mocks
         * #2 iterate only over mocks that are not stored in local storage
         * #3 add the non stored mocks and select passThrough as default
         * #4 add the update stored mocks to local storage.
         */
        function initialize() {
            //console.log('init');
            // #1
            var mocks = registry.mocks(),
                storedMocks = JSON.parse(localStorage.getItem('ngApimockMocks')) || {};
            // #2
            mocks.filter(function (mock) {
                return !storedMocks[mock.expression + '$$' + mock.method];
            }).forEach(function (mock) {
                var response = mock.responses.passThrough;
                response.name = 'passThrough';

                var stored = {
                    expression: mock.expression,
                    method: mock.method,
                    echo: mock.echo || false,
                    isArray: mock.isArray || false,
                    response: response
                };

                // #3
                storedMocks[mock.expression + '$$' + mock.method] = stored;
            });
            // #4
            localStorage.setItem('ngApimockMocks', JSON.stringify(storedMocks));
        }

        /**
         * Gets the mocks from the registry.
         * Note: not the stored mocks.
         * @returns {*} mocks The mocks.
         */
        function mocks() {
            return registry.mocks();
        }

        /**
         * Gets the stored mocks.
         * @returns {*} mocks The stored mocks.
         */
        function storedMocks() {
            return JSON.parse(localStorage.getItem('ngApimockMocks'));
        }

        /**
         * Update the currently stored mock with the selected response.
         * @param mock The mock.
         * @param selection The selection.
         */
        function select(mock, selection) {
            var mocks = storedMocks(), // get current storage,
                storedMock = mocks[mock.expression + '$$' + mock.method],
                response = mock.responses[selection];

            if (response !== undefined) {
                response.name = selection; // set the name so we can selected it later on.
                mocks[mock.expression + '$$' + mock.method] = {
                    expression: storedMock.expression,
                    method: storedMock.method,
                    echo: storedMock.echo,
                    isArray: storedMock.isArray,
                    response: response
                };
            } else {
                delete mocks[mock.expression + '$$' + mock.method];
            }
            localStorage.setItem('ngApimockMocks', JSON.stringify(mocks)); // store it again.
        }

        /**
         * Update the currently stored mock with the selected echo indicator.
         * @param mock The mock.
         * @param echo The echo.
         */
        function echo(mock, echo) {
            var mocks = storedMocks(),
                storedMock = mocks[mock.expression + '$$' + mock.method];

            mocks[mock.expression + '$$' + mock.method] = {
                expression: storedMock.expression,
                method: storedMock.method,
                echo: echo || false,
                isArray: storedMock.isArray,
                response: storedMock.response
            };

            localStorage.setItem('ngApimockMocks', JSON.stringify(mocks)); // store it again.
        }

        /**
         * Gets the selected response for the given mock.
         * @param mock The mock.
         * @returns {string} selected The selected response.
         */
        function selected(mock) {
            var stored = storedMocks()[mock.expression + '$$' + mock.method];
            return (stored ? stored.response.name : undefined);
        }

        /**
         * Gets the selected response for the given mock.
         * @param mock The mock.
         * @returns {string} selected The selected response.
         */
        function echoed(mock) {
            var stored = storedMocks()[mock.expression + '$$' + mock.method];
            return (stored ? stored.echo : false);
        }

        /**
         * Clear the currently stored mocks.
         */
        function clear() {
            localStorage.removeItem('ngApimockMocks');
            initialize();
        }

        /**
         * Gets the global variables.
         * @returns variables The variables.
         */
        function variables() {
            var variables = JSON.parse(localStorage.getItem('ngApimockVariables')) || {};
            return variables;
        }

        /**
         * Adds or updates the given variable to the already available variables.
         * In case the key is already present, the current value will be overridden with the new one.
         * @param variable The variable to add (or update).
         */
        function addOrUpdateVariable(variable) {
            var variables = this.variables();
            variables[variable.key] = variable.value;
            localStorage.setItem('ngApimockVariables', JSON.stringify(variables)); // store it again
        }

        /**
         * Deletes the variable matching the given key from the list of available variables.
         * @param key The key.
         */
        function deleteVariable(key) {
            var variables = this.variables();
            delete variables[key];
            localStorage.setItem('ngApimockVariables', JSON.stringify(variables)); // store it again
        }

        return {
            initialize: initialize,
            mocks: mocks,
            select: select,
            echo: echo,
            selected: selected,
            echoed: echoed,
            clear: clear,
            variables: variables,
            addOrUpdateVariable: addOrUpdateVariable,
            deleteVariable: deleteVariable
        }
    }

    MockStorage.$inject = ['ngApimockRegistry'];

    /**
     * @ngdoc service
     * @name ng-apimock.ngApimockStorage
     * @description
     * # Storage service for mocks.
     * Service in the ng-apimock
     */
    angular
        .module('ng-apimock')
        .factory('ngApimockStorage', MockStorage);

})();