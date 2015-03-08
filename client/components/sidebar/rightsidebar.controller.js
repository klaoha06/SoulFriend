'use strict';

angular.module('puanJaiApp')
.controller('RightCtrl', function ($scope, $http) {

	//Get Popular Articles
	if (!$scope.articles) {
	  $http.get('/api/articles', { params: {category: 'popular'}}).success(function(articles) {
	    // console.log(articles)
	    $scope.articles = articles;
	    // articleStore.set(articles);
	    // localStorage.set('articles', articles);
	    // socket.syncUpdates('article', $scope.articles);
	  });
	}


});
