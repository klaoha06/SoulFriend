'use strict';

angular.module('puanJaiApp')
.controller('SupportCtrl', function ($scope, $http) {

	//Get Popular Articles
	// if (!$scope.articles) {
	//   $http.get('/api/articles', { params: {category: 'popular'}}).success(function(articles) {
	//     $scope.articles = articles;
	//   });
	// }

	$scope.tasks = [
		{
			name: 'คนช่วยออกแบบตราและตัวละครให้เว็บไช',
			label: 'นักออกแบบ',
			link: '/help'
		},
		{
			name: 'คนช่วยทําวิดิโอแนะนําเพื่อนใจในหน้าแรกของเว็บ',
			label: 'คนทําวิดิโอมืออาชีพ',
			link: '/help'
		},
		{
			name: 'คนช่วยตอบปัญหาเพื่อนใจ',
			label: 'คนดี',
			link: '/help'
		},
		{
			name: 'รับสมัครนักเขียน',
			label: 'นักเขียน',
			link: '/help'
		},
		{
			name: 'รับสมัครเพื่อนร่วมงาน',
			label: 'คนดี',
			link: '/help'
		}
	];


});

