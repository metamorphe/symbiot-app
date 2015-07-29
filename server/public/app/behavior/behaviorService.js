angular.module('behaviorModule')
    .service('behaviorService', [function() {

    this.addPointToQueue = function(domPoint, nodeArr, index, pointDict) {
        var point = pointDict[domPoint._id];
        if (!(point in nodeArr)) {
            if (typeof index === 'number')
                nodeArr.splice(index, 0, point);
            else {
                nodeArr.push(point);
            }
        }
    };

    this.deletePointFromQueue = function(point, nodeArr) {
        if (point in nodeArr) {
            nodeArr.forEach(function(value, index) {
                if (value === point)
                    nodeArr.splice(index, 1);
            });
        }
    };

    this.clearQueue = function(nodeArr) {
        nodeArr.splice(0, nodeArr.length)
    };

    this.lineFill = function(nodeArr, actuateFn) {
        /* Assumes 'toggle' point behavior */
        (function lambda(idx) {
            setTimeout(function() {
                actuateFn(nodeArr[idx]);
                nodeArr[idx].brightness = (nodeArr[idx].brightness == 0)
                    ? 100
                    : 0 //FIXME: kludgy
                if (++idx < nodeArr.length)
                    lambda(idx);
            }, 1000);
        })(0);
    };

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
