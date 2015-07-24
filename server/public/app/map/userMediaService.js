angular.module('mapModule')
    .service('UserMedia', ['$q', function($q) {

  navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  var constraints = {
    audio: false,
    video: {
        optional: [{
        /* The sourceId is hard-coded. */
        //sourceId: '3c3b7e5360ff86ce236295de49b72e6'
        //            + '3edc871b2e7fce015213417905fb1fba1'
          sourceId: 'ac7b75ac861d20063baf9bbb152a7a9'
                      + 'bd402b8b9bfdafc8a17d53bf74a6f61d9'
      }]
    }
  };

  var deferred = $q.defer();

  var get = function() {
    navigator.getUserMedia(
      constraints,
      function(stream) { deferred.resolve(stream); },
      function errorCallback(error) {
        console.log('navigator.getUserMedia error: ', error);
        deferred.reject(error);
      }
    );

    return deferred.promise;
  }

  return {
    get: get
  }

}]);
