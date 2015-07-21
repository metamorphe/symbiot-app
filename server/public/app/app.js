/* Map */
var mapModule = angular.module('mapModule', []);

mapModule.controller('mapController',
                    ['$scope', '$sce', 'nodeService', 'behaviorService',
                     'UserMedia',
                     function($scope, $sce, nodeService, behaviorService,
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

    $scope.ftl = behaviorService.followTheLeader;

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
        UserMedia.get().then(function(stream) {
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

mapModule.service('nodeService', ['$http', function($http) {
    this.getNodes = function(callback) {
        return $http.get('/devices').success(function(data) {
            if (callback !== null && callback !== undefined)
                callback(data);
        });
    };

    this.createNode = function(address, json) {
         return $http.post('/devices/' + address, json);
    };

    this.createNodes = function(json) {
        return $http.post('/devices', json);
    };

    this.updateNode = function(address, json) {
        return $http.put('/devices/' + address, json);
    };

    this.deleteNode = function(address) {
        return $http.delete('/devices/' + address);
    };

    this.deleteNodes = function(callback) {
        return $http.delete('/devices/').success(function(data) {
            if (callback !== null && callback !== undefined)
                callback(data);
        });
    };

    this.setBrightness = function(address, brightness) {
        return $http.post('/devices/' + address + '/' + brightness);
    };

}]);

mapModule.service('behaviorService', [function() {
    this.nodeQueue = [];

    this.followTheLeader = function(nodeArr, actuateFn) {
        /* Assumes 'toggle' point behavior */
        (function lambda(idx) {
            setTimeout(function() {
                actuateFn(nodeArr[idx]);
                if (idx + 1 < nodeArr.length)
                    actuateFn(nodeArr[idx + 1]);
                if (idx - 2 >= 0)
                    actuateFn(nodeArr[idx - 2]);
                if (++idx < nodeArr.length)
                    lambda(idx);
            }, 1000);
        })(0);
    };
}]);

mapModule.service('UserMedia', ['$q', function($q) {
  
  navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  
  var constraints = {
    audio: false,
    video: {
        optional: [{
        /* The sourceId is hard-coded. */
        //sourceId: '3c3b7e5360ff86ce236295de49b72e6'
        //            + '3edc871b2e7fce015213417905fb1fba1'
          sourceId: 'ac7b75ac861d20063baf9bbb152a7a9'
                      + 'bd402b8b9bfdafc8a17d53bf74a6f61d9'
      }]
    }
  };
  
  var deferred = $q.defer();
  
  var get = function() {
    navigator.getUserMedia(
      constraints,
      function(stream) { deferred.resolve(stream); },
      function errorCallback(error) {
        console.log('navigator.getUserMedia error: ', error);
        deferred.reject(error);
      }
    );
    
    return deferred.promise;
  }
  
  return {
    get: get
  }
  
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

