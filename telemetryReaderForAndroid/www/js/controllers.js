angular.module('telemetryReaderForAndroid.controllers', ['telemetryReaderForAndroid.services'])
  .controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', 'dataService', function ($scope, $ionicModal, $timeout, dataService) {
    $scope.doGetDataFile = function () {
      console.log('get data file');
      dataService.loadData().then(function (data) {
        if (dataService.flgiths && dataService.flights.length > 0) {
          dataService.selectedFlight = dataService.flights[0];
        } else {
          dataService.selectedFlight = null;
        }

      });
    };

    $scope.setTelemetryType = function (key, title) {
      dataService.selectedKey = key;
      dataService.selectedTitle = title;
        dataService.chart = null;
    }
}])
  .controller('TelemetryViewerController', ['$scope', '$window', '$ionicLoading', '$ionicScrollDelegate', 'dataService',
                                     function ($scope, $window, $ionicLoading, $ionicScrollDelegate, dataService) {
      $scope.chart = null;
      $scope.chartData = null;
      $scope.service = dataService;

      $scope.$on('$ionicView.afterEnter', function () {

      });

      $scope.$on('$ionicView.enter', function () {
        if (!$scope.service.selectedKey)
          $scope.service.selectedKey = 'current';

        if (!$scope.service.flights) {
          $ionicLoading.show();
          dataService.getCurrentData().then(function (data) {
            if (data && data[0]) {
              $scope.service.selectedFlight = data[0];
              $scope.selectedFlightChanged();
            } else {
              $ionicLoading.hide();
            }
          });
        } else {
          $scope.service.chart = null;
          $scope.selectedFlightChanged();
        }
      });

      $scope.selectedFlightChanged = function () {
        $ionicLoading.show();

        if (!$scope.service.selectedFlight) {
          console.warn('no selected flight');
          $ionicLoading.hide();
          return;
        }
          
          if ($scope.service.chart) {
              $scope.service.chart.dataProvider = $scope.service.selectedFlight.flightData[$scope.service.selectedKey].dataProvider;
              $scope.service.chart.validateData();
          } else {
              $scope.service.chart = AmCharts.makeChart('myChart', $scope.service.selectedFlight.flightData[$scope.service.selectedKey]);
          }

        $ionicLoading.hide();
      };

      $scope.$watch('service.selectedKey', function () {
        $scope.selectedFlightChanged();
      });
}])
  .controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      {
        title: 'Reggae',
        id: 1
    },
      {
        title: 'Chill',
        id: 2
    },
      {
        title: 'Dubstep',
        id: 3
    },
      {
        title: 'Indie',
        id: 4
    },
      {
        title: 'Rap',
        id: 5
    },
      {
        title: 'Cowbell',
        id: 6
    }
  ];
  })

.controller('PlaylistCtrl', function ($scope, $stateParams) {});
