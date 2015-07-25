angular.module('behaviorModule')
    .service('behaviorService', [function() {
    this.nodeQueue = [];

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
