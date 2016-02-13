var formatDistance = function () {

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

var _isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

angular
    .module('loc8rApp')
    .filter('formatDistance', formatDistance);