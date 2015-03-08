'use strict';

angular.module('puanJaiApp')
.controller('LandingCtrl', function ($scope, $http, socket, $state, Auth, $window) {
    
    // Slider
    $scope.myInterval = 5000;
     var slides = $scope.slides = [];
     $scope.addSlide = function() {
       var newWidth = 1360 + slides.length + 1;
       slides.push({
         image: 'http://placekitten.com/' + newWidth + '/500',
         lead: ['ชุมชนเพื่อช่วยเหลือจิตใจของกันและกัน','สร้างด้วยใจและความรักต่อส่วนรวม','ศูนย์กลางในการเผยแผ่ปัญญาสู่ความสุข'][slides.length % 3],
         text: ['มารู้จักเรา','มารู้จักกับผู้ริเริ่ม','สมัครเป็นนักเขียนเพื่อนใจ'][slides.length % 3]
       });
     };
     for (var i=0; i<3; i++) {
       $scope.addSlide();
     }

     // Login with FB
     $scope.loginOauth = function(provider) {
       $window.location.href = '/auth/' + provider;
     };

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

    // // Getting Questions
    // if (!$scope.questions) {
    //   $http.get('/api/questions').success(function(questions) {
    //     $scope.questions = questions;
    //     var sortByDate = _.map(_.sortBy(questions, 'created'));
    //     var sortByVote = _.map(_.sortBy(questions, 'votes')).reverse();
    //     $scope.tabs = [
    //         { title:'วางใจล่าสุด', content: sortByDate },
    //         { title:'ปัญหาใจยอดฮิท', content: sortByVote }
    //       ];

    //     socket.syncUpdates('question', $scope.questions);
    //   });
    // }

    // if (!$scope.sampleUsers) {
    //   $http.get('/api/users/sampleusers').success(function(sampleusers) {
    //     $scope.sampleusers = sampleusers;
    //   });
    // }

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

    
    // $scope.setCurrentSlide = function(){
    //   var indicators = document.getElementsByClassName('carousel-indicators')[0].children;
    //   if (indicators.length === 5) {
    //     for (var i = 0; i < $scope.sampleusers.length; i++) {
    //       var cssString = "background-size: cover; background-image: url('" + $scope.sampleusers[i].coverimg + "');";
    //       indicators[i].style.cssText = cssString;

    //       // if (indicators[i].className === 'ng-scope active') {
    //       //   indicators[i].className = indicators[i].className + " animated pulse";
    //       // } else {
    //       //   indicators[i].className = indicators[i].className.replace(" animated pulse", "")
    //       // }

    //     }
    //   }
    // };

    // $scope.addJai = function(questionId, e){
    //   if (Auth.isLoggedIn()){
    //     angular.forEach($scope.questions, function(question){
    //       if (question._id === questionId) {
    //         question.jais++;
    //         $http.post('/api/questions/' + questionId + '/addjai', { _id: questionId });
    //       }
    //     });
    //   } else {
    //     $location.path('/login');
    //     alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )')
    //   }
    // };

     // On leave page
    //  $scope.$on('$destroy', function () {
    //   socket.unsyncUpdates('question');
    // });


   });

angular.module('puanJaiApp')
.directive('slickSlider',function($timeout){
 return {
   restrict: 'A',
   link: function(scope,element,attrs) {
     $timeout(function() {
         $(element).slick(scope.$eval(attrs.slickSlider));
     });
   }
 }
});
