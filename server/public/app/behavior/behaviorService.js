angular.module('behaviorModule')
    .service('behaviorService', [function() {
    this.nodeQueue = [];

    this.addPointToQueue = function(point, index) {
        if (!(point in this.nodeQueue)) {
            if (typeof index === 'number')
                this.nodeQueue.splice(index, 0, point);
            else {
                this.nodeQueue.push(point);
            }
        }
    };

    this.deletePointFromQueue = function(point) {
        if (point in this.nodeQueue) {
            this.nodeQueue.forEach(function(value, index) {
                if (value === point)
                    this.nodeQueue.splice(index, 1);
            });
        }
    };

    this.lineFill = function(nodeArr, actuateFn) {
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
