(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('Shell', Shell);

    Shell.$inject = ['config'];
    function Shell(config) {
        var vm = this;

        vm.title = config.appTitle;
    }
})();
