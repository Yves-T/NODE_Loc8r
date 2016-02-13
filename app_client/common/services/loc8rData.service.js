var loc8rData = function ($http) {
    var locationByCoords = function (lat, lng) {
        return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=30');
    };

    return {
        locationByCoords: locationByCoords
    }
};

angular
    .module('loc8rApp')
    .service('loc8rData', loc8rData);
