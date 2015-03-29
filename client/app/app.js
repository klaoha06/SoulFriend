'use strict';

angular.module('puanJaiApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'yaru22.angular-timeago',
  'textAngular',
  'ngTagsInput',
  'angular-jqcloud',
  'headroom',
  'angulartics',
  'angulartics.google.analytics',
  'facebook'])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, FacebookProvider) {
    $urlRouterProvider
      .otherwise('/');
    $httpProvider.interceptors.push('authInterceptor');
    $locationProvider.html5Mode(true).hashPrefix('!');
    FacebookProvider.init('816905961709405');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          alert('กรุณาเข้าระบบก่อนนะครับ :)');
          $location.path('/login');
        }
      });
    });
    $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
        $window.scrollTo(0, 0);
    });

  });
