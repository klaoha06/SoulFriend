'use strict';

angular.module('puanJaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('singleArticle', {
        url: '/articles/:id',
        templateUrl: 'app/article/singleArticle/singleArticle.html',
        controller: 'articleCtrl'
      });
  });