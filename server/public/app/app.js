/* Map */
var mapModule = angular.module('mapModule', []);
mapModule.controller('mapController', ['$scope', function($scope) {
    $scope.imgUrl = '../img/wall_formation.JPG';
}]);

mapModule.directive('map', function() {
    return {};
});

/* Node */
var nodeModule = angular.module('nodeModule', []);
nodeModule.controller('nodeController', ['$scope', function() {
    //todo
}]);

nodeModule.directive('node', function() {
    return {};
});

var symbiotApp = angular.module('symbiotApp', ['mapModule', 'nodeModule']);
