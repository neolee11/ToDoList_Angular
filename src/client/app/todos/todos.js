/**
 * Created by 31611 on 4/30/2015.
 */

(function(){
    'use strict';

    angular.module('app.todos')
        .controller('Todos', Todos);

    /* @ngInject */
    function Todos() {
        var vm = this;
        vm.content = 'To Dos';
    }

})();