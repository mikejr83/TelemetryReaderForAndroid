cordova.define("com.mikejr83.telmetrydecoderplugin", function(require, exports, module) {
	var argscheck = require('cordova/argscheck'),
		utils = require('cordova/utils'),
		exec = require('cordova/exec');


	var TelemetryDecoder = function() {
	};

	TelemetryDecoder.decodeFile = function () {
		exec("TelemetryDecoder", "decodeFile", []);
	};

	module.exports = TelmetryDecoder;
});
