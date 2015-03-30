angular.module('puanJaiApp')
  .controller('questionCtrl', function ($scope, $http, socket, $stateParams, Auth, $location, Facebook, $cookieStore) {
    $scope.textEditorInput;
    $scope.currentUser = Auth.getCurrentUser();
    $scope.editingAns = false;
    var userId = localStorage.getItem('userId');
    var questionId;

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
        if ($scope.question.ownerId === userId) {
          return true;
        } else {
          return false;
        }
      };
      if ($scope.currentUser){
        getUserAns();
      }
      socket.syncUpdates('question', $scope.question, function(event, oldquestion, newquestion){
        _.merge($scope.question, newquestion);
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

    $scope.deleteQuestion = function(){
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
      $cookieStore.put('questionTitle', $scope.question.name);
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
           $http.patch('/api/questions/' + $stateParams.id, {questionToUpdate: $scope.question}).success(function(res) {
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
           $http.patch('/api/questions/' + $stateParams.id, {questionToUpdate: $scope.question}).success(function(res) {
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
           $http.patch('/api/questions/' + $stateParams.id, {questionToUpdate: $scope.question}).success(function(res) {
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

    $scope.deleteMyAns = function(){
      var r = confirm("ต้องการลบคําตอบนี้?");
      if (r === true) {
        getUserAns();
        $scope.question.answers.splice($scope.userAnsIndex, 1);
        $scope.question.answers_count--;
        $http.patch('/api/questions/' + $stateParams.id, {questionToUpdate: $scope.question}).success(function(res) {
          getUserAns();
        });
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
      $http.patch('/api/questions/' + $stateParams.id, {questionToUpdate: $scope.question});
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

     // On leave page
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('question');
    });
  });