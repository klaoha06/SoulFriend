'use strict';

angular.module('puanJaiApp')
.controller('LandingCtrl', function ($scope, $http, $window, parallaxHelper) {

	$http.get('/api/users/sampleusers').success(function(sampleUsers){
		$scope.userGroups = _.chunk(sampleUsers, 3);
	});

	$scope.background = parallaxHelper.createAnimator(-0.5);

     // Login with FB
     $scope.loginOauth = function(provider) {
       $window.location.href = '/auth/' + provider;
     };

   });

angular.module('puanJaiApp')
.directive('disableAnimation', function($animate){
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
            $attrs.$observe('disableAnimation', function(value){
                $animate.enabled(!value, $element);
            });
        }
    };
});