var app = angular.module('app.controllers', ['ngCordova'])

var emailTemplate = '<html><head></head><body style="font-family: sans-serif;"><p>Attached is your GIF. There are a few more steps you need to import your GIF into Scratch.</p><ol><li> Download your GIF </li><li> Upload your GIF as a sprite in a Scratch Project </li></ol>Thanks!</body></html>';

app.controller('VideoCtrl', function($scope, $cordovaCapture, $ionicPopup, $http) {
    console.log("in ctrl");
    $scope.clip = 'img/blankgif_instructions.png';

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
	        	// console.log("data:image/gif;base64,"+succes.response);
	        	console.log('here');
	        	setTimeout(function () {
			        $scope.$apply(function () {
			        	$scope.base64_gif = succes.response;
			            $scope.clip="data:image/gif;base64,"+$scope.base64_gif;
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
	    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
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
		  	email_options = {
			  		"key": "my key",
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
			                "name": "scratchgif",
			                "content": $scope.base64_gif
			            }
			        ]
			  		}
		  		}
		    $http.post('https://mandrillapp.com/api/1.0/messages/send.json', email_options).success(function(data, status, headers, config) {
			    console.log(data);
			    // this callback will be called asynchronously
			    // when the response is available
			  }).
			  error(function(data, status, headers, config) {
			  	console.log("error");
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			  });
		  });
		}
		else{
			var alertPopup = $ionicPopup.alert({
		     title: 'Oops!',
		     template: 'Please create a video first.'
		   });
		}
	}

});