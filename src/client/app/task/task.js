/**
 * Created by 31611 on 4/30/2015.
 */

(function(){
    'use strict';

    angular.module('app.task')
        .controller('Task', Task);

    //Task.$inject = ['$scope'];

    /* @ngInject */
    function Task($scope) {
        $scope.someVal = 'hello world';

        $scope.btnClick = function(){
            alert("clicked");
        }
    }

})();