angular.module('puanJaiApp')
  .controller('shareCtrl', function ($scope, $http, Auth, $location, $cookieStore, $filter) {
    var orderBy = $filter('orderBy');
    $scope.user = Auth.getCurrentUser();
    $scope.textEditorInput = localStorage.getItem('articleContent');
    $scope.oldContent = localStorage.getItem('articleContent');
    $scope.searchResults;
    $scope.nameInput = '' || localStorage.getItem('articleTitle');
    $scope.coverImageUrl = '' || localStorage.getItem('shareCoverImg');
    $scope.importanceInput = '' || localStorage.getItem('articleImportance');
    $scope.conclusionInput = '' || localStorage.getItem('articleConclusion');
    $scope.selectedTopic = localStorage.getItem('articleTopic');
    $scope.tags = $cookieStore.get('articleTags');
    $scope.alerts = [];
    $scope.now = Date.now();
    $scope.warnUrl = true;

    function resetVars(){
      $scope.textEditorInput = '';
      $cookieStore.remove('articleTags');
      localStorage.removeItem('articleTopic'); 
      localStorage.removeItem('articleTitle');
      localStorage.removeItem('articleImportance');
      localStorage.removeItem('articleConclusion');
      localStorage.removeItem('articleContent');
      localStorage.removeItem('shareCoverImg');
    }

    if (localStorage.getItem('editingArticle')) {
      $http.get('api/articles/' + localStorage.getItem('editingArticle')).success(function(article){
        $scope.editingArticle = article;
      }).error(function(){
        resetVars();
      });
    }

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

    function ValidURL(str) {
      var pattern = new RegExp(/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i
); // fragment locater
      if(!pattern.test(str)) {
        return false;
      } else {
        return true;
      }
    }

    $scope.hide = [false,true,true,true,true,true,true];

    function htmlToPlaintext(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }

    // Search Articles
    $scope.$watch('nameInput', function(input){
      if (input){
        localStorage.setItem('articleTitle', input);
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

    $scope.$watch('coverImageUrl', function(input){
      if (input){
        if (ValidURL(input)) {
          $scope.warnUrl = false;
          localStorage.setItem('shareCoverImg', input);
        } else 
        $scope.warnUrl = true;
      }
    });

    $scope.$watch('importanceInput', function(input){
      if (input){
        localStorage.setItem('articleImportance', input);
      }
    });

    $scope.$watch('conclusionInput', function(input){
      if (input){
        localStorage.setItem('articleConclusion', input);
      }
    });

    // Select Topic
    $scope.selectTopic = function(topic){
      if (topic === $scope.selectedTopic) {
        $scope.selectedTopic = null;
      } else { 
        $scope.selectedTopic = topic;
        localStorage.setItem('articleTopic', $scope.selectedTopic);
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
          if ($scope.nameInput.length < 3 || $scope.nameInput.length > 83) {
            $scope.alerts.push({ type: 'danger', msg: 'ชื่อของบทความควรมีความยาวระหว่าง 10 ถึง 83 อักขระ' });
          }
        } else {
          $scope.alerts.push({ type: 'danger', msg: 'กรุณาใส่ชื่อของบทความด้วยครับ' });
        }

        if ($scope.coverImageUrl) {
          if ($scope.coverImageUrl.length < 11 || $scope.coverImageUrl > 300) {
            $scope.alerts.push({type:'danger', msg: 'url หรือ ลิงค์ ควรมีความยาวระหว่าง 11 ถึง 300 อักขระ'});
          }
          if (!ValidURL($scope.coverImageUrl)){
            $scope.alerts.push({type:'danger', msg: 'url หรือ ลิงค์ ของคุณไม่ถูกต้อง'});
          }
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
        if ($scope.editingArticle) {
          $scope.editingArticle.body = $scope.textEditorInput;
          $scope.editingArticle.importance = $scope.importanceInput;
          $scope.editingArticle.name = $scope.nameInput;
          $scope.editingArticle.summary = $scope.conclusionInput;
          $scope.editingArticle.tags = partitionedTags[1];
          $scope.editingArticle.newTags = partitionedTags[0];
          $scope.editingArticle.topic = $scope.selectedTopic;

          if ($scope.coverImageUrl && $scope.warnUrl) {
            $scope.editingArticle.coverImg = $scope.coverImageUrl;
          } else {
            $scope.editingArticle.coverImg = 'http://loremflickr.com/750/240/landscape?random=' + Math.floor((Math.random() * 100) + 1);
          }

          $http.patch('/api/articles/' + $scope.editingArticle._id, $scope.editingArticle).success(function(article){
            $location.path('/articles/' + $scope.editingArticle._id);
            resetVars();
          });

        } else {          
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

          if ($scope.coverImageUrl && $scope.warnUrl) {
            newArticle.coverImg = $scope.coverImageUrl;
          } else {
            newArticle.coverImg = 'http://loremflickr.com/750/240/landscape?random=' + Math.floor((Math.random() * 100) + 1);
          }

          $http.post('/api/articles', {newArticle: newArticle, newTags: partitionedTags[0]}).success(function(article){
            resetVars();
            $location.path('/articles/' + article._id);
          });
          
        }


      } else {
            $location.path('/login');
            alert('กรุณาเข้าสู้ระบบก่อนเข้าร่วมการสนทนา')
      }
    };

  });