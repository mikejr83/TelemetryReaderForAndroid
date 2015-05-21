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
}])
  .controller('AltitudeController', ['$scope', '$window', '$ionicLoading', '$ionicScrollDelegate', 'dataService',
                                     function ($scope, $window, $ionicLoading, $ionicScrollDelegate, dataService) {
      $scope.chart = null;
      $scope.chartData = null;
      $scope.service = dataService;

      $scope.$on('$ionicView.afterEnter', function () {

      });

      $scope.$on('$ionicView.enter', function () {
        $window.setTimeout(function () {
          $HandleResize();
        }, 300)

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

        $scope.chartData = {
          "xScale": "linear",
          "yScale": "linear",
          "type": "line",
          "main": [{
            "className": ".altitude",
            "data": []
      }]
        };

        _.forEach($scope.service.selectedFlight.blocks, function (block) {
          if (block.blockType !== 'AltitudeBlock') return;

          $scope.chartData.main[0].data.push({
            "x": block.timestamp,
            "y": block.altitude
          });
        });

        $scope.chartData.xMin = $scope.chartData.main[0].data[0].x;
        $scope.chartData.xMax = $scope.chartData.main[0].data[$scope.chartData.main[0].data.length - 1].x;

        if (!$scope.chart) {
          var opts = {
            'tickFormatX': function (x) {
              var durationObj = moment.duration(x * 10);
              var durationStr = '';

              if (durationObj.hours() > 0) durationStr = durationObj.hours() + ':';

              durationStr += durationObj.minutes() > 0 ? (durationObj.minutes() + ':') : '0:';
              durationStr += durationObj.seconds() > 0 ? (durationObj.seconds() + ':') : '00.';
              durationStr += durationObj.milliseconds() > 0 ? (durationObj.milliseconds()) : '0';
              return durationStr;
            },
            'tickFormatY': function (y) {
              y = y / 10;
              return y + 'm';
            }
          };
          $scope.chart = new xChart('line', $scope.chartData, '#myChart', opts);
        } else {
          $scope.chart.setData($scope.chartData);
        }

        $ionicLoading.hide();
      };
}])
  .controller('CurrentController', ['$scope', '$window', '$ionicLoading', '$ionicScrollDelegate', 'dataService',
                                   function ($scope, $window, $ionicLoading, $ionicScrollDelegate, dataService) {
      $scope.chartData = null;
      $scope.service = dataService;
      $scope.chart = null;

      $scope.$on('$ionicView.enter', function () {
        $HandleResize();
        if (!$scope.service.flights) {
          console.log('no flight data');
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
          console.log('flight data');
          $scope.chart = null;
          $scope.selectedFlightChanged();
        }
      });

      $scope.selectedFlightChanged = function () {
        $ionicLoading.show();

        if (!$scope.service.selectedFlight) {
          console.warn('no selected flight');
          return;
        }

        $scope.chartData = {
          "xScale": "linear",
          "yScale": "linear",
          "type": "line",
          "main": [{
            "className": ".current",
            "data": []
      }]
        };

        _.forEach($scope.service.selectedFlight.blocks, function (block) {
          if (block.blockType !== 'CurrentBlock') return;

          $scope.chartData.main[0].data.push({
            "x": block.timestamp,
            "y": block.current
          });
        });

        $scope.chartData.xMin = $scope.chartData.main[0].data[0].x;
        $scope.chartData.xMax = $scope.chartData.main[0].data[$scope.chartData.main[0].data.length - 1].x;

        if (!$scope.chart) {
          var opts = {
            'tickFormatX': function (x) {
              var durationObj = moment.duration(x * 10);
              var durationStr = '';

              if (durationObj.hours() > 0) durationStr = durationObj.hours() + ':';

              durationStr += durationObj.minutes() > 0 ? (durationObj.minutes() + ':') : '0:';
              durationStr += durationObj.seconds() > 0 ? (durationObj.seconds() + ':' + '.') : '00.';
              durationStr += durationObj.milliseconds() > 0 ? (durationObj.milliseconds()) : '0';
              return durationStr;
            },
            'tickFormatY': function (y) {
              y = y * 10;
              return y;
            }
          };
          $scope.chart = new xChart('line', $scope.chartData, '#myChart', opts);
        } else {
          $scope.chart.setData($scope.chartData);
        }

        $ionicLoading.hide();
      };
}])
  .controller('RXController', ['$scope', '$window', '$ionicLoading', '$ionicScrollDelegate', 'dataService',
                                   function ($scope, $window, $ionicLoading, $ionicScrollDelegate, dataService) {
      $scope.chartData = null;
      $scope.service = dataService;
      $scope.flight = null;
      $scope.chart = null;

      $scope._handleResize = function () {
        var gridContainer = $('.grid-container');
        console.log('resized');
        var figure = $('.grid-container figure');
        figure.height(gridContainer.height());
        figure.width(gridContainer.width());
      };

      $scope.$on('$ionicView.enter', function () {
        $scope._handleResize();
        if (!$scope.service.flights) {
          $ionicLoading.show();
          dataService.getCurrentData().then(function (data) {
            if (data && data[0]) {
              $scope.flight = data[0];
              $scope.selectedFlightChanged(data[0]);
            } else {
              $ionicLoading.hide();
            }
          });
        }
      });

      $(window).resize($scope._handleResize);

      $scope.selectedFlightChanged = function (f) {
        $ionicLoading.show();

        if (f) {
          $scope.flight = f;
        } else {
          return;
        }

        $scope.chartData = {
          "xScale": "linear",
          "yScale": "linear",
          "type": "line",
          "main": [{
              "className": ".rx-a",
              "data": []
      },
            {
              "className": ".rx-b",
              "data": []
      },
            {
              "className": ".rx-frameLoss",
              "data": []
      },
            {
              "className": ".rx-holds",
              "data": []
      },
            {
              "className": ".rx-l",
              "data": []
      },
            {
              "className": ".rx-r",
              "data": []
      },
            {
              "className": ".rx-volts",
              "data": []
      }]
        };

        _.forEach($scope.flight.blocks, function (block) {
          if (block.blockType !== 'RXBlock') return;

          $scope.chartData.main[0].data.push({
            "x": block.timestamp,
            "y": block.a || 0
          });
          $scope.chartData.main[1].data.push({
            "x": block.timestamp,
            "y": block.b || 0
          });
          $scope.chartData.main[2].data.push({
            "x": block.timestamp,
            "y": block.frameLoss || 0
          });
          $scope.chartData.main[3].data.push({
            "x": block.timestamp,
            "y": block.holds || 0
          });
          $scope.chartData.main[4].data.push({
            "x": block.timestamp,
            "y": block.l || 0
          });
          $scope.chartData.main[5].data.push({
            "x": block.timestamp,
            "y": block.r || 0
          });
          $scope.chartData.main[6].data.push({
            "x": block.timestamp,
            "y": block.volts || 0
          });
        });

        //                $scope.chartData.xMin = $scope.chartData.main[0].data[0].x;
        //                $scope.chartData.xMax = $scope.chartData.main[0].data[$scope.chartData.main[0].data.length - 1].x;

        if (!$scope.chart) {
          var opts = {
            'tickFormatX': function (x) {
              var durationObj = moment.duration(x * 10);
              var durationStr = '';

              if (durationObj.hours() > 0) durationStr = durationObj.hours() + ':';

              durationStr += durationObj.minutes() > 0 ? (durationObj.minutes() + ':') : '0:';
              durationStr += durationObj.seconds() > 0 ? (durationObj.seconds() + ':') : '00.';
              durationStr += durationObj.milliseconds() > 0 ? (durationObj.milliseconds()) : '0';
              return durationStr;
            },
            'tickFormatY': function (y) {
              y = y * 10;
              return y;
            }
          };
          $scope.chart = new xChart('line', $scope.chartData, '#myChart', opts);
        } else {
          $scope.chart.setData($scope.chartData);
        }

        $ionicLoading.hide();
      };
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
