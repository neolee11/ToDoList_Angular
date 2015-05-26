/**
 * Created by 31611 on 5/25/2015.
 */

(function () {
    'use strict';

    angular.module('app.playground')
        .service('pgCalcService', pgCalcService)
        .factory('pgGetDataService', pgGetDataService)
        .filter('pgFilter', pgFilter)
        .config(pgConfig);

    function pgCalcService() {
        /*jshint validthis: true */
        var srv = this;

        srv.double = function (input) {
            return input * 2;
        };
    }

    /*@ngInject*/
    function pgGetDataService($timeout, $q, $window) {
        //return function because it is a factory
        return function () {
            var deferred = $q.defer();

            //similuate a async process
            $timeout(function () {
                var num = Math.random() * 10;
                if (num < 7) {
                    deferred.resolve(num);
                }
                else {
                    deferred.reject(-1);
                }
            }, 2000);

            $timeout(function () {
                deferred.notify('Half way there!');
            }, 1000);

            return deferred.promise;
        };
    }

    function pgFilter() {
        return function (input) {
            return "***" + input + "***";
        };
    }

    /*@ngInject*/
    function pgConfig($provide) {
        $provide.decorator('taskManagerService', pgTaskManagerService);
    }

    /* @ngInject */
    function pgTaskManagerService($delegate, $window) {

        $delegate.createStepTwice = function (step) {

            this.allSteps.push(step);
            this.allSteps.push('copy ' + step);
        }
        return $delegate;
    }

})();
