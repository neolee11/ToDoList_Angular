/**
 * Created by 31611 on 4/30/2015.
 */

(function(){
    'use strict';

    angular.module('app.task')
        .config(configRoutes);

    function configRoutes($routeProvider) {

        $routeProvider.when('/task',
            {
                //templateUrl: '/ToDoList_Angular/src/client/app/task/task.html',
                templateUrl: 'app/task/task.html',
                controller: 'Task',
                controllerAs: 'vm',
                title: 'Task'
            }
        );
    }

})();
