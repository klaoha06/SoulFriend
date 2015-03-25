'use strict';
angular.module('puanJaiApp')
  .controller('userPageCtrl', function ($scope, $http, socket, $stateParams) {
    $http.get('/api/users/' + $stateParams.id).success(function(user){
        $scope.currentUser = user;
        $scope.userId = $scope.currentUser._id;
        $http.get('/api/questions', { params: { filterBy: { ownerId: $scope.userId}}}).success(function(questions){
            $scope.myQuestions = questions;
        });

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
                default:
                    $http.get('/api/questions', { params: { filterBy: { ownerId: $scope.userId}}}).success(function(questions){
                        $scope.myQuestions = questions;
                    });
            }
        };
    });

    //  // On leave page
    // $scope.$on('$destroy', function () {
    //   socket.unsyncUpdates('question');
    // });
  });