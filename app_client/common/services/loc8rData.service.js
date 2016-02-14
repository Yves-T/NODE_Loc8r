(function () {

    var loc8rData = function ($http) {
        var locationByCoords = function (lat, lng) {
            return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=30');
        };

        var locationById = function (locationid) {
            return $http.get('/api/locations/' + locationid);
        };

        var addReviewById = function (locationid, data) {
            return $http.post('/api/locations/' + locationid + '/reviews', data);
        };

        return {
            locationByCoords: locationByCoords,
            locationById : locationById,
            addReviewById : addReviewById
        }
    };

    loc8rData.$inject = ['$http'];

    angular
        .module('loc8rApp')
        .service('loc8rData', loc8rData);

})();
