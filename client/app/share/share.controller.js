angular.module('puanJaiApp')
  .controller('shareCtrl', function ($scope, $http, socket, $stateParams, Auth, $location, $cookieStore, $filter) {
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
    $scope.articlePreview = '';
    $scope.articleForm = 'show';
    $scope.now = Date.now();
    $scope.preview = false;

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
    },
    // {
    //   title: 'ไม่กระทบกระทั่งทั่งตนเองและผู้อื่น'
    // }
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

    // Search Articles
    $scope.$watch('nameInput', function(input){
      if (input){
        $cookieStore.put('articleTitle', input);
        $http.get('/api/articles/search', { params: {userInput: input}}).success(function(result) {
          $scope.searchResults = orderBy(result.hits.hits, '_score', true);
        });
      }
    });

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

        function htmlToPlaintext(text) {
          return String(text).replace(/<[^>]+>/gm, '');
        }
        var text = htmlToPlaintext($scope.textEditorInput)

        // validate input
        if ($scope.nameInput.length <= 10) {
          $scope.alerts.push({ type: 'danger', msg: 'ชื่อของบทความควรมีความยาวอย่างน่อย 10 อักขระ' })
        }
        if ($scope.nameInput.length > 150) {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาใช่ไม่เกิน 150 อักขระในชื่อของบทความ' })
        }
        if ($scope.importanceInput.length <= 10) {
          $scope.alerts.push({ type: 'danger', msg: 'ความสําคัญของบทความควรมีความยาวอย่างน่อย 10 อักขระ' })
        }
        if ($scope.importanceInput.length > 150) {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาใช่ไม่เกิน 150 อักขระในการเขียนความสําคัญของบทความ' })
        }
        if ($scope.selectedTopic === null) {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาเลือกหัวข้อของคําถามด้วยครับ' })
        }
        if (text.length <= 25) {
          $scope.alerts.push({ type: 'danger', msg: 'เนื้อความควรมีความยาวอย่างน่อย 25 อักขระ' })
        }
        if (text.length > 9000) {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาใช่ไม่เกิน 9000 อักขระในการถามคําถาม' })
        }
        if ($scope.conclusionInput.length <= 10) {
          $scope.alerts.push({ type: 'danger', msg: 'บทสรุปของความควรมีความยาวอย่างน่อย 10 อักขระ' })
        }
        if ($scope.conclusionInput.length > 150) {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาใช่ไม่เกิน 150 อักขระในเขียนบทสรุป' })
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

            var newArticle = { 
              owner: {
                _ownerId: $scope.user._id,
                username: $scope.user.username,
                summary: $scope.user.summary,
                role: $scope.user.role,
                coverimg: $scope.user.coverimg
              },
              name: $scope.nameInput,
              body: $scope.textEditorInput,
              tags: partitionedTags[1],
              topic: $scope.selectedTopic,
              importance: $scope.importanceInput,
              summary: $scope.conclusionInput
            };
            $http.post('/api/articles', {newArticle: newArticle, newTags: partitionedTags[0]}).success(function(res){
              // console.log(res)
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