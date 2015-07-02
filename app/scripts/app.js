'use strict';

/**
 * @ngdoc overview
 * @name pruebaQubodmApp
 * @description
 * # pruebaQubodmApp
 *
 * Main module of the application.
 */
angular
  .module('pruebaQubodmApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'ngMdIcons',
    'ng-context-menu',
    'ngFileUpload',
    // 'angularTreeview',
    'pascalprecht.translate',
    'localize'
  ])
  .config(function ($routeProvider,$translateProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/divGrande', {
        templateUrl: 'views/divgrande.html',
        controller: 'DivgrandeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

      $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/locale-',
        suffix: '.json'
      });

      $translateProvider.preferredLanguage('es');
      $translateProvider.useSanitizeValueStrategy('escaped');

  });
