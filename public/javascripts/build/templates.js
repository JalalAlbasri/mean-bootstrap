'use strict';

angular.module('templates', []).run(['$templateCache', function ($templateCache) {
  $templateCache.put('index.html', '<div class="app"><h1>{{app.greeting}}</h1></div>');
}]);