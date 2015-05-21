var app = angular.module('app.controllers', ['ngCordova'])

var emailTemplate = '<html><head></head><body style="font-family: sans-serif;"><p>Attached is your GIF. There are a few more steps you need to import your GIF into Scratch.</p><ol><li> Download your GIF </li><li> Upload your GIF as a sprite in a Scratch Project </li></ol>Thanks!</body></html>';

app.controller('VideoCtrl', function($scope, $cordovaCapture, $ionicPopup, $http, $ionicLoading) {
    console.log("in ctrl");
    $scope.clip = 'img/blankgif_instructions.png';

    // capture callback
	var captureSuccess = function(mediaFiles) {
		setTimeout(function () {$scope.$apply(function () {$scope.loading = true;})}, 2000);
		videoURI = mediaFiles[0].fullPath;
		var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = videoURI.substr(videoURI.lastIndexOf('/')+1);
        options.mimeType = "video/quicktime";
        options.trustAllHosts = true;
        options.chunkedMode = false;
        var ft = new FileTransfer();
        ft.upload(videoURI, encodeURI("http://10.0.1.5:5000/"), 
	        // Succes
	        function(succes){
	        	// console.log("data:image/gif;base64,"+succes.response);
	        	console.log('here');
	        	setTimeout(function () {
			        $scope.$apply(function () {
			        	$scope.base64_gif = succes.response;
			            $scope.clip="data:image/gif;base64,"+$scope.base64_gif;
			            $scope.loading = false;
			        });
			    }, 2000);
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
		console.log("Error");
	};

	$scope.captureVideo = function() {
		console.log("Capturing...");
		var options = { "duration": 10 };
		navigator.device.capture.captureVideo(captureSuccess, captureError, options);
	};

	$scope.deleteGif = function() {
		$scope.clip = 'img/blankgif_instructions.png';
	}

	$scope.sendGif = function(){
		$scope.user = {};
		if($scope.clip != 'img/blankgif_instructions.png'){
			var emailPopup = $ionicPopup.show({
		    template: '<input type="email" ng-model="user.email">',
		    title: 'Enter Your Email',
		    subTitle: 'We will send you your video to import into Scratch',
		    scope: $scope,
		    buttons: [
		      { text: 'Cancel' },
		      {
		        text: '<b>Send</b>',
		        type: 'button-positive',
		        onTap: function(e) {
		          if (!$scope.user.email) {
		            //don't allow the user to close unless he enters wifi password
		            e.preventDefault();
		          } else {
		            return $scope.user.email;
		          }
		        }
		      }
		    ]
		  });
		  emailPopup.then(function(res) {
		  	var donePopup = $ionicPopup.alert({
			     title: 'Sent!',
			     template: '<center>Check your email :)</center>'
			   });
		  	email_options = {
			  		"key": "key",
	    			"message": {
	      				"from_email": "juliana@media.mit.edu",
		      			"to": [
		          			{
		            			"email": res
		          			}],
		      			// "autotext": "true",
		      			"subject": "Your video to upload to Scratch",
		      			"html": emailTemplate,
		      			"track_opens": false,
		      			"track_clicks": false,
		      			"images": [
			            {
			                "type": "image/gif",
			                "name": "sprite.gif",
			                "content": $scope.base64_gif
			            }
			        ]
			  		}
		  		}
		    $http.post('https://mandrillapp.com/api/1.0/messages/send.json', email_options).success(function(data, status, headers, config) {
			    console.log(data);
			  }).
			  error(function(data, status, headers, config) {
			  	console.log("error");
			  });
		  });
		}
		else{
			var alertPopup = $ionicPopup.alert({
		     title: 'Oops!',
		     template: '<center>Please create a video first.</center>'
		   });
		}
	}

});