'use strict';

(() => {
  angular.module('app', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider',($routeProvider, $locationProvider) => {
    $routeProvider
    .when('/directory', {
      template: '<directory></directory>'
    })
    .when('/people', {
      template: '<people></people>'
    })
    .otherwise({
      redirectTo: '/directory'
    });

    $locationProvider.html5Mode(true);
  }]);
})();
