/**
 * Created by 31611 on 4/30/2015.
 */

(function(){
    'use strict';

    angular.module('app.playground')
        .controller('Playground', Playground);

    /* @ngInject */
    function Playground($state, taskManagerService, pgCalcService, pgGetDataService, $window, $q, $http) {
        var vm = this;

        vm.showNav = true;
        vm.showInvoice = false;
        vm.showDifferentInputs = false;
        vm.showList = false;
        vm.showSelection = false;
        vm.showTable = false;

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

        vm.createStep = function (taskTxt) {
            taskManagerService.createStep(taskTxt);
            //taskManagerService.createStepTwice(taskTxt);
            $state.go('task');
        };

        vm.doubleVal = function(input){
            return pgCalcService.double(input);
        };

        vm.asynVal = 0;
        vm.runAsync = function(){
            var success = function(data){
                //vm.asynVal = data;
                //return data;
                return $q.when(data);
            };

            var failure = function(data){
                vm.asynVal = data;
                $window.alert('Get data failed - got ' + data);
                return $q.reject(data);
            };

            var notify = function(updateMsg){
                console.log(updateMsg);
            }

            var roundUpResult = function(data){
                console.log("In roundup result");
                vm.asynVal = Math.round(data);
            };

            var cleanup = function(){
                console.log('Data retrieval finished');
            };

            var promise = pgGetDataService()
                .then(success, null, notify) //then(success, failure, notify)
                .then(roundUpResult)
                .catch(failure)
                .finally(cleanup);
        };

        vm.asyncAllResult = '';
        vm.runAsyncAll = function(){
            var first = $http.get('http://forefront.azurewebsites.net/'),
                second = $http.get('http://www.yahoo.com');

            $q.all(first, second).then(function(result){
                var tmp = [];
                angular.forEach(result, function(response) {
                    tmp.push(response.data);
                });
                return tmp;
            }).then(function(tmpResult) {
                vm.asyncAllResult = tmpResult.join(", ");
            });
        };

        vm.timeFormat = 'M/d/yy h:mm:ss a';

        vm.myPopup = function(){
            $window.alert("Popup from parent");
        };

        vm.columnContent = "a;lsdfjasdl;fj lasdjf asdfladslfj asfasdlflflsdjalf jlsadflaslf lsadlf jlasflsafjldfjlsjl;fjlasdjfl jlasdj fasdf lasjlfjasdlfjadlsf";
    }

    var model = [
            {first: 'daniel', last: 'li'},
            {first: 'john', last: 'fisk'}
    ];

})();