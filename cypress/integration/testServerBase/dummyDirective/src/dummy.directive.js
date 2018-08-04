const template =
    `
    <div>
        <div>Controller overriden value: <b>{{overrideByController}}</b></div>
        <div>injectedName: <b class="red-background">{{injectedName}}</b></div>
    
        <ul> Array values:
            <li ng-repeat="value in injectedArray">
                <span class="big-text">{{value}}</span>
            </li>
        </ul>
    </div>
`;

const directive = {
    controller: 'dummy.controller',
    template: template,
    scope: {
        injectedName: '@',
        injectedArray: '=',
        overrideByController: '='
    }
};


dummyController.$inject = ['$scope'];

function dummyController($scope) {
    $scope.overrideByController = 'controller has overriden';
}

angular.module("app", [])
    .controller('dummy.controller', dummyController)
    .directive("dummyDirective", () => directive);