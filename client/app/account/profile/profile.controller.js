'use strict';

angular.module('puanJaiApp')
  .controller('profileCtrl', function ($scope, $http, socket, $stateParams, Auth, $cookieStore, User, $location) {
    if($cookieStore.get('token')) {
        $scope.currentUser = User.get();
    }
    $scope.userId = localStorage.getItem('userId');

    if (localStorage.getItem('userId')) {    
        $http.get('/api/questions', { params: { filterBy: { ownerId: $scope.userId}}}).success(function(questions){
            $scope.myQuestions = questions;
        });
    }

    // Go to
    $scope.goTo = function(url){
      $location.path(url);
    };

    $scope.onSelectCategory = function(category){
        switch(category){
            case 'myQuestions':
                $http.get('/api/questions', { params: { filterBy: { ownerId: $scope.userId}}}).success(function(questions){
                    $scope.myQuestions = questions;
                });
                break;
            case 'myArticles':
                $http.get('/api/articles', { params: { filterBy: { ownerId: $scope.userId}}}).success(function(articles){
                    $scope.myArticles = articles;
                });
                break;
            case 'myAnswersInQuestions':
                $http.get('/api/questions/myanswers', { params: {userId: $scope.userId}}).success(function(questions){
                    $scope.myAnswersInQuestions = questions;
                });
                break;
            case 'myBooks':
                $http.get('/api/books', { params: {userId: $scope.userId}}).success(function(mybooks){
                    $scope.myBooks = mybooks;
                });
                break;
            default:
                $http.get('/api/questions', { params: { filterBy: { ownerId: $scope.userId}}}).success(function(questions){
                    $scope.myQuestions = questions;
                });
        }
    };
  });