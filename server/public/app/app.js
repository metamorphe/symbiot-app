angular.module('mapModule', ['behaviorModule']);
angular.module('behaviorModule', []);

var symbiotApp = angular.module('symbiotApp', ['mapModule', 'ui.bootstrap',
                                                'ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/click');
        $stateProvider
            .state('sandbox', {
                url: '/sandbox',
                templateUrl: '../views/behaviors/_sandbox.html',
                controller: function($scope) {
                    $scope.$on('$viewContentLoaded',
                        function(event, viewConfig) {
                            //TODO: move this somewhere else
                            /* Setup */
                            paper.install(window);
                            paper.setup('myCanvas');
                            var tool = new Tool();

                            /* Main */
                            var lightBlue = '#e9e9ff';
                            var hitOptions = {
                            	segments: true,
                            	stroke: true,
                            	fill: true,
                            	tolerance: 5
                            };

                            var recent;

                            var textItem = new PointText({
                                content: 'Add Nodes',
                                point: new Point(20, 30),
                                fillColor: 'black'
                            });

                            tool.onMouseDown = function(event) {
                                recent = null;
                                project.activeLayer.selected = false;
                                var hitResult = project.hitTest(event.point, hitOptions);
                                if (!hitResult) {
                                    var point = new Point(event.point);
                                    var circle = new Path.Circle(point, 30);
                                    circle.fillColor = lightBlue;
                                    circle.selected = true;
                                } else {
                                    if (event.modifiers.shift) {
                                        if (event.item)
                                            event.item.remove();
                                    } else {
                                        event.item.selected = true;
                                        recent = event.item;
                                    }
                                }
                            }

                            tool.onMouseDrag = function(event) {
                                if (recent) {
                                    recent.position = recent.position.add(event.delta);
                                }
                            }
                        });
                }
            })
            .state('click', {
                url: '/click',
                templateUrl: '../views/behaviors/_click.html'
            })
            .state('lineFill', {
                url: '/lineFill',
                templateUrl: '../views/behaviors/_lineFill.html'
            })
            .state('followTheLeader', {
                url: '/followTheLeader',
                templateUrl: '../views/behaviors/_followTheLeader.html'
            })
            .state('burst', {
                url: '/burst',
                templateUrl: '../views/behaviors/_burst.html'
            });
    });
