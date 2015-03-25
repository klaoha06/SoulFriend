'use strict';

angular.module('puanJaiApp')
  .controller('tagsCtrl', function ($scope, $http, socket, $location, $window) {
    // $scope.awesomeThings = [];
    // var location = $location;
    // debugger;
    
    // Getting Things
    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    //   socket.syncUpdates('thing', $scope.awesomeThings);
    // });

    // // Getting Articles
    if (!$scope.articles) {
      $http.get('/api/articles').success(function(articles) {
        $scope.articles = articles;
        // articleStore.set(articles);
        // localStorage.set('articles', articles);
        socket.syncUpdates('article', $scope.articles);
      });
    }

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

    $scope.goToArticle = function(){
      $location.path('/articles/' + event.currentTarget.id);
    };


    // Slider
  $scope.slides = [
  {
    image: 'http://lorempixel.com/1900/300/animals',
    text:'hi'
  },
  {
    image: 'http://lorempixel.com/1600/300/animals',
    text:'yo'
  },
  {
    image: 'http://lorempixel.com/1400/300/animals',
    text:'bye'
  },
  {
    image: 'http://lorempixel.com/1000/300/animals',
    text:'love u'
  }
  ];

     // On leave page
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('article');
    });

  });

angular.module('puanJaiApp').directive('article', function(){
return function(scope, element, attrs){
    var articleId = attrs.id;
    element.css({
        'background-image': 'url(' + attrs.article +')',
        'background-size' : 'cover'
    });
    element.bind('mouseover', function(){
      element.css({'border': '9px solid white'});
      element.css('cursor', 'pointer');
    });
    element.bind('mouseleave', function(){
      element.css({'border': '0'});
    });
    // element.bind('click', function(e){
    //   $location.path('/articles/' + e.target.id);
    // });
  };
});
