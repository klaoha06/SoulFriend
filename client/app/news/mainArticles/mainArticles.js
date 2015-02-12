'use strict';

angular.module('puanJaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mainArticles', {
        url: '/news',
        templateUrl: 'app/news/mainArticles/mainArticles.html',
        controller: 'MainArtCtrl'
      });
  });