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
                    $scope.colorHexes = ['#e74c3c', '#e67e22', '#f1c40f',
                        '#1abc9c', '#2ecc71', '#3498db', '#9b59b6',
                        '#34495e', '#95a5a6'];
                    $scope.colorIndex = 0;
                    
                    /* SELECTION LOGIC */
                    $scope.selections = { nothing: [] };
                    $scope.addSelection = function(name, items) {
                        $scope.selections[name] = items;
                        var color = $scope.colorHexes[$scope.colorIndex++
                                % $scope.colorHexes.length];
                        items.forEach(function(item) {
                            item.fillColor = color;
                            item.strokeColor = color;
                            item.shadowColor = color;
                            item.shadowBlur = 20;
                        });
                        $scope.selectionToColorMap[name] = color;
                    };
                    $scope.selectSelection = function(name) {
                        project.deselectAll();
                        $scope.selections[name].forEach(function(item) {
                            item.selected = true;
                        });
                    };
                    $scope.selectionToColorMap = {};
                    $scope.selectionNameToColor = function(name) {
                        //return '{ \'background-color\' : \'' + $scope.selectionToColorMap[name] + '\'}';
                        return $scope.selectionToColorMap[name];
                    };

                    /* TRIGGER LOGIC */
                    $scope.triggers = {
                        onClick: function(triggerItem, blockId) {
                            return function(event) {
                                var hitResult;
                                triggerItem.forEach(function(item) {
                                    hitResult = item.hitTest(event.point);
                                    if (hitResult) {
                                        $scope.blockActuate($scope.blocks[blockId]);
                                    }
                                });
                            };
                        },
                        onDrag: function(triggerItem, blockId) {
                            //TODO: if trigger region dragged, actuate 
                            return function(event) {
                                var hitResult;
                                triggerItem.forEach(function(item) {
                                    hitResult = item.hitTest(event.point);
                                    if (hitResult) {
                                        $scope.blockActuate($scope.blocks[blockId]);
                                    }
                                });
                            };
                        },
                        afterPrevious: function(previousBlock, blockId) {
                            //TODO: must define a previous block, as a trigger object
                            //and after it sactuation, actuate this block
                            /* Add the next block to the next field of PREVIOUS_BLOCK */
                            previousBlock.next = blockId;
                            return function() {
                                //TODO: enforce actuation only after asynchronous completion
                                //console.log("Warning: afterPrevious actuation is currently not timed properly");
                                $scope.blockActuate($scope.blocks[blockId]);
                            };
                        }
                    };
                    $scope.triggerMouseDownHandlers = {};
                    $scope.triggerMouseDragHandlers = {};
                    $scope.triggerMouseUpHandlers = {};
                    $scope.triggerOrderHandlers = {};
                    $scope.addTrigger = function(triggerObjectName,
                                            triggerName, blockId) {
                        var handlerDict, triggerObj;
                        switch (triggerName) {
                            case 'onClick':
                                handlerDict = $scope.triggerMouseDownHandlers;
                                triggerObj = $scope.selections[triggerObjectName];
                                break;
                            case 'onDrag':
                                handlerDict = $scope.triggerMouseDragHandlers;
                                triggerObj = $scope.selections[triggerObjectName];
                                break;
                            case 'afterPrevious':
                                handlerDict = $scope.triggerOrderHandlers;
                                triggerObj = $scope.blocks[triggerObjectName];
                                break;
                            default:
                                throw new Error('Error: no handler list for this triggerItem');

                        }
                        handlerDict[blockId] =
                            $scope.triggers[triggerName](triggerObj, blockId);
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
                        flash: function(item) {
                            var i = 0;
                            item.fillColor.alpha = 1.0;
                            var interval = setInterval(function() {
                                if (i < 10)
                                    item.fillColor.alpha = 1.0;
                                else if (i < 20)
                                    item.fillColor.alpha = 0.0;
                                else if (i < 30)
                                    item.fillColor.alpha = 1.0
                                else if (i < 40)
                                    item.fillColor.alpha = 0.0;
                                else {
                                    clearInterval(interval);
                                    item.fillColor.alpha = 1.0;
                                }
                                i++;
                            }, 16); //Approximately 60 FPS
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

                        /* If there is a next block to actuate, it will be contained
                         * in $scope.triggerOrderHandlers with the next block's 
                         * ID field as the key for the handler function. */
                        if (block.next && block.next in $scope.triggerOrderHandlers) {
                            var timeout = setTimeout(function() {
                                $scope.triggerOrderHandlers[block.next]();
                                clearTimeout(timeout);
                            }, 1000);
                        }
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
                            behaviorName: blockForm.behaviorName,
                            next: null
                        };
                        $scope.addTrigger(blockForm.triggerObjectName,
                                            blockForm.triggerName, $scope.blockId);
                        $scope.blockId++;
                    };

                    /* Main paper logic */
                    $scope.$on('$viewContentLoaded',
                        function(event, viewConfig) {
                            /* Setup */
                            paper.install(window);
                            paper.setup('myCanvas');
                            $scope.interactTool = new Tool();
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
                                    var color = $scope.colorHexes[$scope.colorIndex++
                                            % $scope.colorHexes.length];
                                    var circle = new Path.Circle({
                                        center: point,
                                        radius: 20,
                                        strokeColor: $scope.defaultColor,
                                        strokeWidth: 1,
                                        fillColor: $scope.defaultColor
                                    });
                                    circle.selected = true;
                                    recent = circle;
                                    $scope.nodeGroup.addChild(circle);
                                } else {
                                    if (event.modifiers.shift) {
                                        if (event.item)
                                            event.item.selected = true;
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
                            
                            $scope.interactTool.onKeyDown = onKeyDown;
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

                            $scope.interactTool.onMouseDown = function(event) {
                                project.deselectAll();
                                for (handlerName in $scope.triggerMouseDownHandlers) {
                                   $scope.triggerMouseDownHandlers[handlerName](event);
                                };
                            };
                            $scope.interactTool.onMouseDrag = function(event) {
                                for (handlerName in $scope.triggerMouseDragHandlers) {
                                   $scope.triggerMouseDragHandlers[handlerName](event);
                                };
                            };
                            $scope.interactTool.onMouseUp = function(event) {
                                for (handlerName in $scope.triggerUpHandlers) {
                                   $scope.triggerMouseUpHandlers[handlerName](event);
                                };
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
