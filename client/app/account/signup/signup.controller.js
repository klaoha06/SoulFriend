'use strict';

angular.module('puanJaiApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: {
            first:$scope.user.firstname,
            last:$scope.user.lastname,
          },
          email: $scope.user.email,
          password: $scope.user.password,
          reason: $scope.user.reason,
          // summary: $scope.user.summary,
          username: $scope.user.username
        })
        .then( function(res) {
          console.log(res)
          // Account created, redirect to home
          $location.path('/');
          $window.location.reload();
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
