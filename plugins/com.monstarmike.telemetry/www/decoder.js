var argscheck = require('cordova/argscheck'),
  utils = require('cordova/utils'),
  exec = require('cordova/exec');


var TelemetryDecoder = function() {
};

TelemetryDecoder.decodeFile = function (pass, fail) {
  exec(pass || function (result) {
    console.log("Result:", result);
  }, 
  function (e) {
    console.error("Error!", e);
  }, "TLMDecoder", "decodeFile", []);
};

module.exports = TelemetryDecoder;
