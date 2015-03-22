'use strict';

angular.module('puanJaiApp')
  .controller('profileCtrl', function ($scope, $http, socket, $stateParams, Auth, $cookieStore, User) {
    if($cookieStore.get('token')) {
        $scope.currentUser = User.get();
    }
    $scope.userId = localStorage.getItem('userId');

    $http.get('/api/questions', { params: { filterBy: { ownerId: $scope.userId}}}).success(function(questions){
        $scope.myQuestions = questions;
    });

    $scope.onSelectCategory = function(category){
        switch(category){
            case 'myQuestions':
                $http.get('/api/questions', { params: { filterBy: { ownerId: $scope.userId}}}).success(function(questions){
                    $scope.myQuestions = questions;
                });
                break;
            case 'myArticles':
                $http.get('/api/articles', { params: { filterBy: { ownerId: $scope.userId}}}).success(function(articles){
                    $scope.myArticles = articles;
                });
                break;
            case 'myAnswersInQuestions':
                $http.get('/api/questions/myanswers', { params: {userId: $scope.userId}}).success(function(questions){
                    $scope.myAnswersInQuestions = questions;
                });
                break;
            default:
                $http.get('/api/questions', { params: { filterBy: { ownerId: $scope.userId}}}).success(function(questions){
                    $scope.myQuestions = questions;
                });
        }
    };



    // $scope.textEditorInput;

    // $http.get('/api/questions/').success(function(question) {
    //   $scope.question = question;
    //   $scope.question = question;
    //   if (currentUser){
    //     $scope.userAnsIndex = _.findIndex($scope.question.answers,{'user_id': userId});
    //     $scope.userAns = $scope.question.answers[$scope.userAnsIndex];
    //   }
    //   socket.syncUpdates('question', $scope.question, function(event, oldquestion, newquestion){
    //     _.merge($scope.question, newquestion);
    //   });
    // });

    // $scope.upVote = function(questionId){
    //   if (Auth.isLoggedIn()){
    //       if (_.include($scope.question.upvotes, userId)) {
    //         alert('คุณได้ให้โหวตแล้ว');
    //         return;
    //       } else {
    //        $scope.question.votes_count++;
    //        $scope.question.upvotes.push(userId);
    //        $http.post('/api/questions/' + questionId + '/upvote', { _questionId: questionId, userId: userId });
    //       }
    //   } else {
    //     $location.path('/login');
    //     alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');
    //   }
    // };

    // $scope.downVote = function(questionId){
    //   if (Auth.isLoggedIn()){
    //       if (_.include($scope.question.downvotes, userId)) {
    //         alert('คุณได้ให้โหวตแล้ว');
    //         return;
    //       } else {
    //        $scope.question.votes_count--;
    //        $scope.question.downvotes.push(userId);
    //        $http.post('/api/questions/' + questionId + '/downvote', { _questionId: questionId, userId: userId });
    //       }
    //   } else {
    //     $location.path('/login');
    //     alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )')
    //   }
    // };

    // $scope.addJai = function(questionId){
    //   if (Auth.isLoggedIn()){
    //       if (_.include($scope.question.jais, userId)) {
    //         alert('คุณได้ให้กําลังใจแล้ว');
    //         return;
    //       } else {
    //        $scope.question.jais.push(userId);
    //        $scope.question.jais_count++;
    //        $http.post('/api/questions/' + questionId + '/addjai', { _questionId: questionId, userId: userId });
    //       }
    //   } else {
    //     $location.path('/login');
    //     alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )')
    //   }
    // };

    // $scope.upVoteAns = function(ansUserId){
    //   var index = _.findIndex($scope.question.answers,{'user_id': ansUserId});
    //   var currentAns = $scope.question.answers[index];
    //   if (Auth.isLoggedIn()){
    //       if (_.include(currentAns.upvotes, userId)) {
    //         alert('คุณได้ให้โหวตแล้ว');
    //         return;
    //       } else {
    //         $scope.question.answers[index].votes_count++;
    //         $scope.question.answers[index].upvotes.push(userId);
    //        $http.patch('/api/questions/' + $stateParams.id, $scope.question).success(function(res) {
    //         console.log(res);
    //        });
    //       }
    //   } else {
    //     $location.path('/login');
    //     alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )')
    //   }
    // };

    // $scope.downVoteAns = function(ansUserId){
    //   var index = _.findIndex($scope.question.answers,{'user_id': ansUserId});
    //   var currentAns = $scope.question.answers[index];
    //   if (Auth.isLoggedIn()){
    //       if (_.include(currentAns.downvotes, userId)) {
    //         alert('คุณได้ให้โหวตแล้ว');
    //         return;
    //       } else {
    //         $scope.question.answers[index].votes_count--;
    //         $scope.question.answers[index].downvotes.push(userId);
    //        $http.patch('/api/questions/' + $stateParams.id, $scope.question).success(function(res) {
    //         console.log(res);
    //        });
    //       }
    //   } else {
    //     $location.path('/login');
    //     alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )')
    //   }
    // };

    // $scope.onSubmit = function(){
    //   if (Auth.isLoggedIn()) {
    //     function htmlToPlaintext(text) {
    //       return String(text).replace(/<[^>]+>/gm, '');
    //     }
    //     var text = htmlToPlaintext($scope.textEditorInput);
    //     if (text.length < 40 || text.length > 6000) {
    //       alert('คําตอบต้องมียาวระหว่าง 40 ถึง 6000 อักขระ');
    //       return;
    //     }

    //     var newAnswer = {
    //       content: $scope.textEditorInput,
    //       username: currentUser.username,
    //       name: currentUser.name,
    //       user_id: userId,
    //       coverimg: currentUser.coverimg,
    //       comments:[],
    //       votes_count: 0,
    //       upvotes: [],
    //       downvotes: [],
    //       goodAns: false,
    //       created: Date.now()
    //     };
    //     $scope.question.answers.push(newAnswer);
    //     $http.put('/api/questions/' +  $stateParams.id + '/newanswer', newAnswer).success(function(res){
    //       console.log(res);
    //     });
    //     $scope.textEditorInput = '';  
    //   } else {
    //         $location.path('/login');
    //         alert('กรุณาเข้าสู้ระบบก่อนเข้าร่วมการสนทนา')
    //   }
    // };

    //  // On leave page
    // $scope.$on('$destroy', function () {
    //   socket.unsyncUpdates('question');
    // });
  });