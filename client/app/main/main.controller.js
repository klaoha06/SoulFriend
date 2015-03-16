'use strict';

angular.module('puanJaiApp')
.controller('MainCtrl', function ($scope, $http, socket, Auth, $location, $filter, $interval) {
  var currentUser = Auth.getCurrentUser();
  var userId = currentUser._id;
  var orderBy = $filter('orderBy');
  $scope.isCollapsed = true;
  $scope.userInput;
  var category = category || 'noAnswer';
  var order = order || ['created'];
  var reverse = reverse || false;
  $scope.selectedTopic;
  $scope.popTags = [] || $scope.popTags;
  $scope.skip = 0;

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


  $scope.topics = [
  {
    'title': 'การปัฎิบัติธรรม',
    'link': '/topics/การปัฎิบัติธรรม',
    'icon': 'fa-circle-thin',
    'active': false
  },
  {
    'title': 'สุขภาพ',
    'link': '/topics/สุขภาพ',
    'icon': 'fa-pagelines',
    'active': false
  },
  {
    'title': 'ชีวิต',
    'link': '/topics/ชีวิต',
    'icon': 'fa-street-view',
    'active': false
  },
  {
    'title': 'ความรัก',
    'link': '/topics/ความรัก',
    'icon': 'fa-heart',
    'active': false
  },
  {
    'title': 'ครอบครัว',
    'link': '/topics/ครอบครัว',
    'icon': 'fa-home',
    'active': false
  },
  {
    'title': 'เพื่อน',
    'link': '/topics/เพื่อน',
    'icon': 'fa-users',
    'active': false
  },
  {
    'title': 'การงาน',
    'link': '/topics/การงาน',
    'icon': 'fa-briefcase',
    'active': false

  },
  {
    'title': 'ธุรกิจ',
    'link': '/topics/ธุรกิจ',
    'icon': 'fa-building-o',
    'active': false
  },
  ];
  $scope.updateTopic = function(topic){
    if (topic === null) {
      $scope.selectedTopic = null;
    } else { 
      $scope.selectedTopic = topic.title;
    }
    $scope.getQuestions(null,null,null,$scope.selectedTopic);
    angular.forEach($scope.topics, function(t){
      if (t.title === topic.title) {
        t.active = !t.active;
      } else {
        t.active = false;
      }
    })
  };

  $scope.selectTopic = function(topic){
    if (topic === $scope.selectedTopic) {
      $scope.selectedTopic = null;
    } else { 
      $scope.selectedTopic = topic;
    }
    $scope.getQuestions(null,null,null,$scope.selectedTopic);
    angular.forEach($scope.topics, function(t){
      if (t.title === topic) {
        t.active = !t.active;
      } else {
        t.active = false;
      }
    });
  };

  $scope.tabs = [
      { title:'ยังไม่ได้ความช่วยเหลือ', category: 'noAnswer', orderBy: ['-answers_count, created'], reverse: false },
      { title:'ได้ความสําคํญมากสุด', category: 'votes_count', orderBy: 'votes_count', reverse: true },
      { title:'ล่าสุด', category: 'created', orderBy: 'created', reverse: true},
      { title:'ยอดนิยม', category: 'views', orderBy: 'views', reverse: true},
      { title:'ได้กําลังใจมากสุด', category: 'jais', orderBy: 'jais_count', reverse: true}
    ];

  $scope.resetSkip = function(){
    $scope.skip = 0;
  };

  // Get Questions
  $scope.getQuestions = function (c, o, r, t) {
    socket.unsyncUpdates('question');
    category = c || category;
    order = o || order;
    reverse = r || reverse;
    $scope.selectedTopic = t || $scope.selectedTopic;
    $http.get('/api/questions',{ params: {category: category, filterBy: {topic: $scope.selectedTopic}, skip: $scope.skip}}).success(function(questions){
      if ($scope.skip > 0){
        $scope.questions = $scope.questions.concat(questions);
      } 
      else {
        $scope.questions = questions;
      }
          socket.syncUpdates('question', $scope.questions, function(e, item, array){
            $scope.questions = orderBy(array, o, r);
          });
    });
  };

  $scope.getQuestions(category, order, reverse, $scope.selectedTopic);

    $scope.goToQuestion = function(item, model){
      $location.path('/questions/'+model._id);
    };

    $scope.searchQuestions = function(input) {
      $scope.userInput = input;
      return $http.get('/api/questions/search', { params: {userInput: input}}).then(function(response){
        return response.data.hits.hits.map(function(item){
          return item;
        });
      });
    };

    // $scope.onSubmitSearch = function(){
    //   // not done
    //   $location.path('/search/' + $scope.userInput);
    // };


    if (!$scope.sampleUsers) {
      $http.get('/api/users/sampleusers').success(function(sampleusers) {
        $scope.sampleusers = sampleusers;
      });
    }
    
    $scope.setCurrentSlide = function(){
      var indicators = document.getElementsByClassName('carousel-indicators')[0].children;
      if (indicators.length === 5) {
        for (var i = 0; i < $scope.sampleusers.length; i++) {
          console.log($scope.sampleusers);
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

    $scope.upVote = function(questionId){
      if (Auth.isLoggedIn()){
        var index = _.findIndex($scope.questions,{'_id': questionId});
        var currentQuestion = $scope.questions[index];
          if (_.include(currentQuestion.upvotes, userId)) {
            alert('คุณได้ให้โหวตแล้ว');
            return;
          } else {
           $scope.questions[index].votes_count++;
           $scope.questions[index].upvotes.push(userId);
           $http.post('/api/questions/' + questionId + '/upvote', { _questionId: questionId, userId: userId });
          }
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');
      }
    };

    $scope.downVote = function(questionId){
      if (Auth.isLoggedIn()){
        var index = _.findIndex($scope.questions,{'_id': questionId});
        var currentQuestion = $scope.questions[index];
          if (_.include(currentQuestion.downvotes, userId)) {
            alert('คุณได้ให้โหวตแล้ว');
            return;
          } else {
           $scope.questions[index].votes_count--;
           $scope.questions[index].downvotes.push(userId);
           $http.post('/api/questions/' + questionId + '/downvote', { _questionId: questionId, userId: userId });
          }
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )')
      }
    };

    $scope.addJai = function(questionId){
      if (Auth.isLoggedIn()){
        var index = _.findIndex($scope.questions,{'_id': questionId});
        var currentQuestion = $scope.questions[index];
          if (_.include(currentQuestion.jais, userId)) {
            alert('คุณได้ให้กําลังใจแล้ว');
            return;
          } else {
           $scope.questions[index].jais.push(userId);
           $scope.questions[index].jais_count++;
           $http.post('/api/questions/' + questionId + '/addjai', { _questionId: questionId, userId: userId });
          }
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )')
      }
    };

    $http.get('/api/tags', {orderBy: 'popular_count'}).success(function(tags) {
      angular.forEach(tags, function(tag){
        $scope.popTags.push({text: tag.name, weight: tag.popular_count, link: 'tags/' + tag._id})
      });
      // console.log($scope.popTags);
    });

    $scope.getMoreQuestions = function(){
      $scope.skip++;
      $scope.getQuestions();
    };

     // On leave page
     $scope.$on('$destroy', function () {
      socket.unsyncUpdates('question');
    });

   });

angular.module('puanJaiApp')
  .filter('thousandSuffix', function () {
    return function (number){
      if (number !== undefined) {
      var abs = Math.abs(number);
      if (abs >= Math.pow(10, 12)) {
        number = (number / Math.pow(10, 12)).toFixed(1)+"t";
      }
      else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9)) {
        number = (number / Math.pow(10, 9)).toFixed(1)+"b";
      }
      else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) {
        number = (number / Math.pow(10, 6)).toFixed(1)+"m";
      }
      else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) {
        number = (number / Math.pow(10, 3)).toFixed(1)+"k";
      }
      return number;
    }
  };
  });
