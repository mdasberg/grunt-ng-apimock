(function () {
    'use strict';

    function SomeController(api, shadowLogger, $window) {
        var vm = this;

        var fetch = function() {
            api.fetch({}, function (data) {
                vm.data = data;
            }, function (response) {
                vm.error = response.status;
            });
        };

        fetch();

        vm.update = function () {
            api.update(
                {
                    data: {
                        some: 'thing'
                    }
                }, function (data) {
                    vm.postedData = data;
                    vm.postedError = undefined;
                }, function (response) {
                    vm.postedData = undefined;
                    vm.postedError = response.status;
                });
        };
        
        vm.logging = shadowLogger.read().info;

        vm.refresh = function() {
            fetch();
        }

    }

    SomeController.$inject = ['api', 'shadowLogger', '$window'];

    angular
        .module('ngApimock-example')
        .controller('SomeController', SomeController);

})();