'use strict';

angular.module('puanJaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('question', {
        url: '/questions/:id',
        templateUrl: 'app/question/question.html',
        controller: 'questionCtrl'
      });
  });