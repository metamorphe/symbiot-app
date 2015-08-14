angular.module('mapModule')
    .service('nodeService', ['$http', function($http) {
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
}]);
