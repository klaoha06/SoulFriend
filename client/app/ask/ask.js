'use strict';

angular.module('puanJaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('ask', {
        url: '/ask',
        templateUrl: 'app/ask/ask.html',
        controller: 'askCtrl'
      });
  });