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
	  })
	  .state('googleace9067e30b64044', {
	  	url: '/googleace9067e30b64044.html',
	  	templateUrl:'app/googleace9067e30b64044.html'
	  })
	  .state('verified', {
	  	url:'/verified',
	  	templateUrl:'components/etc/verified.html'
	  })
	  .state('notverified', {
	  	url:'/notverified',
	  	templateUrl:'components/etc/notverified.html'
	  })
	  .state('sitemap', {
	  	url: '/sitemap.xml',
	  	templateUrl:'app/sitemap.xml'
	  });
	});
