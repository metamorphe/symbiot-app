angular.module('mapModule', ['behaviorModule']);
angular.module('behaviorModule', []);

var symbiotApp = angular.module('symbiotApp', ['mapModule', 'ui.bootstrap',
                                                'ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/click');
        $stateProvider
            .state('click', {
                url: '/click',
                controller: 'mapController',
                templateUrl: '../views/behaviors/_click.html'
            })
            .state('lineFill', {
                url: '/lineFill',
                controller: 'mapController',
                templateUrl: '../views/behaviors/_lineFill.html'
            });
    });
