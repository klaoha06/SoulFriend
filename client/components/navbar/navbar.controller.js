'use strict';

angular.module('puanJaiApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $state) {
    $scope.menu = [
    {
      'title': 'ข่าวสารนําใจ',
      'link': '/news'
    }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/');
      // window.location.reload();
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };


    $scope.displayName = function(){
      // debugger;
      if (Auth.isLoggedIn()) {
        if (Auth.getCurrentUser().username) {
          return Auth.getCurrentUser().username;
        } else {
          var full = Auth.getCurrentUser().name.first + " " + Auth.getCurrentUser().name.last;
          return full;
        }
      }
    };

  })
.controller('DropdownCtrl', function ($scope) {
  $scope.helps = [
 {
   'title': 'ตอบปัญหาเพื่อนใจ',
   'link': '/'
 },
 {
   'title': 'สมัครเป็นนักเขียน',
   'link': '/writer'
 },
 {
   'title': 'สมัครเป็นผู้แนะนําทางใจ',
   'link': '/assist'
 },
  {
   'title': 'รับผู้ร่วมงานเพิ่ม',
   'link': '/help'
 }
  ];

   $scope.abouts = [
  {
    'title': 'รู้จักกับผู้สร้าง',
    'link': '/about'
  },
  {
    'title': 'เพื่อนใจทําไมกัน',
    'link': '/why'
  },
  {
    'title': 'มาเป็นส่วนหนึ่งกับเรา',
    'link': '/join'
  }
   ];

  $scope.status = {
    isopen: false
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.closeCollapse = function(e){
    // $e.preventDefault();
    debugger;
    var w = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
    if (w <= 767) {
      $scope.isCollapsed = !$scope.isCollapsed;
    }
  };
});

