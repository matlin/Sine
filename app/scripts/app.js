'use strict';

/**
 * @ngdoc overview
 * @name sineApp
 * @description
 * # sineApp
 *
 * Main module of the application.
 */
SC.initialize({
  client_id: 'ddd8d3a316d38bb2e0853693e57781f6',
    redirect_uri: 'http://www.sinelib.com/callback.html'
});

Parse.initialize("CfpgiSfkCaG8QqoL7A0OtIkoOFXnnWu0SKzYPUYb", "lRCjgPzcfL8mNIbPZS56wXmc2W8Hdw4lmCF6uACg");


angular
  .module('sineApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'Login',
      })
    	.when('/user/:userID', {
        templateUrl: 'views/library.html',
        controller: 'songList'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).filter('highlight', function($sce) {
    return function(text, phrase) {
      if (phrase) text = text.replace(new RegExp('('+phrase+')', 'gi'),
        '<span class="highlighted">$1</span>')

      return $sce.trustAsHtml(text)
    }
});
