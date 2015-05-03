'use strict';

angular.module('puanJaiApp')
  .controller('tagCtrl', function ($scope, $http, $stateParams, Auth, $location) {
    $scope.showQuestions = true;
    // $scope.showArticles = false;
    $scope.skip = 0;
    $scope.tagQuestions = [];
    // $scope.tagArticles = [];

    function getQuestionsFromTag() {
      var questionsToChunk = _.chunk($scope.tag.questions_id,10);
      var questionsToQuery = questionsToChunk[$scope.skip];
      if (questionsToChunk.length <= $scope.skip) {
        // alert('ไม่มีคําถามในแท็กนี้แล้วครับ');
        return;
      }
      $http.get('/api/tags/' + $stateParams.id + '/questions', {params: {questions: questionsToQuery, skip: $scope.skip}}).success(function(questions){
          $scope.tagQuestions = $scope.tagQuestions.concat(questions);
      // socket.syncUpdates('article', $scope.article, function(event, oldArticle, newArticle){
      //   $scope.article = newArticle;
      // });
      });
    }

    // function getArticlesFromTag() {
    //   var articlesToChunk = _.chunk($scope.tag.articles_id,10);
    //   var articlesToQuery = articlesToChunk[$scope.skip];
    //   if (articlesToChunk.length <= $scope.skip) {
    //     // alert('ไม่มีบทความในแท็กนี้แล้วครับ');
    //     return;
    //   }
    //   $http.get('/api/tags/' + $stateParams.id + '/articles', {params: {articles: articlesToQuery}}).success(function(articles){
    //       $scope.tagArticles = $scope.tagArticles.concat(articles);
    //   // socket.syncUpdates('article', $scope.article, function(event, oldArticle, newArticle){
    //   //   $scope.article = newArticle;
    //   // });
    //   });
    // }

    $http.get('/api/tags/' + $stateParams.id).success(function(tag) {
      $scope.tag = tag;
      getQuestionsFromTag();
    });

    $scope.getMore = function(){
      $scope.skip = $scope.skip + 1;
      // if ($scope.showArticles) {
      //   getArticlesFromTag();
      // }
      if ($scope.showQuestions) {
        getQuestionsFromTag();
      }
    };

    // $scope.onSelectCategory = function(category){
    //   $scope.skip = 0;
    //     switch(category){
    //         case 'tagQuestions':
    //           $scope.showQuestions = true;
    //           $scope.showArticles = false;
    //           getQuestionsFromTag();
    //             break;
    //         case 'tagArticles':
    //           $scope.showQuestions = false;
    //           $scope.showArticles = true;
    //           getArticlesFromTag();
    //             break;
    //         default:
    //           getQuestionsFromTag();
    //     }
    // };

    $scope.goTo = function(url){
      if (Auth.isLoggedIn()) {
        $location.path(url);
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');;
      }
    };

  });