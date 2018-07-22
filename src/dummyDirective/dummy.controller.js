import angular from "angular";

dummyController.$inject = ['$scope'];

function dummyController($scope) {

    $scope.overrideByController = 'controller has overriden';
}


angular.module('app').controller('dummy.controller', dummyController);
