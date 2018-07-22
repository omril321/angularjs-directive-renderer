import angular from "angular"

const directive = {
    controller: 'dummy.controller',
    template: require('./dummy.html'),
    scope: {
        injectedName: '@',
        injectedArray: '=',
        overrideByController: '='
    }
};

angular.module("app").directive("dummyDirective", () => directive);