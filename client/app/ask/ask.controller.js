'use strict';

angular.module('puanJaiApp')
  .controller('askCtrl', function ($scope, $http, socket, $stateParams, Auth, $location, $cookieStore, $filter) {
    var orderBy = $filter('orderBy');
    var user = Auth.getCurrentUser();
    $scope.textEditorInput = $cookieStore.get('content');
    $scope.oldContent = $cookieStore.get('content');
    $scope.searchResults;
    $scope.searchInput = $cookieStore.get('questionTitle');
    $scope.selectedTopic = $cookieStore.get('topic');
    $scope.tags = $cookieStore.get('tags');

    $scope.topics = [
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
      'title': 'ชีวิต',
      'link': '/topics/ชีวิต',
      'icon': 'fa-street-view',
      'active': false
    },
    {
      'title': 'การปัฎิบัติธรรม',
      'link': '/topics/การปัฎิบัติธรรม',
      'icon': 'fa-circle-thin',
      'active': false
    },
    {
      'title': 'อื่นๆ',
      'link': '/topics/การปัฎิบัติธรรม',
      'icon': 'fa-circle-thin',
      'active': false
    }
    ];

    // Search Questions
    $scope.$watch('searchInput', function(input){
      if (input){
        $cookieStore.put('questionTitle', input);
        $http.get('/api/questions/search', { params: {userInput: input}}).success(function(result) {
          $scope.searchResults = orderBy(result, '_score', true);
        });
      }
    });

    // Select Topic
    $scope.selectTopic = function(topic){
      if (topic === $scope.selectedTopic) {
        $scope.selectedTopic = null;
      } else { 
        $scope.selectedTopic = topic;
        $cookieStore.put('topic', $scope.selectedTopic);
      }
      angular.forEach($scope.topics, function(t){
        if (t.title === topic) {
          t.active = true;
        } else {
          t.active = false;
        }
      });
    };

    // Store Content in Cookie
    $scope.$watch('textEditorInput', function(input){
      if (input) {
        $cookieStore.put('content', input);
      }
    });

    // Autocomplete Tags
    $scope.searchTags = function(input) {
      return $http.get('/api/tags/search', { params: {userInput: input}});
    };

    // Store Tag in Cookie
    $scope.storeTagInCookie = function(){
      $cookieStore.put('tags', $scope.tags);
    };

    // On Submit
    $scope.onQuestionFormSubmit = function(){
      if (Auth.isLoggedIn()) {
            // var partitionedTags = _.partition.($scope.tags, function(t){
            //   if (!_.has(t, '_id')) {
            //     return t;
            //   }
            // });
            // debugger;
            var newQuestion = { 
              owner: {
                _ownerId: user._id,
                username: user.username,
                role: user.role,
                coverimg: user.coverimg
              },
              searchname: [],
              name: $scope.searchInput,
              body: $scope.textEditorInput,
              jais: [],
              jais_count:0,
              upvotes: [],
              votes_count:0,
              downvotes: [],
              views:0,
              shares:0,
              answered: false,
              likedAns:0,
              answers: [],
              answers_count:0,
              tags: $scope.tags,
              topic: $scope.selectedTopic
            };
            // console.log(newQuestion);
            var newTags = [];


            //   _(newQuestion.tags).forEach(function(tag){
            //     if (!_.has(tag, '_id')) {
            //       newTags.push(tag);
            //     }
            //   });
            // debugger;
            $http.post('/api/questions', {newQuestion: newQuestion, newTags: newTags}).success(function(res){
              console.log(res);
            });
            // $scope.textEditorInput = '';
            // $cookieStore.remove('tags'); 
            // $cookieStore.remove('topic'); 
            // $cookieStore.remove('content'); 
            // $cookieStore.remove('questionTitle'); 
      } else {
            $location.path('/login');
            alert('กรุณาเข้าสู้ระบบก่อนเข้าร่วมการสนทนา')
      }
    };

  });