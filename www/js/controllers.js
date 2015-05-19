angular.module('app.controllers', ['ngCordova'])
 
.controller('VideoCtrl', function($scope, $cordovaCapture) {
    console.log("in ctrl");
    $scope.clip = '';

    // capture callback
	var captureSuccess = function(mediaFiles) {
		console.log(mediaFiles[0].fullPath);
	};

	// capture error callback
	var captureError = function(error) {
	    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
	};

	$scope.captureVideo = function() {
		console.log("Capturing...");
		var options = { "duration": 10 };
		navigator.device.capture.captureVideo(captureSuccess, captureError, options);
	};

});