'use strict';

angular.module('puanJaiApp')
  .controller('ChangePassCtrl', function ($scope, User, Auth) {
    $scope.errors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if ($scope.user.newPassword !== $scope.user.repeatednewPassword) {
        $scope.message = 'รหัสใหม่ไม่เหมือนกัน กรุณาพิมใหม่';
        return;
      }

      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'เปลี่ยนรหัสเรียบร้อยแล้ว';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'รหัสผิด';
          $scope.message = '';
        });
      }
		};

  });
