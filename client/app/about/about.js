'use strict';

angular.module('puanJaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('about', {
        url: '/about',
        templateUrl: 'app/about/about.html',
        controller: 'AboutCtrl'
      })
      .state('aboutcreator', {
          url: '/aboutcreator',
          templateUrl: 'app/about/aboutcreator.html',
          controller: 'AboutCreatorCtrl'
      });
  });