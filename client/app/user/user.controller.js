'use strict';
angular.module('puanJaiApp')
  .controller('userPageCtrl', function ($scope, $cookieStore, $http, socket, $stateParams, $location) {
    $scope.userId = $stateParams.id;

    $http.get('/api/users/' + $stateParams.id, {query: {access_token: $cookieStore.get('token') }}).success(function(user){
        $scope.currentUser = user;
    });

    $http.get('/api/questions', { params: { filterBy: { ownerId: $scope.userId}}}).success(function(questions){
        $scope.myQuestions = questions;
    });

    // Go to
    $scope.goTo = function(url){
      $location.path(url);
    };

    $scope.onSelectCategory = function(category){
        switch(category){
            case 'myQuestions':
                $http.get('/api/questions', { params: { filterBy: { ownerId: $scope.userId, anonymous: false}}}).success(function(questions){
                    $scope.myQuestions = questions;
                });
                break;
            case 'myAnswersInQuestions':
                $http.get('/api/questions/myanswers', { params: {userId: $scope.userId}}).success(function(questions){
                    $scope.myAnswersInQuestions = questions;
                });
                break;
            default:
                $http.get('/api/questions', { params: { filterBy: { ownerId: $scope.userId, anonymous: false}}}).success(function(questions){
                    $scope.myQuestions = questions;
                });
        }
    };
    
  });