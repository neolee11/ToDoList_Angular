/**
 * Created by 31611 on 5/25/2015.
 */

(function () {
    'use strict';

    angular.module('app.widgets')
        .directive('pgWelcome', pgWelcome)
        .directive('pgMouseEnter', pgMouseEnter)
        .directive('pgCurrentTime', pgCurrentTime);

    /*@ngInject*/
    function pgWelcome($window) {
        return {
            restrict: "AE",
            link: function(){
                //$window.alert('Welcome');
            },
            template: "<div>Welcome to Play Ground</div>"
        };
    }

    /*@ngInject*/
    function pgMouseEnter() {
        return function(scope, element){
            element.bind('mouseenter', function(){
                console.log('mouse entered');
            });
        };
    }

    /* @ngInject */
    function pgCurrentTime($interval, dateFilter) {
        return {
            restrict: 'E',
            scope: {
                timeFormat: '=timeFormat', //= for direct binding, @ for {{}} binding
                parentPopup: '&'
            },
            link: function(scope, element, attrs){
                //var format,
                var timeoutId;

                function updateTime() {
                    //element.text(dateFilter(new Date(), format));
                    //scope.currTime =  dateFilter(new Date(), scope.format);
                    scope.currTime =  dateFilter(new Date(), scope.timeFormat);
                }

                //scope.$watch(attrs.myCurrentTime, function(value) {
                //    format = value;
                //    updateTime();
                //});

                element.on('$destroy', function() {
                    $interval.cancel(timeoutId);
                });

                // start the UI update process; save the timeoutId for canceling
                timeoutId = $interval(function() {
                    updateTime(); // update DOM
                }, 1000);
            },
            template: "<div>\n\tCurrent time is: {{currTime}} - {{timeFormat}}\n\t<br/>\n\t<input type=\"button\" value=\'Popup\' ng-click=\'parentPopup()\'/>\n</div>"

        };
    }

})();