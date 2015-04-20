'use strict';

angular.module('puanJaiApp')
  .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q) {
    $rootScope.user = {};
    if($cookieStore.get('token')) {
      $rootScope.user = User.get(function(result){
        localStorage.setItem('userId', result._id);
      });
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          localStorage.setItem('userId', data.user._id);
          $rootScope.user = data.user;
          $rootScope.$emit('userUpdated', data.user);
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('editQuestion');
        localStorage.removeItem('questionContent');
        localStorage.removeItem('shareCoverImg');    
        $cookieStore.remove('topic');
        $cookieStore.remove('tags');
        $cookieStore.remove('questionTitle');
        $cookieStore.remove('questionContent');
        localStorage.removeItem('articleTags'); 
        localStorage.removeItem('articleTopic'); 
        localStorage.removeItem('articleTitle');
        localStorage.removeItem('articleImportance');
        localStorage.removeItem('articleConclusion');
        localStorage.removeItem('articleContent');
        localStorage.removeItem('shareCoverImg');
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(data) {
            $cookieStore.put('token', data.token);
            $cookieStore.put('userId', data.token);
            $rootScope.user = data.user;
            $rootScope.$emit('userUpdated', data.user);
            return cb(user);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: $rootScope.user._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return $rootScope.user;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return $rootScope.user.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if($rootScope.user.hasOwnProperty('$promise')) {
          $rootScope.user.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if($rootScope.user.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return $rootScope.user.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });
