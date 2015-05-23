'use strict';
angular.module('puanJaiApp')
  .controller('userPageCtrl', function ($scope, $cookieStore, $http, socket, $stateParams, $location, Auth) {
    $scope.userId = $stateParams.id;
    $scope.usingUser = Auth.getCurrentUser();


    $http.get('/api/users/' + $stateParams.id, {query: {access_token: $cookieStore.get('token') }}).success(function(user){
        $scope.currentUser = user;
        $scope.followed = _.includes($scope.usingUser.following_id, $stateParams.id);
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

    $scope.follow = function(){
      $scope.followed = true;
      $http.put('/api/users/' + $scope.usingUser._id + '/follow/' + $stateParams.id).success(function(usingUser){
        // console.log(usingUser);
      });
    };

    $scope.unfollow = function(){
      $scope.followed = false;
      $http.delete('/api/users/' + $scope.usingUser._id + '/follow/' + $stateParams.id).success(function(usingUser){
        // console.log(currentUser);
      });
    };
    
  });