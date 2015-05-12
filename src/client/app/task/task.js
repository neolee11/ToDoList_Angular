/**
 * Created by 31611 on 4/30/2015.
 */

(function(){
    'use strict';

    angular.module('app.task')
        .controller('Task', Task);

    /* @ngInject */
    function Task() {
        var vm = this;
        vm.someVal = 'hello world';

        vm.btnClick = function(){
            window.alert('clicked');
        };
    }

})();