'use strict';

angular.module('puanJaiApp')
.controller('FooterCtrl', function ($scope, $filter) {
	$scope.year = $filter('date')(Date.now(),'yyyy');
});

