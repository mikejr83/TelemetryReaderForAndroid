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

        //        $scope.chartData.xMin = $scope.chartData.main[0].data[0].x;
        //        $scope.chartData.xMax = $scope.chartData.main[0].data[$scope.chartData.main[0].data.length - 1].x;
        console.log('selectedKey', $scope.service.selectedKey);
        console.log('flightdata', $scope.service.selectedFlight.flightData[$scope.service.selectedKey]);
//        console.log('opts', $scope.service.selectedFlight.flightData[$scope.service.selectedKey]);
        /*$scope.chart = new xChart('line',
          $scope.service.selectedFlight.flightData[$scope.service.selectedKey].dataSet,
          '#myChart',
          $scope.service.selectedFlight.flightData[$scope.service.selectedKey].opts);*/
          $scope.service.selectedFlight.flightData[$scope.service.selectedKey].chartData.bindto = '#chart';
          
        if (!$scope.chart) {
            console.log('creating chart')
            $scope.service.chart = c3.generate($scope.service.selectedFlight.flightData[$scope.service.selectedKey].chartData);    
        } else {
            console.log('loading chart')
            $scope.service.chart.load({
                "columns": $scope.service.selectedFlight.flightData[$scope.service.selectedKey].chartData.data.columns
            });
        }

          console.log('chart', $scope.chart);
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
