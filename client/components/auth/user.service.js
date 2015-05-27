'use strict';

angular.module('puanJaiApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      editProfile: {
        method: 'PUT',
        params: {
          controller:'editprofile'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
