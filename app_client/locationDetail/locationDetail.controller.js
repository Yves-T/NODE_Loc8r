(function () {
    angular
        .module('loc8rApp')
        .controller('locationDetailCtrl', locationDetailCtrl);
    locationDetailCtrl.$inject = ['$routeParams'];
    function locationDetailCtrl($routeParams) {
        var vm = this;
        vm.locationid = $routeParams.locationid;
        vm.pageHeader = {
            title: 'Location detail page'
        };
    }
})();
