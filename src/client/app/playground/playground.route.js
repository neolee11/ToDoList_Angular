/**
 * Created by 31611 on 4/30/2015.
 */

(function(){
    'use strict';

    angular.module('app.playground')
        .config(configRoutes);

    /* @ngInject */
    function configRoutes($stateProvider) {

        $stateProvider.state('playground',
            {
                url: "/",
                templateUrl: 'app/playground/playground.html',
                controller: 'Playground',
                controllerAs: 'vm',
                title: 'Play Ground'
            }
        );
    }

})();
