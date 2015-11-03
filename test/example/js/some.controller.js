(function () {
    'use strict';

    function SomeController(api, shadowLogger) {
        var vm = this;

        api.fetch({}, function (data) {
            vm.data = data;
        }, function (response) {
            vm.error = response.status;
        });

        vm.update = function () {
            api.update(
                {
                    data: {
                        some: 'thing'
                    }
                }, function (data) {
                    vm.postedData = data;
                }, function (response) {
                    vm.postedError = response.status;
                });
        };
        
        vm.logging = shadowLogger.read().info;

    }

    SomeController.$inject = ['api', 'shadowLogger'];

    angular
        .module('ngApimock-example')
        .controller('SomeController', SomeController);

})();