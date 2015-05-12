/**
 * Created by 31611 on 4/23/2015.
 */

(function(){
    'use strict';

    angular.module('app', [
        'app.core',

        //feature area
        'app.todos',
        'app.task'
    ]).config(configRoutes);

    /* @ngInject */
    function configRoutes($routeProvider, $locationProvider) {
        $routeProvider.otherwise({redirectTo: '/'});

        $locationProvider.html5Mode(
            {
                enabled:true,
                requireBase:false
            });
    }

})();
