'use strict';

angular.module('puanJaiApp')
  .controller('articleCtrl', function ($scope, $http, socket, $stateParams, Auth, $location) {
    $scope.awesomeThings = [];
    // var location = $location;
    // debugger;
    // Getting Things
    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    //   socket.syncUpdates('thing', $scope.awesomeThings);
    // });
    // Getting Articles
    $http.get('/api/articles/' + $stateParams.id).success(function(article) {
      $scope.article = article;
      socket.syncUpdates('article', $scope.article);
    });

    $http.get('/api/articles').success(function(articles) {
      $scope.articles = articles;
      socket.syncUpdates('article', $scope.articles);
    });

    $scope.addComment = function() {
      if($scope.newComment === '') {
        return;
      }
      if (Auth.isLoggedIn()) {
        var user = Auth.getCurrentUser();
        $http.post('/api/articles/' +  $stateParams.id + '/comments', { 
          content: $scope.newComment,
          user: {
            username: user.username,
            name: user.name,
            _id: user._id,
            coverimg: user.coverimg
          },
          createAt: Date.now()
        }).success(function(comments){
          $scope.article.comments = comments;
        });
        $scope.newComment = '';
      } else {
        $location.path('/login');
        alert('กรุณาเข้าสู้ระบบก่อนเข้าร่วมการสนทนา')
      }
    };

    // $scope.deleteThing = function(thing) {
    //   $http.delete('/api/things/' + thing._id);
    // };


    // Slider
    $scope.myInterval = 3000;
     var slides = $scope.slides = [];
     $scope.addSlide = function() {
       var newWidth = 850 + slides.length + 1;
       slides.push({
         image: 'http://placekitten.com/' + newWidth + '/300',
         text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
           ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
       });
     };
     for (var i=0; i<4; i++) {
       $scope.addSlide();
     }

     // On leave page
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });