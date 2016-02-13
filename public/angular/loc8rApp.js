angular.module('loc8rApp', []);

var locationsCtrl = function (loc8rData, geolocation) {
    this.message = "Checking your locaiton";

    this.getData = function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        this.message = "Searching for nearby places";

        loc8rData.locationByCoords(lat, lng).success(function (data) {
            this.message = data.length > 0 ? "" : "No locations found";
            this.data = {locations: data};
        }.bind(this)).error(function (e) {
            this.message = "Sorry, something's gone wrong";
        }.bind(this));
    }.bind(this);

    this.showError = function (error) {
        this.$apply(function () {
            this.message = error.message;
        }.bind(this));
    };

    this.noGeo = function () {
        this.$apply(function () {
            this.message = "Geolocation not supported by this browser.";
        }.bind(this));
    };

    geolocation.getPosition(this.getData, this.showError, this.noGeo);
};

var _formatDistance = function () {

    return function (distance) {
        var numDistance, unit;
        if (distance && _isNumeric(distance)) {

            if (distance > 1000) {
                numDistance = parseFloat(distance / 1000).toFixed(1);
                unit = ' km';
            } else {
                numDistance = parseInt(distance, 10);
                unit = ' m';
            }
            return numDistance + unit;
        } else {
            return "?";
        }
    };
};

var ratingStars = function () {
    return {
        scope: {
            thisRating: '=rating'
        },
        templateUrl: '/angular/rating-stars.html'
    }
};

var loc8rData = function ($http) {
    var locationByCoords = function (lat, lng) {
        return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=30');
    };

    return {
        locationByCoords: locationByCoords
    }
};

var _isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var geolocation = function () {
    var getPosition = function (cbSuccess, cbError, cbNoGeo) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
        } else {
            cbNoGeo();
        }
    };
    return {
        getPosition: getPosition
    };
};

angular.module('loc8rApp')
    .controller('locationListCtrl', locationsCtrl)
    .filter('formatDistance', _formatDistance)
    .directive('ratingStars', ratingStars)
    .service('loc8rData', loc8rData)
    .service('geolocation', geolocation);
