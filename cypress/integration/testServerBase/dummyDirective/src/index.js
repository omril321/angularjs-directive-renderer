angular.module('app', []);

const addStatefulDirectiveElement = () => {
    const statefulDirective = {
        controller: 'stateful.controller',
        template: `<div id="counter-value">counter: {{getCounter()}}</div>`,
        restrict: 'E',
        scope: false
    };


    statefulDirectiveController.$inject = ['$scope', 'counterService'];

    function statefulDirectiveController($scope, counterService) {
        counterService.increaseCounter();

        $scope.getCounter = counterService.getCounter;
    }

    function counterService() {
        let counter = 0;

        this.getCounter = () => counter;

        this.increaseCounter = () => {
            counter += 1;
        }
    }

    angular.module('app', [])
        .service('counterService', counterService)
        .controller('stateful.controller', statefulDirectiveController)
        .directive('statefulDirective', () => statefulDirective);

};


const addDummyDirectiveModule = () => {
    const template =
        `
            <div>
                <div>Controller overriden value: <b>{{overrideByController.value}}</b></div>
                <div>injectedName: <b class="red-background">{{injectedName}}</b></div>
            
                <ul> Array values:
                    <li ng-repeat="value in injectedArray">
                        <span class="big-text">{{value}}</span>
                    </li>
                </ul>
                
                <div id="dummy-elem-counter">dummy element counter: {{getCounter()}}</div>
            </div>
        `;

    const directive = {
        controller: 'dummy.controller',
        template: template,
        restrict: 'E',
        scope: {
            injectedName: '@',
            injectedArray: '=',
            overrideByController: '='
        }
    };


    dummyController.$inject = ['$scope', 'counterService'];

    function dummyController($scope, counterService) {
        counterService.increaseCounter();
        counterService.increaseCounter();
        counterService.increaseCounter();

        $scope.overrideByController.value = 'controller has overriden';
        $scope.injectedArray.push('is', 'updated');
        $scope.addedValue = $scope.injectedName + ', with some added value';

        $scope.getCounter = counterService.getCounter;
    }

    angular.module('app')
        .controller('dummy.controller', dummyController)
        .directive('dummyDirective', () => directive);
};


addStatefulDirectiveElement();
addDummyDirectiveModule();