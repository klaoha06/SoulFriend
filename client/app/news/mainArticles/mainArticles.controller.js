'use strict';

angular.module('puanJaiApp')
  .controller('MainArtCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];
    // var location = $location;
    // debugger;
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
      window.location='/articles/' + event.currentTarget.id;
    };


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

angular.module('puanJaiApp').directive('backImg', function(){
return function(scope, element, attrs){
    var articleId = attrs.id;
    element.css({
        'background-image': 'url(' + attrs.backImg +')',
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
    //   debugger;
    // });
  };
});

// angular.module('puanJaiApp').directive('myarticle', function() {
//   return {
//     restrict: 'AE',
//     replace: true,
//     template: '<a ng-href="/login"><div class="thumbnail" " id="{{article._id}}"><div class="caption"><h3>{{article.name}}</h3><p>{{article.summary}}</p><p><a href="#" class="btn btn-primary" role="button" ng-click="openModal()">Comment</a> <a href="#" class="btn btn-default" role="button">Read More</a></p></div></div></a>',
//     link: function(scope, elem, attrs) {
//       elem.bind('click', function() {
//         elem.css('background-color', 'black');
//         scope.$apply(function() {
//           scope.color = "black";
//         });
//       });
//       elem.bind('mouseover', function() {
//         elem.css('cursor', 'pointer');
//       });
//     }
//   };
// });
