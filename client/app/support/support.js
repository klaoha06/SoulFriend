'use strict';

angular.module('puanJaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('support', {
        url: '/supportus',
        templateUrl: 'app/support/support.html',
        controller: 'SupportCtrl'
      });
  });