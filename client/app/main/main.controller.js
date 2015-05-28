angular.module('puanJaiApp')
.controller('MainCtrl', function ($scope, $http, socket, Auth, $location, $filter, Facebook) {
  $scope.currentUser = Auth.getCurrentUser();
  var userId = localStorage.getItem('userId');
  var orderBy = $filter('orderBy');
  if (localStorage.getItem('showQuestions') === 'false') {
    $scope.showQuestions = false;
  } else {
    $scope.showQuestions = true;
  }
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
    image: '/assets/images/6.jpg',
    text:'ยินดีต้อนรับสู่เพื่อนใจ',
    caption: '',
    link:'/about'
  },
  {
    image: '/assets/images/13.jpg',
    text:'บริการเพื่อนใจ',
    caption: 'Friend Delivery',
    link:'/services'
  },
  {
    image: '/assets/images/10.png',
    text:'รู้จักผู้สร้างเพื่อนใจ',
    link:'/aboutcreator'
  },
    {
    image: '/assets/images/7.png',
    text:'กิจกรรมเพื่อนใจ',
    link:'/activities'
  }
  ];


  $scope.topics = [
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
    'title': 'สุขภาพ',
    'link': '/topics/สุขภาพ',
    'icon': 'fa-pagelines',
    'active': false
  },
  {
    'title': 'การปฎิบัติธรรม',
    'link': '/topics/การปัฎิบัติธรรม',
    'icon': 'fa-circle-thin',
    'active': false
  },
  {
    'title': 'อื่นๆ',
    'link': '/topics/อื่นๆ',
    'icon': 'fa-plus',
    'active': false
  }
  ];

  $scope.questionTabs = [
      { title:'ยังรอการช่วยเหลือ', category: 'noAnswer', orderBy: ['-answers_count, created'], reverse: false },
      { title:'โหวตมากสุด', category: 'votes_count', orderBy: 'votes_count', reverse: true },
      { title:'ล่าสุด', category: 'created', orderBy: 'created', reverse: true},
      { title:'กําลังใจมากสุด', category: 'jais', orderBy: 'jais_count', reverse: true},
      { title:'ยอดนิยม', category: 'views', orderBy: 'views', reverse: true},
      { title:'อาทิตย์นี้', category: 'viewsThisWeek', orderBy: 'views', reverse: true},
      { title:'เดือนนี้', category: 'viewsThisMonth', orderBy: 'views', reverse: true},
    ];

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

  $scope.resetSkip = function(){
    $scope.skip = 0;
  };

  $scope.switchMainTab = function(input){
    switch(input) {
      case 'questions':
        $scope.defaultTab = 'questions';
        if (!$scope.questions) {
          $scope.getQuestions(category, order, reverse, $scope.selectedTopic);
        }
        localStorage.setItem('defaultTab', 'questions');
        $scope.resetSkip();
        break;
      default:
        $scope.getQuestions(category, order, reverse, $scope.selectedTopic);
    }
  };

  $scope.switchMainTab(localStorage.getItem('defaultTab'));


  $scope.askQuestion = function(){
    localStorage.setItem('questionTitle', $scope.userInput);
    $location.path('/ask');
  };

  $scope.selectTopic = function(topic){
    $scope.resetSkip();
    if (topic === $scope.selectedTopic) {
      $scope.selectedTopic = {'$ne': null};
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

  $scope.goTo = function(url){
    $location.path(url);
  };

  $scope.goToQuestion = function(model){
    $location.path('/questions/'+model._id);
  };


  var output;
  $scope.searchQuestions = function(input) {
    $scope.userInput = input;
    if (input.length < 3) {
      output = [];
      return [];
    }
    return $http.get('/api/questions/search', { params: {q: input}}).then(function(response){
      if (response.data.hits.hits.length > 0){
        output = response.data.hits.hits;
      }
      if (output){ 
        return output.map(function(item){
          return item;
        });
      } else {
        return response.data.hits.hits.map(function(item){
          return item;
        });
      }
    });
  };
  
    // $scope.setCurrentSlide = function(){
    //   var indicators = document.getElementsByClassName('carousel-indicators')[0].children;
    //   if (indicators.length === 5) {
    //     for (var i = 0; i < $scope.sampleusers.length; i++) {
    //       console.log($scope.sampleusers);
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
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');
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

    // $http.get('/api/tags', {orderBy: 'popular_count'}).success(function(tags) {
    //   angular.forEach(tags, function(tag){
    //     $scope.popTags.push({text: tag.name, weight: tag.popular_count, link: 'tags/' + tag._id})
    //   });
    // });

    $scope.shareFB = function(questionName, questionId, questionBody){
      var htmlToText = $filter('htmlToText');
      Facebook.ui({
        method: 'feed',
        name: questionName,
        link: 'http://puanjai.com/questions/'+questionId,
        picture: 'https://d13yacurqjgara.cloudfront.net/users/60166/screenshots/2028575/love_sunrise.jpg',
        caption: 'เพื่อนใจ - ชุมชนเพื่อแบ่งปันปัญหาใจและช่วยกันพัฒนาความสุข',
        description: htmlToText(questionBody),
        message: questionName
      });
    };

    $scope.getMoreQuestions = function(){
      $scope.skip++;
      $scope.getQuestions();
    };

     // On leave page
     $scope.$on('$destroy', function () {
      socket.unsyncUpdates('question');
    });

});
