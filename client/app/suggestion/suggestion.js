'use strict';

angular.module('puanJaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('suggestion', {
        url: '/suggestion',
        templateUrl: 'app/suggestion/suggestion.html',
        controller: 'suggestCtrl'
      });
  });