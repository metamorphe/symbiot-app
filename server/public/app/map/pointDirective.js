angular.module('mapModule')
    .directive('point', function() {
    return {
        restrict: 'E',
        replace: true,
        link: function(scope, element, attrs) {
            element.css({
                transform: 'translate(' + attrs.x + 'px, ' + attrs.y + 'px)',
            });
        },
        templateUrl: '../../views/_point.html',
    };
});
