'use strict';

angular.module('puanJaiApp')
.controller('reportCtrl', function () {
	// $scope.currentUser = Auth.getCurrentUser();
	// $scope.skip = 0;
	// $scope.editingReport = false;

	// function formValidate(){
	// 	if (!$scope.reportInput) {
	// 		alert('กรุณาใส่ระหว่าง 10 ถึง 300 อักขระ')
	// 		return false;
	// 	}
	// 	if ($scope.reportInput.length > 300 || $scope.reportInput.length < 10){
	// 		alert('กรุณาใส่ระหว่าง 10 ถึง 300 อักขระ')
	// 		return false;
	// 	}
	// 	var userReport = _.where($scope.reports,{'ownerId': $scope.currentUser._id});
	// 	if (userReport.length > 10) {
	// 		alert('สามารถให้คําแนะนําได้มากสุด 10 คําครับ')
	// 		return false;
	// 	} 
	// 	return true;
	// }

	// function getReports() {
	// 	console.log($scope.skip)
	//   $http.get('/api/reports', { params: {skip: $scope.skip}}).success(function(reports) {
	//     if ($scope.skip > 0){
	//       $scope.reports = $scope.reports.concat(reports);
	//     } 
	//     else {
	//       $scope.reports = reports;
	//     }
	//     socket.syncUpdates('report', $scope.reports);
	//   });
	// }

	// if (!$scope.reports) {
	// 	getReports();
	// }

	// $scope.createReport = function(){
	// 	if (!formValidate()) {
	// 		return;
	// 	}
	// 	var newReport = {
	// 	  content: $scope.reportInput,
	// 		ownerId: $scope.currentUser._id,
	// 	  owner: {
	// 	  	username: $scope.currentUser.username,
	// 	  	role: $scope.currentUser.role,
	// 	    coverimg: $scope.currentUser.coverimg
	// 	  }
	// 	};
	// 	$http.post('/api/reports', newReport).success(function(report){
	// 		$scope.reports.concat(report);
	// 		$scope.reportInput = '';
	// 	});
	// };

	// $scope.isLoggedIn = function(){
	//   if(!Auth.isLoggedIn()){
	//       alert('กรณาเข้าสู่ระบบก่อนร่วมตอบปัญหานะครับ');
	//       $location.path('/login');
	//   } else {
	//     return;
	//   }
	// };

	// $scope.upVote = function(reportId){
	// 	if (Auth.isLoggedIn()){
	// 	  var index = _.findIndex($scope.reports,{'_id': reportId});
	// 	  var currentreport = $scope.reports[index];
	// 	    if (_.include(currentreport.upvotes, $scope.currentUser._id)) {
	// 	      alert('คุณได้ให้โหวตแล้ว');
	// 	      return;
	// 	    } else {
	// 	     $scope.reports[index].votes_count++;
	// 	     $scope.reports[index].upvotes.push($scope.currentUser._id);
	// 	     $http.patch('/api/reports/' + reportId, $scope.reports[index]);
	// 	    }
	// 	} else {
	// 	  $location.path('/login');
	// 	  alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');
	// 	}
	// };

	// $scope.downVote = function(reportId){
	// 	if (Auth.isLoggedIn()){
	// 	  var index = _.findIndex($scope.reports,{'_id': reportId});
	// 	  var currentReport = $scope.reports[index];
	// 	    if (_.include(currentReport.downvotes, $scope.currentUser._id)) {
	// 	      alert('คุณได้ให้โหวตแล้ว');
	// 	      return;
	// 	    } else {
	// 	     $scope.reports[index].votes_count--;
	// 	     $scope.reports[index].downvotes.push($scope.currentUser._id);
	// 	     $http.patch('/api/reports/' + reportId, $scope.reports[index]);
	// 	    }
	// 	} else {
	// 	  $location.path('/login');
	// 	  alert('กรุณาเข้าระบบหรือสมัครเป็นสมาชิกก่อนนะครับ : )');
	// 	}
	// };

	// $scope.deleteReport = function(reportId){
	// 	var r = confirm("ต้องการลบคําแนะนํานี้?");
	// 	if (r === true) {
	// 	  var reportIndex = _.findIndex($scope.reports,{'_id': reportId});
	// 	  $http.delete('/api/reports/' + reportId);
	// 	  $scope.reports.splice(reportIndex, 1);
	// 	  $scope.editingReport = false;
	// 	} else {
	// 	  return;
	// 	}
	// };

	// $scope.openEditor = function(report){
	// 	$scope.editingReport=report._id;
	// 	$scope.reportInput = report.content;
	// 	$window.scrollTo(500, 0);
	// };

	// $scope.editReport = function(){
	// 	if (!formValidate()) {
	// 		return;
	// 	}
	// 	var reportIndex = _.findIndex($scope.reports,{'_id': $scope.editingReport});
	// 	if ($scope.reportInput !== $scope.reports[reportIndex].content) {		
	// 		$scope.reports[reportIndex].content = $scope.reportInput;
	// 		$http.patch('/api/reports/' + $scope.editingReport, $scope.reports[reportIndex]);
	// 		$scope.editingReport=false;
	// 	}
	// };

	// $scope.getMoreReports = function(){
	// 	$scope.skip++;
	// 	getReports();
	// };

	//  // On leave page
	// $scope.$on('$destroy', function () {
	//   socket.unsyncUpdates('report');
	// });

});

