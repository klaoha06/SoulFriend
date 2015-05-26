'use strict';

angular.module('puanJaiApp')
  .controller('SettingsCtrl', function ($scope) {
    $scope.template = 'editProfile/editprofile.html';

    $scope.sections = [
    {
      name: 'แก้ไขข้อมูลส่วนตัว',
      template: 'editProfile/editprofile.html'
    },
    {
      name: 'เปลี่ยนรหัส',
      template: 'changepass/changepassword.html'
    },
    // {
    //   name: 'ลืมรหัส',
    //   template: 'changepass/changepassword.html'
    // },
    //     {
    //   name: 'ลืมรหัส',
    //   template: 'changepass/changepassword.html'
    // }
    ];

    $scope.setSection = function(sectionTemplate){
      $scope.template = sectionTemplate;
    };

  });
