angular.module('puanJaiApp')
.controller('MainCtrl', function ($scope, $http, socket, Auth, $location, $filter, Facebook) {
  var currentUser = Auth.getCurrentUser();
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
  // var articlesFilter = articlesFilter || {};
  // var articlesOrder = order || ['-created'];
  // var articlesReverse = reverse || true;
  // var booksFilter = booksFilter || {};
  // var booksOrder = order || ['-created'];
  // var booksReverse = reverse || true;
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
  // {
  //   image: '/assets/images/writer2.jpg',
  //   text:'สมัครเป็นนักเขียนเพื่อนใจ',
  //   link:'/writer'
  // },
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

  // $scope.articleTabs = [
  //     { title:'ล่าสุด', filterBy: {}, orderBy: 'created', reverse: true},
  //     { title:'ได้โหวตมากสุด', filterBy: {}, orderBy: 'votes_count', reverse: true },
  //     { title:'ยอดนิยม', filterBy: {}, orderBy: 'views', reverse: true},
  //     { title:'แนะนํา', filterBy: {recommended: true}, orderBy: 'created', reverse: true },
  //     { title:'โดยนักเขียน', filterBy: {byWriter: true}, orderBy: 'created', reverse: true},
  //   ];

  // $scope.bookTabs = [
  //     { title:'ล่าสุด', filterBy: {}, orderBy: 'created', reverse: true},
  //     { title:'ได้โหวตมากสุด', filterBy: {}, orderBy: 'votes_count', reverse: true },
  //     { title:'ยอดนิยม', filterBy: {}, orderBy: 'views', reverse: true},
  //     { title:'แนะนํา', filterBy: {recommended: true}, orderBy: 'created', reverse: true },
  //     { title:'โดยนักเขียน', filterBy: {byWriter: true}, orderBy: 'created', reverse: true},
  //   ];

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

  // Get Articles
  // $scope.getArticles = function (f, o, r, t) {
  //   socket.unsyncUpdates('article');
  //   articlesFilter = f || articlesFilter;
  //   if ($scope.selectedTopic){
  //     articlesFilter.topic = $scope.selectedTopic;
  //   }
  //   articlesOrder = o || articlesOrder;
  //   articlesReverse = r || articlesReverse;
  //   $scope.selectedTopic = t || $scope.selectedTopic;
  //   var sort;
  //   if (articlesReverse === true) {
  //     sort = '-' + articlesOrder;
  //   } else {
  //     sort = articlesOrder;
  //   }
  //   $http.get('/api/articles',{ params: {filterBy: articlesFilter, skip: $scope.skip, sort: sort}}).success(function(articles){
  //     if ($scope.skip > 0){
  //       $scope.articles = $scope.articles.concat(articles);
  //     } 
  //     else {
  //       $scope.articles = articles;
  //     }
  //         socket.syncUpdates('article', $scope.articles, function(e, item, array){
  //           $scope.articles = orderBy(array, o, r);
  //         });
  //   });
  // };

  // Get Books
  // $scope.getBooks = function (f, o, r, t) {
  //   socket.unsyncUpdates('book');
  //   booksFilter = f || booksFilter;
  //   if ($scope.selectedTopic){
  //     booksFilter.topic = $scope.selectedTopic;
  //   }
  //   booksOrder = o || booksOrder;
  //   booksReverse = r || booksReverse;
  //   $scope.selectedTopic = t || $scope.selectedTopic;
  //   var sort;
  //   if (booksReverse === true) {
  //     sort = '-' + booksOrder;
  //   } else {
  //     sort = booksOrder;
  //   }
  //   $http.get('/api/books',{ params: {filterBy: booksFilter, skip: $scope.skip, sort: sort}}).success(function(books){
  //     if ($scope.skip > 0){
  //       $scope.books = $scope.books.concat(books);
  //     } 
  //     else {
  //       $scope.books = books;
  //     }
  //         socket.syncUpdates('book', $scope.books, function(e, item, array){
  //           $scope.books = orderBy(array, o, r);
  //         });
  //   });
  // };

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
      // case 'articles':
      //   $scope.defaultTab = 'articles';
      //   if (!$scope.articles) {
      //     $scope.getArticles(articlesFilter, articlesOrder, articlesReverse, $scope.selectedTopic);
      //   }
      //   localStorage.setItem('defaultTab', 'articles');
      //   $scope.getArticles();
      //   $scope.resetSkip();
      //   break;
      // case 'books':
      //   $scope.defaultTab = 'books';
      //   if (!$scope.articles) {
      //     $scope.getArticles(articlesFilter, articlesOrder, articlesReverse, $scope.selectedTopic);
      //   }
      //   localStorage.setItem('defaultTab', 'books');
      //   $scope.getArticles();
      //   $scope.resetSkip();
      //   break;
      default:
        $scope.getQuestions(category, order, reverse, $scope.selectedTopic);
        $scope.getArticles(articlesFilter, articlesOrder, articlesReverse, $scope.selectedTopic);
    }
  };

  $scope.switchMainTab(localStorage.getItem('defaultTab'));

  $scope.selectTopic = function(topic){
    $scope.resetSkip();
    if (topic === $scope.selectedTopic) {
      $scope.selectedTopic = {'$ne': null};
    } else { 
      $scope.selectedTopic = topic;
    }
    switch($scope.defaultTab) {
      case 'questions':
      $scope.getQuestions(null,null,null,$scope.selectedTopic);
      break;
      case 'articles':
      $scope.getArticles(null,null,null,$scope.selectedTopic);
      break;
    }
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

  // $scope.goToArticle = function(articleId){
  //   $location.path('/articles/'+articleId);
  // };

    $scope.searchQuestions = function(input) {
      $scope.userInput = input;
      return $http.get('/api/questions/search', { params: {userInput: input}}).then(function(response){
        return response.data.hits.hits.map(function(item){
          return item;
        });
      });
    };
    
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

    $http.get('/api/tags', {orderBy: 'popular_count'}).success(function(tags) {
      angular.forEach(tags, function(tag){
        $scope.popTags.push({text: tag.name, weight: tag.popular_count, link: 'tags/' + tag._id})
      });
    });

    $scope.shareFB = function(url){
      Facebook.ui({
        method: 'share',
        href: url, function(res){
          console.log(res);
        }
      });
    };

    $scope.getMoreQuestions = function(){
      $scope.skip++;
      $scope.getQuestions();
    };

    // $scope.getMoreArticles = function(){
    //   $scope.skip++;
    //   $scope.getArticles();
    // };

     // On leave page
     $scope.$on('$destroy', function () {
      socket.unsyncUpdates('question');
      socket.unsyncUpdates('article');
      socket.unsyncUpdates('book');
    });

   });


