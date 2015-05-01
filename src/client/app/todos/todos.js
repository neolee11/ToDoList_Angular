/**
 * Created by 31611 on 4/30/2015.
 */

(function(){
    'use strict';

    angular.module('app.todos')
        .controller('Todos', Todos);

    //Task.$inject = ['$scope'];

    /* @ngInject */
    function Todos($scope) {
        $scope.content = 'To Dos';
    }

})();