'use strict';

angular.module('puanJaiApp')
  .controller('EditProfileCtrl', function ($scope, $cookieStore, User) {
    $scope.alerts = [];

    if ($cookieStore.get('token')) {    
       User.get(function(res){
         $scope.user = res;
         console.log(res)
         if ($scope.user.emailVerification === false) {
          $scope.alerts.push({msg: 'อีเมลของคุณยังไม่ได้การยืนยัง กรุณาเช็คอีเมลของคุณ', type: 'danger', icon: 'envelope-o'})
         }
       });
    }

    $scope.closeAlert = function(index){
      $scope.alerts.splice(index,1);
    };

  });
