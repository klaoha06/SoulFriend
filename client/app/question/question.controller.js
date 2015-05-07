angular.module('puanJaiApp')
  .controller('questionCtrl', function ($scope, $http, socket, $stateParams, Auth, $filter, $location, Facebook, $cookieStore, $rootScope) {
    $scope.textEditorInput;
    $scope.currentUser = Auth.getCurrentUser();
    var orderBy = $filter('orderBy');
    var userId = $rootScope.user._id || localStorage.getItem('userId');
    var questionId;
    $scope.editingAns = false;
    $scope.isCollapsed = true;
    $scope.isCollapsedInAns = true;
    $scope.newCommentForAns = '';

    function getUserAns() {
      $scope.userAnsIndex = _.findIndex($scope.question.answers,{'user_id': userId});
      $scope.userAns = $scope.question.answers[$scope.userAnsIndex];
    }

    $scope.timeNow = function() {
      return Date.now() ;
    };

    $http.get('/api/questions/' + $stateParams.id).success(function(question) {
      $scope.question = question;
      questionId = $scope.question._id;
      $scope.questionOwner = function(){
        if ($scope.question.ownerId && $scope.question.ownerId === userId) {
          return true;
        } else {
          return false;
        }
      };
      if ($scope.currentUser){
        getUserAns();
      }
      if (!$scope.questionGroups) {      
        $http.get('/api/questions/search', { params: {userInput: $scope.question.name}}).success(function(result) {
          _.remove(result.hits.hits, function(q){
            return q._id === $scope.question._id;
          });
          var searchResults = orderBy(result.hits.hits, '_score', true);
          $scope.questionGroups = _.chunk(searchResults, 3);
        });
      }

      socket.syncUpdates('question', $scope.question, function(event, oldquestion, newquestion){
        _.merge($scope.question, newquestion);
      });
    })

    .error(function(res){
      $scope.error = res;
      console.log($scope.error)
    });
 

    $scope.shareFB = function(url){
      var htmlToText = $filter('htmlToText');
      Facebook.ui({
        method: 'feed',
        name: $scope.question.name,
        link: 'http://puanjai.com/questions/'+$scope.question._id,
        picture: 'https://d13yacurqjgara.cloudfront.net/users/60166/screenshots/2028575/love_sunrise.jpg',
        caption: 'เพื่อนใจ - ชุมชนเพื่อแบ่งปันปัญหาใจและช่วยกันพัฒนาความสุข',
        description: htmlToText($scope.question.body),
        message: $scope.question.name
      });
    };

    $scope.deleteQuestion = function(){
      if (!$scope.questionOwner()) {
        return;
      }
      var r = confirm("ต้องการลบคําถามนี้?")
      if (r === true) {
        $http.delete('api/questions/' + $stateParams.id).then(function(){
          alert('คําถามของคุณถูกลบเรียบร้อยแล้ว');
          $location.path('/');
        });
      } else {
        return;
      }
    };

    $scope.editQuestion = function(){
      localStorage.setItem('editQuestion', $scope.question._id);
      localStorage.setItem('questionContent', $scope.question.body);
      localStorage.setItem('questionTitle', $scope.question.name);
      $cookieStore.put('tags', $scope.question.tags);
      $cookieStore.put('topic', $scope.question.topic);
      $location.path('/ask');
    };

    $scope.upVote = function(questionId){
      if (Auth.isLoggedIn()){
          if (_.include($scope.question.upvotes, userId)) {
            alert('คุณได้ให้โหวตแล้ว');
            return;
          } else {
           $scope.question.votes_count++;
           $scope.question.upvotes.push(userId);
           $http.post('/api/questions/' + questionId + '/upvote', { _questionId: questionId, userId: userId });
          }
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');
      }
    };

    $scope.downVote = function(questionId){
      if (Auth.isLoggedIn()){
          if (_.include($scope.question.downvotes, userId)) {
            alert('คุณได้ให้โหวตแล้ว');
            return;
          } else {
           $scope.question.votes_count--;
           $scope.question.downvotes.push(userId);
           $http.post('/api/questions/' + questionId + '/downvote', { _questionId: questionId, userId: userId });
          }
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )')
      }
    };

    $scope.addJai = function(questionId){
      if (Auth.isLoggedIn()){
          if (_.include($scope.question.jais, userId)) {
            alert('คุณได้ให้กําลังใจแล้ว');
            return;
          } else {
           $scope.question.jais.push(userId);
           $scope.question.jais_count++;
           $http.post('/api/questions/' + questionId + '/addjai', { _questionId: questionId, userId: userId });
          }
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )')
      }
    };

    $scope.upVoteAns = function(ansUserId){
      var index = _.findIndex($scope.question.answers,{'user_id': ansUserId});
      var currentAns = $scope.question.answers[index];
      if (Auth.isLoggedIn()){
          if (_.include(currentAns.upvotes, userId)) {
            alert('คุณได้ให้โหวตแล้ว');
            return;
          } else {
            $scope.question.answers[index].votes_count++;
            $scope.question.answers[index].upvotes.push(userId);
           $http.patch('/api/questions/' + $stateParams.id + '/answers', $scope.question.answers).success(function(res) {
            console.log(res);
           });
          }
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )')
      }
    };

    $scope.downVoteAns = function(ansUserId){
      var index = _.findIndex($scope.question.answers,{'user_id': ansUserId});
      var currentAns = $scope.question.answers[index];
      if (Auth.isLoggedIn()){
          if (_.include(currentAns.downvotes, userId)) {
            alert('คุณได้ให้โหวตแล้ว');
            return;
          } else {
            $scope.question.answers[index].votes_count--;
            $scope.question.answers[index].downvotes.push(userId);
           $http.patch('/api/questions/' + $stateParams.id + '/answers', $scope.question.answers).success(function(res) {
            console.log(res);
           });
          }
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )')
      }
    };

    $scope.makeGoodAns = function(ansUserId){
      var currentAnsindex = _.findIndex($scope.question.answers,{'user_id': ansUserId});
      if (Auth.isLoggedIn()){
            $scope.question.answers[currentAnsindex].goodAns = !$scope.question.answers[currentAnsindex].goodAns;
            angular.forEach($scope.question.answers, function(q){
              if (q.goodAns === true) {
                $scope.question.answered = true;
              } else {
                $scope.question.answered = false;
              }
            });
           $http.patch('/api/questions/' + $stateParams.id, $scope.question).success(function(res) {
            // console.log(res);
           });
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )')
      }
    };

    $scope.report = function(){
      if (Auth.isLoggedIn()){
          if (_.include($scope.question.reports, userId)) {
            alert('คุณได้รายงานความไม่เหมาะสมแล้ว');
            return;
          } else {
            $scope.question.reports.push(userId);
           $http.post('/api/questions/' + questionId + '/report', { _questionId: questionId, userId: userId }).success(function(err, res){
            alert('ขอบคุณที่ช่วยรายงานความไม่เหมาะสมครับ')
           });
          }
      } else {
        $location.path('/login');
        alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');
      }
    };

    $scope.deleteMyAns = function(index){
      var r = confirm("ลบคําตอบนี้?");
      if (r === true) {
        $scope.question.answers_count--;
        $http.delete('/api/questions/' + $stateParams.id + '/answers/' + $scope.question.answers[index].user_id).success(function(res) {
          getUserAns();
        });
        $scope.question.answers.splice(index, 1);
      } else {
        return;
      }
    };

    $scope.editMyAns = function(){
      $scope.userAnsIndex = -1;
      $scope.textEditorInput = $scope.userAns.content;
      $scope.editingAns = true;
    };

    $scope.onEditAns = function(){
      $scope.userAnsIndex = _.findIndex($scope.question.answers,{'user_id': userId});
      $scope.question.answers[$scope.userAnsIndex].content = $scope.textEditorInput;
      $http.patch('/api/questions/' + $stateParams.id, $scope.question);
      $scope.editingAns=false;
      $scope.textEditorInput = false;  
    };

    $scope.onSubmit = function(){
      if (Auth.isLoggedIn()) {
        function htmlToPlaintext(text) {
          return String(text).replace(/<[^>]+>/gm, '');
        }
        var text = htmlToPlaintext($scope.textEditorInput);
        if (text.length < 40 || text.length > 6000) {
          alert('คําตอบต้องมียาวระหว่าง 40 ถึง 6000 อักขระ');
          return;
        }
        var newAnswer = {
          content: $scope.textEditorInput,
          username: $scope.currentUser.username,
          name: $scope.currentUser.name,
          user_id: userId,
          coverimg: $scope.currentUser.coverimg,
          comments:[],
          votes_count: 0,
          upvotes: [],
          downvotes: [],
          goodAns: false,
          created: Date.now()
        };
        $scope.question.answers.push(newAnswer);
        $scope.question.answers_count++;
        $http.put('/api/questions/' +  $stateParams.id + '/newanswer', newAnswer).success(function(res){
          getUserAns();
        });
        $scope.textEditorInput = false;  
      } else {
            $location.path('/login');
            alert('กรุณาเข้าสู้ระบบก่อนเข้าร่วมการสนทนา')
      }
    };

    $scope.isLoggedIn = function(){
      if(!Auth.isLoggedIn()){
          alert('กรณาเข้าสู่ระบบก่อนร่วมตอบปัญหานะครับ');
          $location.path('/login');
      } else {
        return;
      }
    };

    $scope.addComment = function() {
      if(typeof $scope.newComment === 'undefined') {
        return;
      }
      if ($scope.newComment.length < 3 || $scope.newComment.length > 150) {
        return;
      }

      if (Auth.isLoggedIn()) {
        var user = Auth.getCurrentUser();
        var newComment = { 
          content: $scope.newComment,
          comments: [],
          user_id: user._id,
          user: {
            username: user.username,
            name: user.name,
            coverimg: user.coverimg
          },
          created: Date.now()
        };
        $scope.question.comments.push(newComment);
        $http.patch('/api/questions/' + $stateParams.id, $scope.question).success(function(res) {
         // console.log(res);
        });
        // $http.patch('/api/questions/' +  $stateParams.id, newComment);
        // $scope.alreadyCommented = true;
        $scope.isCollapsed=true;
        $scope.newComment = '';
      } else {
        $location.path('/login');
        alert('กรุณาเข้าสู้ระบบก่อนเข้าร่วมการสนทนา')
      }
    };

    $scope.addCommentToAns = function(content, answerUserId){
      if(content === 'undefined') {
        return;
      }
      if (content.length < 3 || content.length > 150) {
        return;
      }
      if (Auth.isLoggedIn()) {
        var answerIndex = _.findIndex($scope.question.answers,{'user_id': answerUserId});
        var answerInQuestion = $scope.question.answers[answerIndex];
        var user = Auth.getCurrentUser();
        var newComment = { 
          content: content,
          user_id: $scope.currentUser._id,
          username: $scope.currentUser.username,
          created: Date.now()
        };
        answerInQuestion.comments.push(newComment);
        // $http.patch('/api/questions/' + $stateParams.id, $scope.question).success(function(res) {
        //  // console.log(res);
        // });
        $http.patch('/api/questions/' + $stateParams.id + '/answers', $scope.question.answers).success(function(res) {
         // console.log(res);
        });
        $scope.isCollapsedInAns = false;
        $scope.newCommentForAns = '';
      } else {
        $location.path('/login');
        alert('กรุณาเข้าสู้ระบบก่อนเข้าร่วมการสนทนา')
      }
    };

    $scope.deleteMyComment = function(index, where, answerId){
      var r = confirm("ต้องการลบความคิดเห็นนี้?");
      if (r === true) {
        if (where === 'answer') {
          var ansIndex = _.findIndex($scope.question.answers,{'user_id': answerId});
          var ans = $scope.question.answers[ansIndex];
          ans.comments.splice(index, 1);
        } else {        
          $scope.question.comments.splice(index, 1);
        }
          $http.patch('/api/questions/' + $stateParams.id, $scope.question).success(function(res) {
            // $scope.alreadyCommented=false;
          });
      } else {
        return;
      }
    };

    // $scope.deleteMyCommentInAns = function(index){
    //   var r = confirm("ต้องการลบความคิดเห็นนี้?");
    //   if (r === true) {
    //     $scope.question.answer[].comments.splice(index, 1);
    //     $http.patch('/api/questions/' + $stateParams.id, {questionToUpdate: $scope.question}).success(function(res) {
    //       // $scope.alreadyCommented=false;
    //     });
    //   } else {
    //     return;
    //   }
    // };

    $scope.openEditor = function(commentContent, typeOrId, commentIndex){
      if (typeOrId === 'question') {
        $scope.isCollapsed = !$scope.isCollapsed;
        $scope.newComment = commentContent;
        // $scope.editing=true;
      } else {

        console.log(commentContent)
        console.log(typeOrId)
        console.log(commentIndex)
      }
      // $scope.newComment = commentContent;
      $scope.editing=true;

      $scope.editMyComment = function(){
        // $scope.userCommentIndex = _.findIndex($scope.article.comments,{'user_id': userId});
        $scope.isCollapsed = !$scope.isCollapsed;
        if (typeOrId === 'question') {
          $scope.question.comments[commentIndex].content = $scope.newComment;
        } else {

          if (commentIndex && commentContent) {
            answerInQuestion.comments[commentIndex]

          } else {
            console.log($scope.newCommentForAns)

          }
        }
        $http.patch('/api/questions/' + $stateParams.id, {questionToUpdate: $scope.question}).success(function(res) {
          // $scope.alreadyCommented=false;
        });
          $scope.editing=false;
      };

    };



     // On leave page
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('question');
    });
  });