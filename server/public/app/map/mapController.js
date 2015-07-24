angular.module('mapModule', [])
    .controller('mapController',
                    ['$scope', '$sce', 'nodeService', 'pointBehaviorService',
                     'UserMedia',
                     function($scope, $sce, nodeService, pointBehaviorService,
                              UserMedia) {
    $scope.imgUrl = '../img/wall_formation.JPG';

    $scope.pointMenu= {
        content: 'Lorem Ipsum',
        templateUrl: '../views/_pointMenu.html',
        title: 'Actuator Options'
    };

    $scope.pointQueue = [];
    $scope.points = {};
    nodeService.getNodes(function(data) {
        angular.forEach(data, function (value, key, object) {
            $scope.points[value._id] = value;
        });
    });

    $scope.behaviors = {
        toggle: {
            name: 'toggle',
            lambda: function(point) {
                if (point.brightness) {
                    nodeService.updateNode(point.address,
                        { brightness : 0})
                        .success(function(data) {
                            $scope.points[data._id] = data;
                        });
                } else {
                    nodeService.updateNode(point.address,
                        { brightness : 100})
                        .success(function(data) {
                            $scope.points[data._id] = data;
                        });
                }
            }
        },
        fade : {
            name: 'fade',
            lambda: function(point) {
                alert('Not yet implemented :(');
            }
        }
    };

    $scope.followTheLeader = pointBehaviorService.followTheLeader;
    $scope.lineFill = pointBehaviorService.lineFill;

    $scope.currId = 0;

    $scope.progMode = 'Playground';

    $scope.actuate = function(point) {
        ($scope.behaviors['toggle'].lambda)(point);
    };

    $scope.addPoint = function() {
        var x = event.offsetX;
        var y = event.offsetY;
        $scope.points[$scope.currId] =
            { _id : $scope.currId, address: $scope.currId, x: x, y: y};
        $scope.currId++;
    };

    $scope.sendPoints = function() {
        nodeService.deleteNodes()
            .success(function() {
                console.log($scope.points);
                nodeService.createNodes($scope.points)
                    .success(function(data, status) {
                        alert('Success!');
                    })
                    .error(function(data, status) {
                        alert('Error.');
                    });
            });
    };

    $scope.changePointAddress = function(point, oldAddress) {
        return nodeService.updateNode(oldAddress,
                    { address : point.address })
                .success(function(data, status) {
                    $scope.points[point._id].address = point.address;
                })
                .error(function(data, status) {
                    alert(data);
                });
    }

    $scope.deletePoint = function(point) {
        nodeService.deleteNode(point.address)
            .success(function(data, status) {
                delete $scope.points[point._id]
            });
    };

    $scope.deletePoints = function() {
        nodeService.deleteNodes(function(data) {
            $scope.points = {};
        });
    };

    $scope.captureVideo = function() {
        pointBehaviorService.get().then(function(stream) {
            console.log('starting video', stream);
            window.stream = stream; // stream available to console for dev
            if (window.URL) {
                console.log('using window.URL');
                $scope.videostream = $sce.trustAsResourceUrl(window.URL.createObjectURL(stream));
            } else {
                $scope.videostream = $sce.trustAsResourceUrl(stream);
            }
        });
    };

}]);
