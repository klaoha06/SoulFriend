'use strict';

angular.module('puanJaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mainArticles', {
        url: '/articles',
        templateUrl: 'app/article/mainArticles/mainArticles.html',
        controller: 'MainArtCtrl'
      });
  });