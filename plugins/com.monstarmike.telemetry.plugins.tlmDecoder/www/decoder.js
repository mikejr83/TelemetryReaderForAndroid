// UDM declaration: https://github.com/umdjs/umd/blob/master/templates/returnExports.js

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['cordova/argscheck',
		'cordova/utils',
		'cordova/exec'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('cordova/argscheck'), 
			require('cordova/utils'),
			require('cordova/exec'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.b);
    }
}(this, function (argscheck, utils, exec) {

	var TelemetryDecoder = function() {
	};

	TelemetryDecoder.openFile = function(pass, fail) {
	  exec(function (result) {
		console.log("Result:", result);
		if (pass) {
		  pass(result);
		}
	  }, 
	  function (e) {
		console.error("Error!", e);
		if (fail) {
		  fail(e);
		}
	  }, "TLMDecoder", "openFile", []);
	};

	TelemetryDecoder.decodeFlight = function(file, flight, pass, fail) {
	  exec(function (result) {
		console.log("Result:", result);
		if (pass) {
		  pass(result);
		}
	  }, 
	  function (e) {
		console.error("Error!", e);
		if (fail) {
		  fail(e);
		}
	  }, "TLMDecoder", "readFlight", [file, flight]);
	};

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return TelemetryDecoder;
}));
