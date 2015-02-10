'use strict';

angular.module('puanJaiApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [
    {
      'title': 'หน้าหลัก',
      'link': '/'
    },
    {
      'title': 'มารู้จักกับเรา',
      'link': '/about'
    },
    {
      'title': 'วิธีใช้',
      'link': '/how'
    },
    {
      'title': 'ส่งบทความ',
      'link': 'article'
    },
    {
      'title': 'ติดต่อ',
      'link': '/contact'
    }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });