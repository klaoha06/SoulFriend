'use strict';

angular.module('puanJaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tags', {
        url: '/tags',
        templateUrl: 'app/tag/tags/tags.html',
        controller: 'tagsCtrl'
      });
  });