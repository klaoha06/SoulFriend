angular.module('puanJaiApp')
  .controller('shareCtrl', function ($scope, $http, Auth, $location, $cookieStore, $filter) {
    var orderBy = $filter('orderBy');
    $scope.user = Auth.getCurrentUser();
    $scope.textEditorInput = localStorage.getItem('articleContent');
    $scope.oldContent = localStorage.getItem('articleContent');
    $scope.searchResults;
    $scope.nameInput = '' || $cookieStore.get('articleTitle');
    $scope.importanceInput = '' || $cookieStore.get('articleImportance');
    $scope.conclusionInput = '' || $cookieStore.get('articleConclusion');
    $scope.selectedTopic = $cookieStore.get('articleTopic');
    $scope.tags = $cookieStore.get('articleTags');
    $scope.alerts = [];
    $scope.now = Date.now();

    $scope.writingRules = [
    {
      title: 'แสดงด้วยความรักและเมตตา'
    },
    {
      title: 'แสดงด้วยถ้อยคำที่สุภาพ'
    },
    {
      title: 'ไม่ให้ความรู้โดยเห็นแก่ผลตอบแทนใดๆทั่งทางตรงและทางอ้อม'
    },
    {
      title: 'ไม่ให้ความรู้ด้วยความโอ้อวด'
    },
    {
      title: 'มีประโยช์นทั่งต่อตนเองและผู้อื่น'
    }
    ];

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

    $scope.hide = [false,true,true,true,true,true];

    function htmlToPlaintext(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }

    // Search Articles
    $scope.$watch('nameInput', function(input){
      if (input){
        $cookieStore.put('articleTitle', input);
        $http.get('/api/articles/search', { params: {userInput: input}}).success(function(result) {
          $scope.searchResults = orderBy(result.hits.hits, '_score', true);
        });
      }
    });

    // Go to Article
    $scope.goToArticle = function(articleId){
      $location.path('/articles/' + articleId);
    };

    //Show Next or Previous
    $scope.showNext = function(){
      for (var i = 0; i < $scope.hide.length; i++) {
        if ($scope.hide[i] === false) {
          $scope.hide[i] = true;
          $scope.hide[i+1] = false;
          return;
        }
      }
    };

    $scope.showPrevious = function(){
      for (var i = 0; i < $scope.hide.length; i++) {
        if ($scope.hide[i] === false) {
          $scope.hide[i] = true;
          $scope.hide[i-1] = false;
          return;
        }
      }
    };

    $scope.$watch('importanceInput', function(input){
      if (input){
        $cookieStore.put('articleImportance', input);
      }
    });

    $scope.$watch('conclusionInput', function(input){
      if (input){
        $cookieStore.put('articleConclusion', input);
      }
    });

    // Select Topic
    $scope.selectTopic = function(topic){
      if (topic === $scope.selectedTopic) {
        $scope.selectedTopic = null;
      } else { 
        $scope.selectedTopic = topic;
        $cookieStore.put('articleTopic', $scope.selectedTopic);
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
        localStorage.setItem('articleContent', input);
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
      $cookieStore.put('articleTags', $scope.tags);
    };

    // For closing alerts
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };


    // Toogling Preview

    $scope.tooglePreview = function(){
      if ($scope.articlePreview === '' && $scope.articleForm === 'show') {
        $scope.articlePreview = 'animated fadeIn';
        $scope.articleForm = 'hide';
        $scope.preview = true;
      } else if ($scope.articlePreview !== 'hide' && $scope.articleForm === 'hide') {
        $scope.articlePreview = '';
        $scope.articleForm = 'show';
        $scope.preview = false;
      }
    };


    // On Submit
    $scope.onSubmit = function(){
      if (Auth.isLoggedIn()) {
        // reset alerts
        $scope.alerts = [];
        var text = htmlToPlaintext($scope.textEditorInput);

        // validate input
        if ($scope.nameInput) {
          if ($scope.nameInput.length < 3 || $scope.nameInput.length > 150) {
            $scope.alerts.push({ type: 'danger', msg: 'ชื่อของบทความควรมีความยาวระหว่าง 10 ถึง 150 อักขระ' });
          }
        } else {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาใส่ชื่อของบทความด้วยครับ' });
        }

        if ($scope.importanceInput) {
          if ($scope.importanceInput.length <= 10 || $scope.importanceInput.length > 150) {
            $scope.alerts.push({ type: 'danger', msg: 'ความสําคัญของบทความควรมีความยาวระหว่าง 10 ถึง 150 อักขระ' });
          }
        } else {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาใส่ความสําคัญของบทความด้วยครับ' });
        }

        if ($scope.selectedTopic === null) {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาเลือกหัวข้อของคําถามด้วยครับ' });
        }
        if (text.length <= 600 || text.length > 9000) {
          $scope.alerts.push({ type: 'danger', msg: 'เนื้อความควรมีความยาวระหว่าง 600 ถึง 9000 อักขระ' });
        }
        if ($scope.conclusionInput) {
          if ($scope.conclusionInput.length > 150 || $scope.conclusionInput.length < 10) {
            $scope.alerts.push({ type: 'danger', msg: 'กรุณาใช่ไม่เกิน 150 อักขระในเขียนบทสรุป' });
          }
        } else {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาให้บทสรุปของบทความด้วยครับ' });
        }
        if ($scope.tags.length <= 0) {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาใส่อย่างน้อยหนึ่งแท็กครับ' });
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
            var newArticle = { 
              body: $scope.textEditorInput,
              importance: $scope.importanceInput,
              name: $scope.nameInput,
              owner: {
                username: $scope.user.username,
                summary: $scope.user.summary,
                role: $scope.user.role,
                coverimg: $scope.user.coverimg
              },
              ownerId: $scope.user._id,
              summary: $scope.conclusionInput,
              tags: partitionedTags[1],
              topic: $scope.selectedTopic
            };

            $http.post('/api/articles', {newArticle: newArticle, newTags: partitionedTags[0]}).success(function(res){
              $scope.textEditorInput = '';
              $cookieStore.remove('articleTags'); 
              $cookieStore.remove('articleTopic'); 
              $cookieStore.remove('articleTitle');
              $cookieStore.remove('articleImportance');
              $cookieStore.remove('articleConclusion');
              localStorage.removeItem('articleContent');
              $location.path(/articles/ + res._id);
            });
      } else {
            $location.path('/login');
            alert('กรุณาเข้าสู้ระบบก่อนเข้าร่วมการสนทนา')
      }
    };

  });