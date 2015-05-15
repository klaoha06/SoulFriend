angular.module('puanJaiApp')
  .directive('scrollPosition', function($window) {
    return {
      scope: {
        scroll: '=scrollPosition'
      },
      link: function(scope, element, attrs) {
        var windowEl = angular.element($window);
        var handler = function() {
          scope.scroll = windowEl.scrollTop();
        };
        windowEl.on('scroll', scope.$apply.bind(scope, handler));
        handler();
      }
    };
  })

  .controller('askCtrl', function ($scope, $http, socket, $stateParams, Auth, $location, $cookieStore, $filter, $window) {
    var orderBy = $filter('orderBy');
    var user = Auth.getCurrentUser();
    $scope.editQuestion = localStorage.getItem('editQuestion');
    $scope.textEditorInput = localStorage.getItem('questionContent');
    $scope.oldContent = localStorage.getItem('questionContent');
    $scope.searchResults;
    $scope.searchInput = localStorage.getItem('questionTitle');
    $scope.selectedTopic = $cookieStore.get('topic');
    $scope.tags = $cookieStore.get('tags');
    $scope.alerts = [];
    $scope.scroll = 0;

    $scope.$evalAsync(function() {
      $scope.height = document.getElementById('ask').offsetHeight;
    } );


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

    function resetFormVariables() {
      $scope.textEditorInput = '';
      localStorage.removeItem('editQuestion');
      localStorage.removeItem('questionContent');
      $cookieStore.remove('topic');
      $cookieStore.remove('tags');
      localStorage.removeItem('questionTitle');
      $cookieStore.remove('questionContent');
    }

    // Search Questions
    $scope.$watch('searchInput', function(input){
      if (input){
        localStorage.setItem('questionTitle', input);
        $http.get('/api/questions/search', { params: {userInput: input}}).success(function(result) {
          // console.log(result.hits.hits);
          $scope.searchResults = orderBy(result.hits.hits, '_score', true);
        });
      }
    });

    // Go to Question
    $scope.goToQuestion = function(questionId){
      $location.path('/questions/' + questionId);
    };

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
        localStorage.setItem('questionContent', input);
      }
    });

    // Autocomplete Tags
    $scope.searchTags = function(input) {
      return $http.get('/api/tags/search', { params: {userInput: input}}).success(function(res){
        $scope.searchedTags = res;
      });
    };

    // Store Tag in Cookie
    $scope.storeTagInCookie = function(){
      var lastInputTag = _.last($scope.tags);
      var bestResult = _.first($scope.searchedTags);
      if (typeof bestResult !== 'undefined'){      
        if (lastInputTag.name === bestResult.name) {
          _.merge(lastInputTag, bestResult);
        }
      }
      $cookieStore.put('tags', $scope.tags);
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    // On Submit
    $scope.onQuestionFormSubmit = function(){
      if (Auth.isLoggedIn()) {
        // reset alerts
        $scope.alerts = [];

        function htmlToPlaintext(text) {
          return String(text).replace(/<[^>]+>/gm, '');
        }
        var text = htmlToPlaintext($scope.textEditorInput);

        // validate input
        if (typeof $scope.searchInput === 'undefined') {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาเลือกชื่อของคําถามด้วยครับ' })
        }
        if ($scope.searchInput){        
          if ($scope.searchInput.length > 100 || $scope.searchInput.length < 8) {
            $scope.alerts.push({ type: 'danger', msg: 'กรุณาใช่ระหว่าง 8 ถึง 100 อักขระในการถามคําถาม' })
          }
        } else {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาใช่ระหว่าง 8 ถึง 150 อักขระในการถามคําถาม' })
        }

        if (typeof $scope.selectedTopic === 'undefined') {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาเลือกหัวข้อของคําถามด้วยครับ' })
        }
        if (typeof $scope.textEditorInput === 'undefined') {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาใส่เนื้อความของคําถามด้วยครับ' })
        }
        if (text.length > 7000 || text.length < 15) {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาใช่ไระหว่าง 15 ถึง 7000 อักขระในการถามคําถาม' })
        }
        if ($scope.tags.length <= 0) {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาใส่อย่างน้อยหนึ่งแท็กครับ' })
        }

        if ($scope.alerts.length !== 0) {
          return;
        }

        var partitionedTags = [];

        partitionedTags = _.partition($scope.tags, function(tag){
          if (!_.has(tag, '_id')) {
            return tag;
          }
        });

        if (localStorage.getItem('editQuestion')) {
          var questionToUpdate = { 
            _id: $scope.editQuestion,
            name: $scope.searchInput,
            body: $scope.textEditorInput,
            tags: partitionedTags[1],
            topic: $scope.selectedTopic
          };
          $http.patch('/api/questions/' + localStorage.getItem('editQuestion'), {questionToUpdate: questionToUpdate, newTags: partitionedTags[0]}).success(function(res){
            resetFormVariables();
            $location.path(/questions/ + res._id);
          });
        } else {
          var newQuestion = { 
            ownerId: user._id,
            owner: {
              username: user.username,
              role: user.role,
              coverimg: user.coverimg
            },
            name: $scope.searchInput,
            body: $scope.textEditorInput,
            tags: partitionedTags[1],
            topic: $scope.selectedTopic
          };
          $http.post('/api/questions', {newQuestion: newQuestion, newTags: partitionedTags[0]}).success(function(res){
            resetFormVariables();
            $location.path(/questions/ + res._id);
          });
        }
      } else {
            $location.path('/login');
            alert('กรุณาเข้าสู้ระบบก่อนเข้าร่วมการสนทนา')
      }
    };

     // On leave page
     $scope.$on('$destroy', function () {
      if (localStorage.getItem('editQuestion')) {
        resetFormVariables();
      }
    });

  });
