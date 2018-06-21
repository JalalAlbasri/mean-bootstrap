'use strict';

angular.module('meanApp', [
  'ngRoute',
  'templates'
])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: 'index.html',
      controller: 'appCtrl',
      controllerAs: 'app'
    });

    $locationProvider.html5Mode(true);
  }]).controller('appCtrl', ['$scope', function ($scope) {
    this.greeting = 'hello world';
  }]);
