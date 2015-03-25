'use strict';

angular.module('puanJaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tag', {
        url: '/tags/:id',
        templateUrl: 'app/tag/tag/tag.html',
        controller: 'tagCtrl'
      });
  });