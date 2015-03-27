angular
  .module('gatherUPApp', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'Views/Home.html',
        controller: 'HomeCtrl'
      })
      .when('/event', {
        templateUrl: 'Views/Event.html',
        controller: 'EventCtrl'
      })
      .otherwise({
        redirectTo: '/'
      })
  });