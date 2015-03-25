'use strict';

angular.module('puanJaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user', {
        url: '/users/:id',
        templateUrl: 'app/user/user.html',
        controller: 'userPageCtrl'
      });
  });