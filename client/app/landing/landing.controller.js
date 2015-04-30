'use strict';

angular.module('puanJaiApp')
.controller('LandingCtrl', function ($scope, $http, socket, $state, Auth, $window) {

	// $scope.background = parallaxHelper.createAnimator(-0.7);

	$http.get('/api/users/sampleusers').success(function(sampleUsers){
		$scope.userGroups = _.chunk(sampleUsers, 3);
	});

	$scope.myInterval = 5000;
	 var slides = $scope.slides = [];
	 $scope.addSlide = function() {
	   var newWidth = 1360 + slides.length + 1;
	   slides.push({
	     image: 'http://placekitten.com/' + newWidth + '/500',
	     lead: ['ชุมชนเพื่อช่วยเหลือจิตใจของกันและกัน','สร้างด้วยใจและความรักต่อส่วนรวม','ศูนย์กลางในการเผยแผ่ปัญญาสู่ความสุข'][slides.length % 3],
	     text: ['มารู้จักเรา','มารู้จักกับผู้ริเริ่ม','สมัครเป็นนักเขียนเพื่อนใจ'][slides.length % 3]
	   });
	 };
	 for (var i=0; i<3; i++) {
	   $scope.addSlide();
	 }
     // Login with FB
     $scope.loginOauth = function(provider) {
       $window.location.href = '/auth/' + provider;
     };


   });
