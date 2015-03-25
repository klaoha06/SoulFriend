'use strict';

angular.module('puanJaiApp')
  .controller('tagCtrl', function ($scope, $http, $stateParams, Auth, $location) {
    $scope.showQuestions = true;
    $scope.showArticles = false;
    $scope.skip = 0;

    $http.get('/api/tags/' + $stateParams.id).success(function(tag) {
      $scope.tag = tag;
      $http.get('/api/tags/' + $stateParams.id + '/questions').success(function(questions){
          $scope.tagQuestions = questions;
      // socket.syncUpdates('article', $scope.article, function(event, oldArticle, newArticle){
      //   $scope.article = newArticle;
      // });
      });
    });

    $scope.resetSkip = function(){
      $scope.skip = 0;
    };

    $scope.getMore = function(){
      $scope.skip++;
      $http.get('/api/tags/' + $stateParams.id + '/questions', {params: {skip: $scope.skip}}).success(function(questions){
          $scope.tagQuestions = questions;
      // socket.syncUpdates('article', $scope.article, function(event, oldArticle, newArticle){
      //   $scope.article = newArticle;
      // });
      });
    };

    $scope.onSelectCategory = function(category){
      $scope.resetSkip();
        switch(category){
            case 'tagQuestions':
              $scope.showQuestions = true;
              $scope.showArticles = false;
              $http.get('/api/tags/' + $stateParams.id + '/questions').success(function(questions){
                  $scope.tagQuestions = questions;
              });
                break;
            case 'tagArticles':
              $scope.showQuestions = false;
              $scope.showArticles = true;
              $http.get('/api/tags/' + $stateParams.id + '/articles').success(function(articles){
                  $scope.tagArticles = articles;
              });
                break;
            default:
              $http.get('/api/tags/' + $stateParams.id + '/questions').success(function(questions){
                  $scope.tagQuestions = questions;
              });
        }
    };

    $scope.goTo = function(url){
      if (Auth.isLoggedIn()) {
        $location.path(url);
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');;
      }
    };

     // On leave page
    // $scope.$on('$destroy', function () {
    //   socket.unsyncUpdates('article');
    // });
  });