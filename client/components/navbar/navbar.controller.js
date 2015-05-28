'use strict';

angular.module('puanJaiApp')
  .controller('NavbarCtrl', function ($rootScope, $scope, $location, Auth, $state, $window, $http) {
    $rootScope.$on('userUpdated', function(event, data){
      $scope.user = data;
      $scope.userId = $scope.user._id;
    });
    $scope.user = Auth.getCurrentUser();
    $scope.menu = [
    {
      'title': 'ข่าวสาร',
      'link': 'https://www.facebook.com/pages/%E0%B9%80%E0%B8%9E%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B9%83%E0%B8%88/1592540364334390?ref=hl'
    },
    {
      'title': 'กิจกรรม',
      'link': '/service'
    }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

     $scope.helps = [
    // {
    //   'title': 'ตอบปัญหาเพื่อนใจ',
    //   'link': '/'
    // },
    // {
    //   'title': 'ให้ความรู้',
    //   'link': '/share'
    // },
    // {
    //   'title': 'สมัครเป็นนักเขียน',
    //   'link': '/writer'
    // },
    {
      'title': 'สมัครเป็นผู้แนะนําทางใจ',
      'link': '/assist'
    },
     {
      'title': 'ร่วมงานกับเรา',
      'link': '/help'
    },
    //  {
    //   'title': 'เราทํางานไม่ได้เงิน',
    //   'link': '/help'
    // }
     ];

      $scope.abouts = [
     {
       'title': 'เพื่อนใจทําไมกัน',
       'link': '/about'
     },
     {
       'title': 'รู้จักกับผู้สร้าง',
       'link': '/aboutcreator'
     },
     {
       'title': 'มาเป็นส่วนหนึ่งกับเรา',
       'link': '/support'
     },
     {
       'title': 'ติดต่อ',
       'link': '/contact'
     },
      ];

      $scope.userOptions = [
     {
       'title': 'หน้าของฉัน',
       'link': '/profile'
     },
     {
       'title': 'ตั่งค่า',
       'link': '/settings'
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


    $scope.logout = function() {
      Auth.logout();
      $location.path('/');
      $window.location.reload();
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.search = function(){
      $scope.searching = true;
    };

    var output;
    $scope.searchQuestions = function(input) {
      $scope.userInput = input;
      if (input.length < 3) {
        output = [{_source: {name:'ไม่มีสิ่งที่หาในระบบ : ('}}];
        return [{_source: {name:'ไม่มีสิ่งที่หาในระบบ : ('}}];
      }
      return $http.get('/api/questions/search', { params: {q: input}}).then(function(response){
        if (response.data.hits.hits.length > 0){
          output = response.data.hits.hits;
        }
        if (output){ 
          return output.map(function(item){
            return item;
          });
        } else {
          return response.data.hits.hits.map(function(item){
            return item;
          });
        }
      });
    };

    $scope.goToQuestion = function(model){
      $location.path('/questions/'+model._id);
      $scope.customSelected = '';
      $scope.searching = false;
    };

  });

