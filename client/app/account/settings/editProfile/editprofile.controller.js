'use strict';

angular.module('puanJaiApp')
  .controller('EditProfileCtrl', function ($scope, $cookieStore, User, Auth, $http) {
    $scope.alerts = [];
    $scope.notSent = true;

    if ($cookieStore.get('token')) {    
       User.get(function(res){
         $scope.user = res;
         if ($scope.user.emailVerification === false) {
          $scope.alerts.push({msg: 'อีเมลของคุณยังไม่ได้การยืนยัง กรุณาเช็คอีเมลของคุณ', type: 'danger', icon: 'envelope-o'});
         }
       });
    }

    $scope.editProfile = function(form){
      if (!$scope.user.password && $scope.user.provider === 'local') {
        $scope.alerts.push({msg: 'กรุณาใส่รหัสก่อนแก้ไขข้อมูล'});
        return;
      }
      if(form.$valid && !form.$pristine) {
        var editedProfile = {
          name: {
            first: $scope.user.name.first,
            last: $scope.user.name.last
          },
          coverimg: $scope.user.coverimg,
          email: $scope.user.email,
          summary: $scope.user.summary,
          reason: $scope.user.reason,
          username: $scope.user.username,
          password: $scope.user.password
        };
        Auth.editProfile(editedProfile)
        .then( function(){
          $scope.alerts.push({msg:'แก้ไขข้อมูลส่วนตัวเรียบร้อย', type:'success'});
        })
        .catch( function(err){
          if (err.status === 422) {
            $scope.alerts.push({msg: 'มีคนใช้อีเมลนี้แล้ว กรุณาใส่อีเมลใหม่'});
          }
          if (err.status === 403) {
            $scope.alerts.push({msg: 'รหัสผิด กรุณาใส่รหัสอีกครั่ง'});
          }
          // form.password.$setValidity('mongoose', false);
        });
      }
    };

    $scope.closeAlert = function(index){
      $scope.alerts.splice(index,1);
    };

    $scope.sendVerificationEmail = function(){
      $scope.notSent = false;
      $http.get('/api/users/' + $scope.user._id + '/sendverificationemail');
    };

    $scope.allowEdit = function(){

    }

  });
