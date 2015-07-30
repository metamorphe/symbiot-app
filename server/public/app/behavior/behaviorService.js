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

    this._reverseBrightness = function(point) {
        point.brightness = (point.brightness === 0)
            ? 100
            : 0;
    };

    this.lineFill = function(nodeArr, actuateFn) {
        /* Assumes 'toggle' point behavior */
        var that = this;
        (function lambda(idx) {
            setTimeout(function() {
                actuateFn(nodeArr[idx]);
                that._reverseBrightness(nodeArr[idx]);
                if (++idx < nodeArr.length)
                    lambda(idx);
            }, 500);
        })(0);
    };

    this.followTheLeader = function(nodeArr, actuateFn) {
        /* Assumes 'toggle' point behavior */
        var that = this;
        (function lambda(idx) {
            setTimeout(function() {
                actuateFn(nodeArr[idx]);
                that._reverseBrightness(nodeArr[idx]);
                if (idx - 1 >= 0) {
                    actuateFn(nodeArr[idx - 1]);
                    that._reverseBrightness(nodeArr[idx - 1]);
                }
                if (++idx < nodeArr.length) {
                    lambda(idx);
                } else {
                    actuateFn(nodeArr[idx - 1]);
                    that._reverseBrightness(nodeArr[idx - 1]);
                }
            }, 500);
        })(0);
    };
}]);
