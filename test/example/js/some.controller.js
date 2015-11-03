(function () {
    'use strict';

    function SomeController(api) {
       var vm = this;
        api.get({}, function(data) {
            vm.data = data;
        }, function(response){
            vm.error = response.status;
        });
    }

    SomeController.$inject = ['api'];

    angular
        .module('ngApimock-example')
        .controller('SomeController', SomeController);

})();