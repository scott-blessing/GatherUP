angular
  .module('gatherUPApp', ['ngRoute', 'ui.bootstrap', 'ngAutocomplete'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'Views/Main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      })
  });
  
