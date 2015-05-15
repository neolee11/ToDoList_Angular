(function() {
    'use strict';

    var core = angular.module('app.core');

    var config = {
        appTitle: 'To Do List',
        version: '1.0.0'
    };

    core.value('config', config);
})();
