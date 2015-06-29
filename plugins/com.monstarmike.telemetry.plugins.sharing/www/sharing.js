var argscheck = require('cordova/argscheck'),
  utils = require('cordova/utils'),
  exec = require('cordova/exec');
  
  (function() {
	  function Sharing () {
		  
	  }
	  
	  Sharing.prototype.share = function (message, imageBlob, successCallback, errorCallback) {
		  exec(function (result) {
			  if (successCallback) {
				  try {
					  successCallback(result);
				  } catch (e) {
					  console.error('There was an error in the Sharing:share success callback!', e);
				  }
			  }
		  }, function (error) {
			  if (errorCallback) {
				try {
					errorCallback(error);
				} catch (e) {
					console.error('There was an error in the Sharing:share error callback!', e);
				}
			  }
		  }, 'Sharing', 'share', []);
	  };
	  
	  module.exports = new Sharing();
  })();
