var argscheck = require('cordova/argscheck'),
  utils = require('cordova/utils'),
  exec = require('cordova/exec');


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

TelemetryDecoder.decodeFlight = function(pass, fail) {
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
  }, "TLMDecoder", "readFlight", []);
};

module.exports = TelemetryDecoder;
