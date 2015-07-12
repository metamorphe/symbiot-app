/* Map */
var mapModule = angular.module('mapModule', []);
mapModule.controller('mapController', ['$scope', function($scope) {
    $scope.imgUrl = '../img/wall_formation.JPG';

    $scope.pointMenu= {
        content: 'Lorem Ipsum',
        templateUrl: '../views/_pointMenu.html',
        title: 'Actuator Options'
    };

    $scope.points = [
        {x: 50, y: 50, address: 1},
        {x: 100, y: 200, address: 2}
    ];

    $scope.currAddress = 3;

    $scope.progMode = 'Playground';

    $scope.actuate = function(point) {
        console.log(point);
    };

    $scope.addPoint = function() {
        var _x = event.offsetX;
        var _y = event.offsetY;
        $scope.points.push({x: _x, y: _y, address: $scope.currAddress++});
    };

    $scope.deletePoint = function(point) {
        $scope.points.splice($scope.points.indexOf(point), 1);
    };

}]);

mapModule.directive('ngRightClick', function ($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event : event});
            });
        });
    };
});

mapModule.directive('point', function() {
    return {
        restrict: 'E',
        replace: true,
        link: function(scope, element, attrs) {
            element.css({
                transform: 'translate(' + attrs.x + 'px, ' + attrs.y + 'px)',
            });
        },
        templateUrl: '../views/_point.html',
    };
});

mapModule.directive('pointMenu', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../views/_pointMenu.html'
    }
});

//TODO: functionality for node labels

var symbiotApp = angular.module('symbiotApp', ['mapModule', 'ui.bootstrap']);
