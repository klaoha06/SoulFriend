'use strict';

angular.module('puanJaiApp')
.controller('LeftCtrl', function ($scope, $http, socket) {
	$scope.topics = [
	{
	  'title': 'ความรัก',
	  'link': '/topics/ความรัก',
	  'icon': 'fa-heart'
	},
	{
	  'title': 'ครอบครัว',
	  'link': '/topics/ครอบครัว',
	  'icon': 'fa-home'

	},
	{
	  'title': 'เพื่อน',
	  'link': '/topics/เพื่อน',
	  'icon': 'fa-users'

	},
	{
	  'title': 'การงาน',
	  'link': '/topics/การงาน',
	  'icon': 'fa-briefcase'

	},
	{
	  'title': 'ธุรกิจ',
	  'link': '/topics/ธุรกิจ',
	  'icon': 'fa-building-o'

	},
	{
	  'title': 'ชีวิต',
	  'link': '/topics/ชีวิต',
	  'icon': 'fa-street-view'
	},
	{
	  'title': 'การปัฎิบัติธรรม',
	  'link': '/topics/การปัฎิบัติธรรม',
	  'icon': 'fa-circle-thin'

	}
	];

	//Get Popular Tags
	


});
