angular.module('puanJaiApp')
.controller('tagCloudCtrl', function ($scope, $http) {
  $scope.popTags = [] || $scope.popTags;

    $http.get('/api/tags', {orderBy: 'popular_count'}).success(function(tags) {
      angular.forEach(tags, function(tag){
        $scope.popTags.push({text: tag.name, weight: tag.popular_count, link: 'tags/' + tag._id})
      });
    });

   });


