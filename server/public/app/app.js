angular.module('mapModule', ['behaviorModule', 'paperModule']);
angular.module('behaviorModule', []);
angular.module('paperModule', []);

var symbiotApp = angular.module('symbiotApp', ['mapModule', 'ui.bootstrap',
                                                'ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/sandbox');
        $stateProvider
            .state('sandbox', {
                url: '/sandbox',
                templateUrl: '../views/behaviors/_sandbox.html',
                //controller: 'paperController' //FIXME: keeps complaining
                controller: function($scope, nodeService) {
                    /* META LOGIC */
                    $scope.blockMenuTemplateUrl = '../views/_blockMenu.html';
                    $scope.usingInteractTool = function() {
                        return paper.tool === $scope.interactTool;
                    };
                    /* Note that these URLs are relative to the 'calling' page */
                    $scope.backgrounds = {
                        facade: '../../img/wall_formation.JPG',
                        spatial: '../../img/spatial_room.jpg'
                    };
                    $scope.viewModes = {
                        virtual: 'Virtual',
                        physical: 'Physical'
                    };
                    $scope.viewSettings = {
                        viewMode: $scope.viewModes.virtual,
                        background: $scope.backgrounds.facade
                    };
                    /* For user study only */
                    $scope.addPhysicalNodes = function() {
                        var points = [
                           new Point(50, 50),
                           new Point(50, 100),
                           new Point(50, 150),
                           new Point(50, 200),
                           new Point(50, 250)
                        ];
                        points.forEach(function(point, index) {
                            var circle = new Path.Circle({
                                    center: point,
                                    radius: 20,
                                    fillColor: $scope.defaultColor,
                                    strokeColor: $scope.defaultColor,
                                    strokeWidth: 5
                            });
                            circle.fillColor.alpha = 0.0;
                            circle.data.address = index + 1;
                            $scope.nodeGroup.addChild(circle);
                        });
                        var nodeJson = [
                            { _id : 1, address: 1, x: 0, y: 0},
                            { _id : 2, address: 2, x: 0, y: 0},
                            { _id : 3, address: 3, x: 0, y: 0},
                            { _id : 4, address: 4, x: 0, y: 0},
                            { _id : 5, address: 5, x: 0, y: 0}
                        ];
                        nodeService.deleteNodes()
                            .success(function() {
                                nodeService.createNodes(nodeJson)
                                    .success(function(data, status) {
                                        alert('Success!');
                                    })
                                    .error(function(data, status) {
                                        alert('Error.');
                                    });
                            });
                    };
                    
                    /* SELECTION LOGIC */
                    $scope.selections = { none: [] };
                    $scope.defaultColor = '#e9e9ff';
                    $scope.colorHexes = ['#e74c3c', '#e67e22', '#f1c40f',
                        '#1abc9c', '#2ecc71', '#3498db', '#9b59b6',
                        '#34495e', '#95a5a6'];
                    $scope.colorIndex = 0;
                    $scope.addSelection = function(name, items) {
                        if ($scope.selections[name]) {
                            /* Adding to an existing selection */
                            $scope.selections[name] = $scope.selections[name].concat(items);
                            var color = $scope.selectionToColorMap[name];
                        } else {
                            /* Create a new selection */
                            $scope.selections[name] = items;
                            var color = $scope.colorHexes[$scope.colorIndex++
                                    % $scope.colorHexes.length];
                            $scope.selectionToColorMap[name] = color;
                        }
                        items.forEach(function(item) {
                            item.fillColor = color;
                            item.fillColor.alpha = 0.0;
                            item.strokeColor = color;
                            item.shadowColor = color;
                            item.shadowBlur = 20;
                        });
                    };
                    $scope.selectSelection = function(name) {
                        project.deselectAll();
                        $scope.selections[name].forEach(function(item) {
                            item.selected = true;
                        });
                    };
                    $scope.deleteSelection = function(name) {
                        $scope.selections[name].forEach(function(item) {
                            var beginningAlpha = item.fillColor.alpha;
                            item.fillColor = $scope.defaultColor;
                            item.fillColor.alpha = beginningAlpha;
                            item.strokeColor = $scope.defaultColor;
                        });
                        delete $scope.selections[name];
                    };
                    $scope.deleteAllSelections = function() {
                        for (selectionName in $scope.selections) {
                            $scope.deleteSelection(selectionName);
                        };
                        $scope.selections = { none: [] };
                    };
                    $scope.deleteAllNodes = function() {
                        for (selection in $scope.selections) {
                            $scope.selections[selection].forEach(function(item) {
                                item.remove();
                            });
                        };
                        $scope.selections = { none: [] };
                    };
                    $scope.selectionToColorMap = {};
                    $scope.selectionNameToColor = function(name) {
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
                            /* Add the next block to the next field of PREVIOUS_BLOCK */
                            previousBlock.next = blockId;
                            return function() {
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
                    $scope.removeBlockTrigger = function(block) {
                        var triggerObj;
                        switch (block.triggerName) {
                            case 'onClick':
                                handlerDict = $scope.triggerMouseDownHandlers;
                                triggerObj = $scope.selections[block.triggerObjectName];
                                break;
                            case 'onDrag':
                                handlerDict = $scope.triggerMouseDragHandlers;
                                triggerObj = $scope.selections[block.triggerObjectName];
                                break;
                            case 'afterPrevious':
                                handlerDict = $scope.triggerOrderHandlers;
                                triggerObj = $scope.blocks[block.triggerObjectName];
                                break;
                            default:
                                throw new Error('Error: no handler list for this triggerItem');

                        }
                        delete handlerDict[block.id];
                    };


                    /* BEHAVIOR LOGIC */
                    $scope.behaviors = {
                        //turnOn: function(item) {
                        //    item.fillColor.alpha = 1.0;
                        //},
                        //turnOff: function(item) {
                        //    item.fillColor.alpha = 0.0;
                        //},
                        //turnHalfway: function(item) {
                        //    item.fillColor = $scope.defaultColor;
                        //},
                        doNothing: function(item) {},
                        toggle: function(item) {
                            /* Physical handling */
                            if (item.data.address) {
                                var address = item.data.address;
                                if (item.fillColor.alpha === 1.0)
                                    nodeService.updateNode(address, { 'brightness' : 0 });
                                else
                                    nodeService.updateNode(address, { 'brightness' : 100 });
                            }
                            /* Virtual Handling */
                            if (item.fillColor.alpha === 1.0)
                                item.fillColor.alpha = 0.0;
                            else
                                item.fillColor.alpha = 1.0;
                        },
                        flash: function(item) {
                            var i = 0;
                            var beginningAlpha = item.fillColor.alpha;
                            item.fillColor.alpha = 1.0;
                            var interval = setInterval(function() {
                                if (i === 10) {
                                    item.fillColor.alpha = 1.0;
                                } else if (i === 20) {
                                    item.fillColor.alpha = 0.0;
                                } else if (i === 30) {
                                    item.fillColor.alpha = 1.0
                                } else if (i === 40) {
                                    item.fillColor.alpha = 0.0;
                                } else {
                                    clearInterval(interval);
                                    item.fillColor.alpha = beginningAlpha;
                                }
                                i++;
                            }, 16); //Approximately 60 FPS
                        },
                        //fadeOn: function(item) {
                        //    var i = 0;
                        //    item.fillColor.alpha = 0.0;
                        //    var interval = setInterval(function() {
                        //        if (i < 25)
                        //            item.fillColor.alpha += 0.04;
                        //        else
                        //            clearInterval(interval);
                        //        i++;
                        //    }, 16); //Approximately 60 FPS
                        //},
                        //fadeOff: function(item) {
                        //    var i = 0;
                        //    item.fillColor.alpha = 1.0;
                        //    var interval = setInterval(function() {
                        //        if (i < 25)
                        //            item.fillColor.alpha -= 0.04;
                        //        else
                        //            clearInterval(interval);
                        //        i++;
                        //    }, 16); //Approximately 60 FPS
                        //},
                        fadeToggle: function(item) {
                            if (item.fillColor.alpha === 1.0) {
                                var i = 0;
                                item.fillColor.alpha = 1.0;
                                var interval = setInterval(function() {
                                    if (i < 25)
                                        item.fillColor.alpha -= 0.04;
                                    else
                                        clearInterval(interval);
                                    i++;
                                }, 16); //Approximately 60 FPS
                            } else {
                                var i = 0;
                                item.fillColor.alpha = 0.0;
                                var interval = setInterval(function() {
                                    if (i < 25)
                                        item.fillColor.alpha += 0.04;
                                    else
                                        clearInterval(interval);
                                    i++;
                                }, 16); //Approximately 60 FPS
                            }
                        },
                        sine: function(item) {
                            var i = 0;
                            var beginningAlpha = item.fillColor.alpha;
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
                                else {
                                    clearInterval(interval);
                                    item.fillColor.alpha = beginningAlpha;
                                }
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
                    $scope.blocks = {};
                    $scope.blockId = 0;
                    $scope.blockForm = {
                        selectionName: 'none',
                        triggerName: 'onClick',
                        triggerObjectName: 'none',
                        behaviorName: 'doNothing'
                    };
                    $scope.blockAdd = function(blockForm) {
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
                    $scope.blockEdit = function(block) {
                        $scope.removeBlockTrigger(block);
                        $scope.addTrigger(block.triggerObjectName,
                                            block.triggerName, block.id);
                    };
                    $scope.blockDelete = function(block) {
                        //TODO: go through all other blocks that have this after previous
                        //and invalidate them
                        var _blockRecursiveDeleteNext = function(block) {
                            if (block.next)
                                _blockRecursiveDeleteNext($scope.blocks[block.next]);
                            block.triggerObjectName = 'none';
                            block.next = null;
                        };
                        _blockRecursiveDeleteNext(block);
                        $scope.removeBlockTrigger(block);
                        delete $scope.blocks[block.id];
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
                            $scope.placeTool.activate();

                            $scope.nodeGroup = new Group();

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
                                    var circle = new Path.Circle({
                                        center: point,
                                        radius: 20,
                                        strokeColor: $scope.defaultColor,
                                        strokeWidth: 5,
                                        fillColor: $scope.defaultColor,
                                    });
                                    circle.fillColor.alpha = 0.0;
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
