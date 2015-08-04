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
                    $scope.placeTool = null;
                    $scope.pathTool = null;
                    $scope.$on('$viewContentLoaded',
                        function(event, viewConfig) {
                            //TODO: move this somewhere else
                            /* Setup */
                            paper.install(window);
                            paper.setup('myCanvas');
                            $scope.selectTool = new Tool();
                            $scope.placeTool = new Tool();
                            $scope.pathTool = new Tool();
                            $scope.nodeGroup = new Group();

                            var textItem = new PointText({
                                content: 'textItem goes here',
                                point: new Point(20, 30),
                                fillColor: 'black'
                            });

                            var height = document.getElementById('myCanvas').height;
                            var width = document.getElementById('myCanvas').width;
                            view.viewSize = new Size(width, height);

                            /* Main */
                            var lightBlue = '#e9e9ff';
                            var hitOptions = {
                            	segments: true,
                            	stroke: true,
                            	fill: true,
                            	tolerance: 5
                            };

                            var recent, path, actuating;

                            $scope.placeTool.onMouseDown = function(event) {
                                recent = null;
                                project.activeLayer.selected = false;
                                var hitResult = project.hitTest(event.point, hitOptions);
                                if (!hitResult) {
                                    var point = new Point(event.point);
                                    var circle = new Path.Circle(point, 20);
                                    circle.fillColor = lightBlue;
                                    circle.selected = true;
                                    recent = circle;
                                    $scope.nodeGroup.addChild(circle);
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

                            $scope.placeTool.onMouseDrag = function(event) {
                                if (recent) {
                                    recent.position = recent.position.add(event.delta);
                                }
                            }

                            var onKeyDown = function(event) {
                                switch (event.key) {
                                    case 'p':
                                        console.log(project.activeLayer);
                                        break;
                                    case 'a':
                                        project.selectAll();
                                        break;
                                    case 'a':
                                        actuating = true;
                                        break;
                                    case 'backspace':
                                        event.preventDefault();
                                        event.stopPropagation();
                                    case 'd':
                                        project.selectedItems.forEach(function(v) {
                                            v.remove();
                                        });
                                        break;
                                    case 'escape':
                                        project.deselectAll();
                                        break;
                                    default:
                                        console.log(event.key);
                                }
                            }

                            $scope.placeTool.onKeyDown = onKeyDown;
                            $scope.pathTool.onKeyDown = onKeyDown;

                            $scope.pathTool.onMouseDown = function(event) {
                            	// Create a new path and give it a stroke color:
                            	path = new Path();
                            	path.strokeColor = '#00000';

                            	// Add a segment to the path where
                            	// you clicked:
                            	path.add(event.point);
                            }

                            $scope.pathTool.onMouseDrag = function(event) {
                            	// Every drag event, add a segment
                            	// to the path at the position of the mouse:
                            	path.add(event.point);
                            }

                            $scope.pathTool.onMouseUp = function(event) {
                                var intersections = [];
                                var nodes = $scope.nodeGroup.children;
                                for (var i = 0; i < nodes.length; i ++) {
                                    intersections = intersections.concat(path.getIntersections(nodes[i]));
                                }
                                for (var i = 0; i < intersections.length; i++) {
                                    var intersectPoint = intersections[i].point;
                                    var hitResult = $scope.nodeGroup.hitTest(intersectPoint, hitOptions);
                                    hitResult.item.selected = true;
                                }
                                path.remove();
                            }

                            view.onFrame = function(event) {
                                if (actuating) {
                                    recent.fillColor.hue += 10;
                                    if (event.count > 120) {
                                        actuating = false;
                                    }
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
