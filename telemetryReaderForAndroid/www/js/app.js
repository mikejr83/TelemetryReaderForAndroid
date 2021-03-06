// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('telemetryReaderForAndroid', ['ionic', 'telemetryReaderForAndroid.controllers'])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(['$stateProvider', '$urlRouterProvider', '$logProvider', function ($stateProvider, $urlRouterProvider, $logProvider) {
  $stateProvider
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
    .state('app.fileinfo', {
      url: "/fileinfo",
      views: {
        'menuContent': {
          templateUrl: "templates/fileInfo.html",
          controller: 'FileInfoController'
        }
      }
    })
    .state('app.telemetry', {
      url: "/telemetry",
      views: {
        'menuContent': {
          templateUrl: "templates/telemetry/telemetry.html",
          controller: 'TelemetryViewerController'
        }
      }
    })
  .state('app.fileInfo', {
      url: "/fileInfo",
      views: {
        'menuContent': {
          templateUrl: "templates/fileInfo.html",
          controller: "FileInfoController"
        }
      }
    })
    .state('app.welcome', {
      url: "/welcome",
      views: {
        'menuContent': {
          templateUrl: "templates/welcome.html"
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/welcome');

  $logProvider.debugEnabled(!ionic.Platform.isWebView());
}]);
