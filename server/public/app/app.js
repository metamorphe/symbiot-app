/* Map */
var mapModule = angular.module('mapModule', []);

mapModule.controller('mapController', ['$scope', 'nodeService',
                        function($scope, nodeService) {
    $scope.imgUrl = '../img/wall_formation.JPG';

    $scope.pointMenu= {
        content: 'Lorem Ipsum',
        templateUrl: '../views/_pointMenu.html',
        title: 'Actuator Options'
    };

    // $scope.points = nodeService.getNodes();
    $scope.points = {};
    nodeService.getNodes(function(data) {
        angular.forEach(data, function (value, key, object) {
            $scope.points[$scope.currI] = object;
        });
        // $scope.points = data;
    });

    $scope.currId = 0;

    $scope.progMode = 'Playground';

    $scope.actuate = function(point) {
        console.log(point);
        nodeService.setBrightness(point.address, 100);
    };

    $scope.addPoint = function() {
        var _x = event.offsetX;
        var _y = event.offsetY;
        $scope.points[$scope.currId] = ({
            id: $scope.currId,
            x: _x,
            y: _y,
            address: null
        });
        $scope.currId++;
    };

    $scope.changePointAddress = function(id, address) {
        var point = $scope.points[id];
        if (point.address in $scope.points) {
            nodeService.deleteNode(point.address);
        }
        nodeService.createNode(address);
        point.address = address;
    }

    $scope.deletePoint = function(point) {
        nodeService.deleteNode(point.address);
        delete $scope.points[point.id]
    };

    $scope.deletePoints = function() {
        nodeService.deletePoints(function(data) {
            $scope.points = {};
        });
    };

}]);

mapModule.service('nodeService', ['$http', function($http) {
    this.getNodes = function(callback) {
        $http.get('/devices').success(function(data) {
            console.log(data);
            callback(data);
        });
    };
            
    this.createNode = function(address) {
        $http.post('/devices/' + address);
    };

    this.deleteNode = function(address) {
        $http.delete('/devices/' + address);
    };

    this.deleteNodes = function() {
        $http.get('/devices').success(function(data) {
            callback(data);
        });
    };

    this.setBrightness = function(address, brightness) {
        $http.post('/devices/' + address + '/' + brightness);
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

/* Network Graph */
var graphModule = angular.module('graphModule', []);

graphModule.controller('graphController', ['$scope', function($scope) {
    
}]);

var symbiotApp = angular.module('symbiotApp', ['mapModule', 'ui.bootstrap']);

