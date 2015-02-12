'use strict';

angular.module('puanJaiApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [
    {
      'title': 'เรื่องราวดีๆ',
      'link': '/news'
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

    $scope.displayName = function(){
      if (Auth.isLoggedIn()) {
        if (Auth.getCurrentUser().username) {
          return Auth.getCurrentUser().username;
        } else {
          var full = Auth.getCurrentUser().name.first + " " + Auth.getCurrentUser().name.last;
          return full;
        }
      }
    }

  });