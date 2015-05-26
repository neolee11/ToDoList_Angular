/**
 * Created by 31611 on 5/24/2015.
 */

(function(){
    'use strict';

    angular.module('app.core')
        .factory('taskManagerService', taskManagerService);

    /* @ngInject */
    function taskManagerService(){

        var steps = [];

        var service = {
            allSteps: steps,
            createStep: createStep
        };

        return service;

        function createStep(step){
            steps.push(step);
        }
    }
})();

