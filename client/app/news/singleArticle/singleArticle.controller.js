'use strict';

angular.module('puanJaiApp')
  .controller('articleCtrl', function ($scope, $http, socket, $stateParams, Auth, $location, $window) {
    $scope.windowHeight = $window.innerHeight -100;
    // Getting the Article

    $http.get('/api/articles/' + $stateParams.id).success(function(article) {
      $scope.article = article;
      socket.syncUpdates('article', $scope.article, function(event, oldArticle, newArticle){
        $scope.article = newArticle;
      });
    });    


    $http.get('/api/articles').success(function(articles) {
      $scope.articles = articles;
    });

    $scope.addComment = function() {
      // debugger;
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


    // $scope.addThing = function() {
    //   if($scope.newThing === '') {
    //     return;
    //   }
    //   $http.post('/api/things', { name: $scope.newThing });
    //   $scope.newThing = '';
    // };

    // $scope.deleteThing = function(thing) {
    //   $http.delete('/api/things/' + thing._id);
    // };

     // On leave page
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('article');
    });
  });