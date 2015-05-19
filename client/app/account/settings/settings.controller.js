'use strict';

angular.module('puanJaiApp')
  .controller('SettingsCtrl', function ($scope) {
    $scope.template = 'editprofile/editprofile.html';

    $scope.sections = [
    {
      name: 'แก้ไขข้อมูลส่วนตัว',
      template: 'editprofile/editprofile.html'
    },
    {
      name: 'เปลี่ยนรหัส',
      template: 'changepass/changepassword.html'
    },
    ];

    $scope.setSection = function(sectionTemplate){
      $scope.template = sectionTemplate;
    };

  });
