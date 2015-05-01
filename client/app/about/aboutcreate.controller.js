'use strict';

angular.module('puanJaiApp')
.controller('AboutCreatorCtrl', function ($scope) {

		$scope.backgroundImgUrl = '/assets/images/background' + Math.floor((Math.random()*6)+1).toString() + '.jpg';

});

