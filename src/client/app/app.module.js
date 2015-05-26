/**
 * Created by 31611 on 4/23/2015.
 */

(function(){
    'use strict';

    angular.module('app', [
        'app.core',
        'app.widgets',

        //feature area
        'app.todos',
        'app.task',
        'app.playground',
        'app.layout'
    ]).config(configRoutes);

    /* @ngInject */
    function configRoutes($urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/");

        $locationProvider.html5Mode(
            {
                enabled:true,
                requireBase:false
            });
    }

    /* @ngInject */
    //function configRoutes($routeProvider, $locationProvider) {
    //    $routeProvider.otherwise({redirectTo: '/'});
    //
    //    $locationProvider.html5Mode(
    //        {
    //            enabled:true,
    //            requireBase:false
    //        });
    //}

    /*
        This function is needed to solve rendering ng-view inside ng-include problem
        Check - http://stackoverflow.com/questions/16674279/how-to-nest-ng-view-inside-ng-include
        https://github.com/angular/angular.js/issues/1213
    */
    /* @ngInject */
    //function reloadRoute($route){
    //    $route.reload();
    //}

})();

