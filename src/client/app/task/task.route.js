/**
 * Created by 31611 on 4/30/2015.
 */

(function(){
    'use strict';

    angular.module('app.task')
        .config(configRoutes);

    /* @ngInject */
    function configRoutes($stateProvider) {

        $stateProvider.state('task',
            {
                url: "/task",
                templateUrl: 'app/task/task.html',
                controller: 'Task',
                controllerAs: 'vm',
                title: 'Task'
            }
        );
    }

    ///* @ngInject */
    //function configRoutes($routeProvider) {
    //
    //    $routeProvider.when('/task',
    //        {
    //            //templateUrl: '/ToDoList_Angular/src/client/app/task/task.html',
    //            templateUrl: 'app/task/task.html',
    //            controller: 'Task',
    //            controllerAs: 'vm',
    //            title: 'Task'
    //        }
    //    );
    //}

})();
