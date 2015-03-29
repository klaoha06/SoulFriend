'use strict';

angular.module('puanJaiApp')
  .controller('articleCtrl', function ($scope, $http, socket, $stateParams, Auth, $location, $window, Facebook) {
    $scope.windowHeight = $window.innerHeight -100;
    var userId = localStorage.getItem('userId');
    var articleId;

    // Getting the Article

    $http.get('/api/articles/' + $stateParams.id).success(function(article) {
      $scope.article = article;
      articleId = article._id;
      socket.syncUpdates('article', $scope.article, function(event, oldArticle, newArticle){
        $scope.article = newArticle;
      });
    });    

    $http.get('/api/articles').success(function(articles) {
      $scope.articles = articles;
    });

    $scope.shareFB = function(url){
      Facebook.ui({
        method: 'share',
        href: url, function(res){
          console.log(res);
        }
      });
    };

    $scope.upVote = function(){
      if (Auth.isLoggedIn()){
          if (_.include($scope.article.upvotes, userId)) {
            alert('คุณได้ให้โหวตแล้ว');
            return;
          } else {
           $scope.article.votes_count++;
           $scope.article.upvotes.push(userId);
           $http.post('/api/articles/' + articleId + '/upvote', { _articleId: articleId, userId: userId });
          }
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');
      }
    };

    $scope.downVote = function(){
      if (Auth.isLoggedIn()){
          if (_.include($scope.article.downvotes, userId)) {
            alert('คุณได้ให้โหวตแล้ว');
            return;
          } else {
           $scope.article.votes_count--;
           $scope.article.downvotes.push(userId);
           $http.post('/api/articles/' + articleId + '/downvote', { _articleId: articleId, userId: userId });
          }
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');
      }
    };

    $scope.report = function(){
      if (Auth.isLoggedIn()){
          if (_.include($scope.article.reports, userId)) {
            alert('คุณได้รายงานความไม่เหมาะสมแล้ว');
            return;
          } else {
            $scope.article.reports.push(userId);
           $http.post('/api/articles/' + articleId + '/report', { _articleId: articleId, userId: userId }).success(function(err, res){
            alert('ขอบคุณที่ช่วยรายงานความไม่เหมาะสมครับ')
           });
          }
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');
      }
    };


    $scope.upVoteComment = function(commentUserId){
      var index = _.findIndex($scope.article.comments,{'user_id': commentUserId});
      var currentAns = $scope.article.comments[index];
      if (Auth.isLoggedIn()){
          if (_.include(currentAns.upvotes, userId)) {
            alert('คุณได้ให้โหวตแล้ว');
            return;
          } else {
            $scope.article.comments[index].votes_count++;
            $scope.article.comments[index].upvotes.push(userId);
           $http.patch('/api/articles/' + $stateParams.id, $scope.article).success(function(res) {
            // console.log(res);
           });
          }
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');
      }
    };

    $scope.downVoteComment = function(commentUserId){
      var index = _.findIndex($scope.article.comments,{'user_id': commentUserId});
      var currentAns = $scope.article.comments[index];
      if (Auth.isLoggedIn()){
          if (_.include(currentAns.downvotes, userId)) {
            alert('คุณได้ให้โหวตแล้ว');
            return;
          } else {
            $scope.article.comments[index].votes_count--;
            $scope.article.comments[index].downvotes.push(userId);
           $http.patch('/api/articles/' + $stateParams.id, $scope.article).success(function(res) {
            console.log(res);
           });
          }
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');
      }
    };


    $scope.addComment = function() {
      if(typeof $scope.newComment === 'undefined' || $scope.newComment.length <= 5) {
        return;
      }
      if (Auth.isLoggedIn()) {
        var user = Auth.getCurrentUser();
        var newComment = { 
          content: $scope.newComment,
          user: {
            username: user.username,
            name: user.name,
            _id: user._id,
            coverimg: user.coverimg
          },
          created: Date.now()
        };
        $scope.article.comments.push(newComment);
        $http.post('/api/articles/' +  $stateParams.id + '/comments', newComment);
        $scope.newComment = '';
      } else {
        $location.path('/login');
        alert('กรุณาเข้าสู้ระบบก่อนเข้าร่วมการสนทนา')
      }
    };

     // On leave page
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('article');
    });
  });