angular.module('mapModule', ['behaviorModule', 'paperModule']);
angular.module('behaviorModule', []);
angular.module('paperModule', []);

var symbiotApp = angular.module('symbiotApp', ['mapModule', 'ui.bootstrap',
                                                'ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/click');
        $stateProvider
            .state('sandbox', {
                url: '/sandbox',
                templateUrl: '../views/behaviors/_sandbox.html',
                //controller: 'paperController' //FIXME: keeps complaining
                controller: function($scope) {
                    $scope.blockMenuTemplateUrl = '../views/_blockMenu.html';
                    $scope.defaultColor = '#e9e9ff';
                    
                    /* SELECTION LOGIC */
                    $scope.selections = { nothing: [] };
                    $scope.addSelection = function(name, items) {
                        $scope.selections[name] = items;
                    };
                    $scope.selectSelection = function(name) {
                        project.deselectAll();
                        $scope.selections[name].forEach(function(item) {
                            item.selected = true;
                        });
                    };

                    /* TRIGGER LOGIC */
                    $scope.triggers = {
                        onClick: function(triggerItem) {
                            //TODO: if trigger item clicked, actuate behavior on selection
                        },
                        onDrag: function(triggerItem) {
                            //TODO: if trigger region dragged, actuate 
                        },
                        afterPrevious: function(previousBlock) {
                            //TODO: must define a previous block, as a trigger object
                            //and after it sactuation, actuate this block
                        }
                    };

                    /* BEHAVIOR LOGIC */
                    $scope.behaviors = {
                        turnOn: function(item) {
                            item.fillColor.alpha = 1.0;
                        },
                        turnOff: function(item) {
                            item.fillColor.alpha = 0.0;
                        },
                        turnHalfway: function(item) {
                            item.fillColor = $scope.defaultColor;
                        },
                        toggle: function(item) {
                            if (item.fillColor.alpha === 1.0)
                                item.fillColor.alpha = 0.0;
                            else
                                item.fillColor.alpha = 1.0;
                        },
                        fadeOn: function(item) {
                            var i = 0;
                            item.fillColor.alpha = 0.0;
                            var interval = setInterval(function() {
                                if (i < 25)
                                    item.fillColor.alpha += 0.04;
                                else
                                    clearInterval(interval);
                                i++;
                            }, 16); //Approximately 60 FPS
                        },
                        fadeOff: function(item) {
                            var i = 0;
                            item.fillColor.alpha = 1.0;
                            var interval = setInterval(function() {
                                if (i < 25)
                                    item.fillColor.alpha -= 0.04;
                                else
                                    clearInterval(interval);
                                i++;
                            }, 16); //Approximately 60 FPS
                        },
                        fadeToggle: function(item) {
                            if (item.fillColor.alpha === 1.0)
                                $scope.behaviors['fadeOff'](item);
                            else
                                $scope.behaviors['fadeOn'](item);
                        },
                        sine: function(item) {
                            var i = 0;
                            item.fillColor.alpha = 1.0;
                            var interval = setInterval(function() {
                                if (i < 25)
                                    item.fillColor.alpha -= 0.04;
                                else if (i < 50)
                                    item.fillColor.alpha += 0.04;
                                else if (i < 75)
                                    item.fillColor.alpha -= 0.04;
                                else if (i < 100)
                                    item.fillColor.alpha += 0.04;
                                else
                                    clearInterval(interval);
                                i++;
                            }, 16); //Approximately 60 FPS
                        }
                    };

                    /* BLOCK LOGIC */
                    $scope.blockActuate = function(block) {
                        var selection = $scope.selections[block.selectionName];
                        var behavior = $scope.behaviors[block.behaviorName]; 
                        selection.forEach(function(item) {
                            behavior(item);
                        });
                    };
                    $scope.blockDelete = function(block) {
                        $scope.selections[block.selectionName].alpha = 1.0;
                        delete $scope.blocks[block.id];
                    };

                    $scope.blocks = {};
                    $scope.blockId = 0;
                    $scope.blockForm = {
                        selectionName: 'nothing',
                        triggerName: 'afterPrevious',
                        triggerObjectName: 'nothing',
                        behaviorName: 'turnOn'
                    };
                    $scope.addBlock = function(blockForm) {
                        $scope.blocks[$scope.blockId] = {
                            id: $scope.blockId,
                            selectionName: blockForm.selectionName,
                            triggerName: blockForm.triggerName,
                            triggerObjectName: blockForm.triggerObjectName,
                            behaviorName: blockForm.behaviorName
                        };
                        $scope.blockId++;
                    };

                    /* Main paper logic */
                    $scope.$on('$viewContentLoaded',
                        function(event, viewConfig) {
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
                                    circle.fillColor = $scope.defaultColor;
                                    circle.selected = true;
                                    recent = circle;
                                    $scope.nodeGroup.addChild(circle);
                                } else {
                                    if (event.modifiers.shift) {
                                        if (event.item)
                                            event.item.remove();
                                    } else {
                                        hitResult.item.selected = true;
                                        recent = hitResult.item;
                                    }
                                }
                            };

                            $scope.placeTool.onMouseDrag = function(event) {
                                if (recent) {
                                    recent.position = recent.position.add(event.delta);
                                }
                            };

                            var onKeyDown = function(event) {
                                switch (event.key) {
                                    case 'a':
                                        project.selectAll();
                                        break;
                                    case 'enter':
                                        var name = prompt("Enter a name for this selection.");
                                        $scope.addSelection(name, project.selectedItems);
                                        break;
                                    case 'backspace':
                                        event.preventDefault();
                                        event.stopPropagation();
                                        project.selectedItems.forEach(function(v) {
                                            v.remove();
                                        });
                                        break;
                                    case 'escape':
                                        project.deselectAll();
                                        break;
                                    default:
                                        break;
                                }
                            };

                            $scope.placeTool.onKeyDown = onKeyDown;
                            $scope.pathTool.onKeyDown = onKeyDown;

                            $scope.pathTool.onMouseDown = function(event) {
                                project.deselectAll();
                                // Create a new path and give it a stroke color:
                                path = new Path();
                                path.strokeColor = '#F1C40F';
                                path.strokeWidth = 10;

                                // Add a segment to the path where
                                // you clicked:
                                path.add(event.point);
                            };

                            $scope.pathTool.onMouseDrag = function(event) {
                                // Every drag event, add a segment
                                // to the path at the position of the mouse:
                                path.add(event.point);
                                path.smooth();
                            };

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
                            };

                            view.onFrame = function(event) {
                                if (actuating) {
                                    recent.fillColor.hue += 10;
                                    if (event.count > 120) {
                                        actuating = false;
                                    }
                                }
                            };
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
