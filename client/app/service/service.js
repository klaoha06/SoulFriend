'use strict';

angular.module('puanJaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('service', {
        url: '/service',
        templateUrl: 'app/service/service.html',
        controller: 'serviceCtrl'
      });
  });