angular.module('app.controllers', ['ngCordova'])
 
.controller('VideoCtrl', function($scope, $cordovaCapture) {
    console.log("in ctrl");
    $scope.clip = '';

    // capture callback
	var captureSuccess = function(mediaFiles) {
		videoURI = mediaFiles[0].fullPath;
		var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = videoURI.substr(videoURI.lastIndexOf('/')+1);
        options.mimeType = "video/quicktime";
        options.trustAllHosts = true;
        options.chunkedMode = false;
        var ft = new FileTransfer();
        ft.upload(videoURI, encodeURI("http://18.85.25.156:5000/"), 
	        // Succes
	        function(succes){
	            alert(succes.response);
	            console.log(succes.response);
	        }, 
	        function(error){
	            alert(error.target);
	            console.log(error);
	        }, 
	        options
	    );
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