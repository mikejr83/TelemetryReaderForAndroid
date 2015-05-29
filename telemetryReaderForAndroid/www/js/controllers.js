angular.module('telemetryReaderForAndroid.controllers', ['telemetryReaderForAndroid.services'])
  .controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', '$window', 'dataService',
                          function ($scope, $ionicModal, $timeout, $window, dataService) {
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
        $window.title = title;
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
          $scope.chart = null;
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
        var chartDataOptions = $scope.service.selectedFlight.flightData[$scope.service.selectedKey];
        console.log('chartOptions', chartDataOptions);
        if (!chartDataOptions) {
          return;
        }

        var canvasJSChartOptions = _.cloneDeep(chartDataOptions.basic);

        if (chartDataOptions.chartSeriesTypes.length < 3) {
          canvasJSChartOptions['axisY'] = chartDataOptions.chartSeriesTypes[0].axis;
          canvasJSChartOptions['toolTip'] = chartDataOptions.chartSeriesTypes[0].tooltip;
          canvasJSChartOptions['data'] = chartDataOptions.chartSeriesTypes[0].data;

          console.log('canvasJSChartOptions - 0', canvasJSChartOptions);

          if (chartDataOptions.chartSeriesTypes.length == 2) {
            canvasJSChartOptions['axisY2'] = chartDataOptions.chartSeriesTypes[1].axis;
            if (canvasJSChartOptions['toolTip'] &&
              chartDataOptions.chartSeriesTypes[1].tooltip &&
              chartDataOptions.chartSeriesTypes[1].tooltip.contentFormatter) {
              canvasJSChartOptions['toolTip'] = {
                "contentFormatter": function (e) {
                  if (e.entries[0].dataSeries.axisYType === 'secondary') {
                    return chartDataOptions.chartSeriesTypes[1].tooltip.contentFormatter(e);
                  } else {
                    return chartDataOptions.chartSeriesTypes[0].tooltip.contentFormatter(e);
                  }
                }
              }
            } else if (!canvasJSChartOptions['toolTip'] &&
              chartDataOptions.chartSeriesTypes[1].tooltip &&
              chartDataOptions.chartSeriesTypes[1].tooltip.contentFormatter) {
              canvasJSChartOptions['toolTip'] = chartDataOptions.chartSeriesTypes[1].tooltip;
            }
            _.forEach(chartDataOptions.chartSeriesTypes[1].data, function (dataSet) {
              console.log('data set series 2', dataSet);
              dataSet['axisYType'] = 'secondary';
              canvasJSChartOptions['data'].push(dataSet);
            });
          }
        } else {

        }

        console.log('canvasJSChartOptions - done', canvasJSChartOptions);
        if (!$scope.chart) {
          $scope.chart = new CanvasJS.Chart("myChart", canvasJSChartOptions);
        } else {
          $scope.chart.options = canvasJSChartOptions;
        }
        //
        $scope.chart.render();

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