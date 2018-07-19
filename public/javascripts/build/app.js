'use strict';

angular.module('meanApp', ['ngRoute', 'templates']).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'index.html',
    controller: 'appCtrl',
    controllerAs: 'app'
  });

  $locationProvider.html5Mode(true);
}]).controller('appCtrl', ['$scope', '$http', function ($scope, $http) {
  var _this = this;

  console.log('appCtrl');
  this.greeting = 'gaymes minecraft';
  this.serverState = '';

  $http.get('/aws/describe').then(function (res) {
    console.log('describe res: ' + JSON.stringify(res));
    _this.serverState = res.data.data.Reservations[0].Instances[0].State.Name;
    _this.serverRunning = res.data.data.Reservations[0].Instances[0].State.Name === 'running';
  }, function (err) {
    console.log('describe err: ' + JSON.stringify(err));
  });

  this.startServer = function () {
    console.log('start server');
    $http.get('/aws/start').then(function (res) {
      console.log('describe res: ' + JSON.stringify(res));
    });
  };

  this.stopServer = function () {
    console.log('stop server');
    $http.get('/aws/stop').then(function (res) {
      console.log('describe res: ' + JSON.stringify(res));
    });
  };
}]);