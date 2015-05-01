'use strict';

angular.module('puanJaiApp')
.config(function ($stateProvider) {
	$stateProvider
	  .state('index', {
	    url: '/',
	    templateUrl: function(){
	    	if (document.cookie.match('token')){
	    		return 'app/main/main.html';
	    	} else {
	    		return 'app/landing/landing.html';
	    	}
	    }
	  })
	  .state('main',{
	  	url:'/main',
	  	templateUrl:'app/main/main.html',
	  	// controller: 'MainCtrl'
	  });
	});
