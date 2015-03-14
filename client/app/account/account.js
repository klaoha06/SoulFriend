'use strict';

angular.module('puanJaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
    .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
    .state('settings', {
      url: '/settings',
      templateUrl: 'app/account/settings/settings.html',
      controller: 'SettingsCtrl',
      authenticate: true
    })
    .state('users', {
      url: '/users/:id',
      templateUrl: 'app/account/users/user.html',
      controller: 'userCtrl'
    });
  });