/**
 * Created by 31611 on 4/30/2015.
 */

(function(){
    'use strict';

    angular.module('app.todos')
        .config(configRoutes);

    /* @ngInject */
    function configRoutes($routeProvider) {
        $routeProvider.when('/',
            {
                templateUrl: 'app/todos/todos.html',
                controller: 'Todos',
                controllerAs: 'vm',
                title: 'To Dos'
            }
        );
    }

})();
