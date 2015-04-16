'use strict';

angular.module('puanJaiApp')
.controller('suggestCtrl', function ($scope, $http, Auth, $location, socket, $window) {
	$scope.currentUser = Auth.getCurrentUser();
	$scope.skip = 0;
	$scope.editingSuggestion = false;

	function getSuggestions() {
	  $http.get('/api/suggestions', { params: {skip: $scope.skip}}).success(function(suggestions) {
	    if ($scope.skip > 0){
	      $scope.suggestions = $scope.suggestions.concat(suggestions);
	    } 
	    else {
	      $scope.suggestions = suggestions;
	    }
	    socket.syncUpdates('suggestion', $scope.suggestions);
	  });
	}

	if (!$scope.suggestions) {
		getSuggestions();
	}

	function formValidate() {
		if (!$scope.suggestionInput) {
			alert('กรุณาใส่ระหว่าง 10 ถึง 300 อักขระ')
			return false;
		}
		if ($scope.suggestionInput.length > 300 || $scope.suggestionInput.length < 10){
			alert('กรุณาใส่ระหว่าง 10 ถึง 300 อักขระ')
			return false;
		}
		var userSuggestion = _.where($scope.suggestions,{'ownerId': $scope.currentUser._id});
		if (userSuggestion.length > 10) {
			alert('สามารถให้คําแนะนําได้มากสุด 10 คําครับ')
			return false;
		} 
		return true;
	}

	$scope.createSuggestion = function(){
		if (!formValidate()) {
			return;
		}
		var newSuggestion = {
		  content: $scope.suggestionInput,
			ownerId: $scope.currentUser._id,
		  owner: {
		  	username: $scope.currentUser.username,
		  	role: $scope.currentUser.role,
		    coverimg: $scope.currentUser.coverimg
		  }
		};
		$http.post('/api/suggestions', newSuggestion).success(function(suggestion){
			$scope.suggestions.concat(suggestion);
			$scope.suggestionInput = '';
		});
	};

	$scope.isLoggedIn = function(){
	  if(!Auth.isLoggedIn()){
	      alert('กรณาเข้าสู่ระบบก่อนร่วมตอบปัญหานะครับ');
	      $location.path('/login');
	  } else {
	    return;
	  }
	};

	$scope.upVote = function(suggestionId){
		if (Auth.isLoggedIn()){
		  var index = _.findIndex($scope.suggestions,{'_id': suggestionId});
		  var currentSuggestion = $scope.suggestions[index];
		    if (_.include(currentSuggestion.upvotes, $scope.currentUser._id)) {
		      alert('คุณได้ให้โหวตแล้ว');
		      return;
		    } else {
		     $scope.suggestions[index].votes_count++;
		     $scope.suggestions[index].upvotes.push($scope.currentUser._id);
		     $http.patch('/api/suggestions/' + suggestionId, $scope.suggestions[index]);
		    }
		} else {
		  $location.path('/login');
		  alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');
		}
	};

	$scope.downVote = function(suggestionId){
		if (Auth.isLoggedIn()){
		  var index = _.findIndex($scope.suggestions,{'_id': suggestionId});
		  var currentSuggestion = $scope.suggestions[index];
		    if (_.include(currentSuggestion.downvotes, $scope.currentUser._id)) {
		      alert('คุณได้ให้โหวตแล้ว');
		      return;
		    } else {
		     $scope.suggestions[index].votes_count--;
		     $scope.suggestions[index].downvotes.push($scope.currentUser._id);
		     $http.patch('/api/suggestions/' + suggestionId, $scope.suggestions[index]);
		    }
		} else {
		  $location.path('/login');
		  alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');
		}
	};

	$scope.deleteSuggestion = function(suggestionId){
		var r = confirm("ต้องการลบคําแนะนํานี้?");
		if (r === true) {
		  var suggestionIndex = _.findIndex($scope.suggestions,{'_id': suggestionId});
		  $http.delete('/api/suggestions/' + suggestionId);
		  $scope.suggestions.splice(suggestionIndex, 1);
		} else {
		  return;
		}
	};

	$scope.openEditor = function(suggestion){
		$scope.editingSuggestion=suggestion._id;
		$scope.suggestionInput = suggestion.content;
		$window.scrollTo(500, 0);
	};

	$scope.editSuggestion = function(){
		if (!formValidate()) {
			return;
		}
		var suggestionIndex = _.findIndex($scope.suggestions,{'_id': $scope.editingSuggestion});
		if ($scope.suggestionInput !== $scope.suggestions[suggestionIndex].content) {
			$scope.suggestions[suggestionIndex].content = $scope.suggestionInput;
			$http.patch('/api/suggestions/' + $scope.editingSuggestion, $scope.suggestions[suggestionIndex]);
			$scope.editingSuggestion=false;
		}
	};

	$scope.getMoreSuggestions = function(){
		$scope.skip++;
		getSuggestions();
	};

	 // On leave page
	$scope.$on('$destroy', function () {
	  socket.unsyncUpdates('suggestion');
	});

});

