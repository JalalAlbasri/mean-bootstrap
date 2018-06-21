'use strict';

angular.module('meanApp', [
  'ngRoute',
  'appCtrl'
])
  .config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
    $routeProvider.when('/', {
      templateUrl: 'index.html',
      controller: 'appCtrl',
      controllerAs: 'appCtrl'
    });

    $locationProvider.html5Mode(true);
  }]);

angular.module('meanApp').controller('appCtrl', ['$scope', ($scope) => {
  this.greeting = 'hello world';
}]);
