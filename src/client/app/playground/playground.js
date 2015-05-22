/**
 * Created by 31611 on 4/30/2015.
 */

(function(){
    'use strict';

    angular.module('app.playground')
        .controller('Playground', Playground);

    /* @ngInject */
    function Playground() {
        var vm = this;
        vm.btnVal = 'Mod DOM';

        vm.btnClick = function(){
            angular.element('#elTest').append("<span>asd;fljadk</span>");
        };

        vm.qty = 1;
        vm.cost = 2;

        vm.colors = ['Red', 'Green', 'Blue'];
        vm.selColor = 'Green';

        vm.numSubmitted = 0;
        vm.submit = function () {
            vm.numSubmitted++;
        };

        vm.someTxt = "";
        vm.toLower = function(){
            vm.someTxt = angular.lowercase(vm.someTxt);
        };

        vm.toJson = function () {
            vm.jsonModel = angular.toJson(model);
        };

        vm.myModel = model;
    }

    var model = [
            {first: 'daniel', last: 'li'},
            {first: 'john', last: 'fisk'}
    ];

})();