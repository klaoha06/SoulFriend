'use strict';

angular.module('puanJaiApp')
.controller('AboutCreatorCtrl', function ($scope, $http, parallaxHelper) {

	$scope.background = parallaxHelper.createAnimator(-0.6);
});

