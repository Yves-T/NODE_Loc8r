function homeCtrl($scope) {
    var vm = this;
    vm.pageHeader = {
        title: 'Loc8r',
        strapline: 'Find places to work with wifi near you!'
    };
    vm.sidebar = {
        content: "Looking for wifi and a seat etc etc"
    };
}

angular.module('loc8rApp')
    .controller('homeCtrl', homeCtrl);
