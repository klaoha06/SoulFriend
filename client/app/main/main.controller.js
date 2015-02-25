'use strict';

angular.module('puanJaiApp')
.controller('MainCtrl', function ($scope, $http, socket, Auth, $location, $filter) {
  var orderBy = $filter('orderBy');
  // $scope.awesomeThings = [];

    // Getting Things
    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    //   socket.syncUpdates('thing', $scope.awesomeThings);
    // });

    // Getting Articles
    // if (!$scope.articles) {
    //   $http.get('/api/articles').success(function(articles) {
    //     $scope.articles = articles;
    //     socket.syncUpdates('article', $scope.articles);
    //   });
    // }


    $scope.getLocation = function(input) {
      return $http.get('/api/questions/search', { params: {userInput: input}}).then(function(response){
        return response.data.map(function(item){
          // $scope.asyncSelected = item.obj;
          console.log(item)
          return item;
        });
      });
    };

    $scope.onSelect = function(){
      console.log($scope.asyncSelected);
    };

    // Search Answers
    $scope.$watch('searchInput', function(input){
      if (input){
        $http.get('/api/questions/search', { params: {userInput: input}}).success(function(result) {
          console.log(result);
          $scope.searchResults = orderBy(result, '_score', true);
        });
      }
    });


    if (!$scope.sampleUsers) {
      $http.get('/api/users/sampleusers').success(function(sampleusers) {
        $scope.sampleusers = sampleusers;
      });
    }

    // Getting Questions
    if (!$scope.questions) {
      $http.get('/api/questions').success(function(questions) {
        var order;
        var r;
        $scope.questions = questions;
        $scope.order = function(predicate, reverse) {
          order = predicate;
          r = reverse;
          $scope.questions = orderBy($scope.questions, predicate, reverse);
        };
        $scope.tabs = [
            { title:'ปัญหาใจยอดฮิท', orderBy: 'votes', reverse: true },
            { title:'วางใจล่าสุด', orderBy: 'created', reverse: true }
          ];
        socket.syncUpdates('question', $scope.questions, function(e, item, array){
          $scope.questions = orderBy(array, order, r);
      });
      });
    }

    // $scope.order = function(predicate, reverse) {
    //   $scope.questions = orderBy($scope.questions, predicate, reverse);
    // };
    // $scope.order('votes',true);

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

    $scope.addJai = function(questionId){
      if (Auth.isLoggedIn()){
        var index = _.findIndex($scope.questions,{'_id': questionId});
         $scope.questions[index].jais++;
       $http.post('/api/questions/' + questionId + '/addjai', { _id: questionId });
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )')
      }
    };

     // On leave page
     $scope.$on('$destroy', function () {
      socket.unsyncUpdates('question');
    });


   });
