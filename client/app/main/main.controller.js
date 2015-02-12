'use strict';

angular.module('puanJaiApp')
.controller('MainCtrl', function ($scope, $http, socket) {
  $scope.awesomeThings = [];

    // Getting Things
    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    //   socket.syncUpdates('thing', $scope.awesomeThings);
    // });

    // Getting Articles
    if (!$scope.articles) {
      $http.get('/api/articles').success(function(articles) {
        $scope.articles = articles;
        socket.syncUpdates('article', $scope.articles);
      });
    }

    if (!$scope.sampleUsers) {
      $http.get('/api/users/sampleusers').success(function(sampleusers) {
        $scope.sampleusers = sampleusers;
        socket.syncUpdates('article', $scope.sampleusers);
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

    
    $scope.setCurrentSlide = function(){
      var indicators = document.getElementsByClassName('carousel-indicators')[0].children;
      if (indicators.length === 5) {
        for (var i = 0; i < $scope.sampleusers.length; i++) {
          var cssString = "background-size: cover; background-image: url('" + $scope.sampleusers[i].coverimg + "');";
          indicators[i].style.cssText = cssString;

          // if (indicators[i].className === 'ng-scope active') {
          //   indicators[i].className = indicators[i].className + " animated pulse";
          // } else {
          //   indicators[i].className = indicators[i].className.replace(" animated pulse", "")
          // }

        }
      }

    };

     // On leave page
     $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });


   });
