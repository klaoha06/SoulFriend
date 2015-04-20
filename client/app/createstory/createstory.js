'use strict';

angular.module('puanJaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('createbook', {
        url: '/createbook',
        templateUrl: 'app/createbook/createbook.html',
        controller: 'createBookCtrl'
      });
  });