angular.module('mapModule')
    .directive('pointMenu', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/_pointMenu.html'
    }
});
