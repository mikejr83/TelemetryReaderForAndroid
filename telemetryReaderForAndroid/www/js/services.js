angular.module('telemetryReaderForAndroid.services', [])
  .service('dataService', ['$q', '$http', 'chartDefinitionsService', function ($q, $http, chartDefinitionsService) {
    this.flights = null;
    this.selectedFlight = null;
    this.selectedKey = 'altitude';
    this.selectedTitle = 'Altitude';
    this.chart = null;

    this._setCurrentData = function (data) {
      this.flights = data;
      _.forEach(this.flights, function (flight, index) {
        //        if (!flight.blocks || flight.blocks.length == 8) return;

        if (!flight.name) {
          var duration = flight.duration;
          if (!flight.duration && flight.blocks.length > 8) {
            duration = flight.blocks[flight.blocks.length - 1].timestamp * 10 - flight.blocks[8].timestamp * 10;
          }
          if (duration === undefined) {
            duration = 0;
          }

          var durationObj = moment.duration(duration);
          var durationStr = '';

          if (durationObj.hours() > 0) durationStr = durationObj.hours() + ':';

          durationStr += durationObj.minutes() > 0 ? (durationObj.minutes() + ':') : '0:';
          durationStr += durationObj.seconds() > 0 ? (durationObj.seconds() + ':') : '00.';
          durationStr += durationObj.milliseconds() > 0 ? (durationObj.milliseconds()) : '0';

          flight.name = 'Flight ' + (index + 1) + ' - ' + durationStr;
        }

        flight.flightData = chartDefinitionsService.getChartDefinitions(flight.blocks.length > 8 ? flight.blocks[8].timestamp * 10 : 0);

        var converter = {
          "altitude": function (chartOptions, block) {
            chartOptions.chartSeriesTypes[0].data[0].dataPoints.push({
              x: block.timestamp,
              y: block.altitude
            });
          },
          "current": function (chartOptions, block) {
            chartOptions.chartSeriesTypes[0].data[0].dataPoints.push({
              x: block.timestamp,
              y: block.current
            });
          },
          "gforce": function (chartOptions, block) {

          },
          "powerbox": function (chartOptions, block) {
            chartOptions.chartSeriesTypes[0].data[0].dataPoints.push({
              x: block.timestamp,
              y: block.voltageOne
            });
            chartOptions.chartSeriesTypes[0].data[1].dataPoints.push({
              x: block.timestamp,
              y: block.voltageTwo
            });
            chartOptions.chartSeriesTypes[1].data[0].dataPoints.push({
              x: block.timestamp,
              y: block.capacityOne
            });
            chartOptions.chartSeriesTypes[1].data[1].dataPoints.push({
              x: block.timestamp,
              y: block.capacityTwo
            });
          },
          "rx": function (chartOptions, block) {
            chartOptions.chartSeriesTypes[0].data[0].dataPoints.push({
              x: block.timestamp,
              y: block.a
            });
            chartOptions.chartSeriesTypes[0].data[1].dataPoints.push({
              x: block.timestamp,
              y: block.b
            });
            chartOptions.chartSeriesTypes[0].data[2].dataPoints.push({
              x: block.timestamp,
              y: block.l
            });
            chartOptions.chartSeriesTypes[0].data[3].dataPoints.push({
              x: block.timestamp,
              y: block.r
            });
            chartOptions.chartSeriesTypes[1].data[0].dataPoints.push({
              x: block.timestamp,
              y: block.frameLoss
            });
            chartOptions.chartSeriesTypes[1].data[1].dataPoints.push({
              x: block.timestamp,
              y: block.holds
            });
            chartOptions.chartSeriesTypes[2].data[0].dataPoints.push({
              x: block.timestamp,
              y: block.volts
            });
          },
          "standard": function (chartOptions, block) {
            chartOptions.data[0].dataPoints.push({
              x: block.timestamp,
              y: block.rpm
            });
            chartOptions.data[1].dataPoints.push({
              x: block.timestamp,
              y: block.temperature
            });
            chartOptions.data[2].dataPoints.push({
              x: block.timestamp,
              y: block.volt
            });
          }
        }

        var done = {};
        _.forEach(flight.blocks, function (block, index) {
          if (index < 8) return;

          var key = block.blockType.toLowerCase().substring(0, block.blockType.length - 5);

          if (converter[key]) {
            converter[key](flight.flightData[key], block);
          }

        });
      });
    };

    var testOne = true;

    this.getTestData = function () {
      var deferred = $q.defer();

      if (testOne) {
        console.log('testone');
        $http.get('js/data.json').then(function (response) {
          deferred.resolve(response.data);
        });
      } else {
        console.log('test two');
        $http.get('js/data2.json').then(function (response) {
          deferred.resolve(response.data);
        });
      }
      testOne = !testOne;

      return deferred.promise;
    };

    this.loadData = function (storeAsCurrent) {
      var deferred = $q.defer(),
        that = this;

      if (window.com && window.com.monstarmike && window.com.monstarmike.telemetry && window.com.monstarmike.telemetry.decodeFile) {
        window.com.monstarmike.telemetry.decodeFile(function (data) {
            if (storeAsCurrent && data) {
              that._setCurrentData(that.flights);
            }

            deferred.resolve(data);
          },
          function (e) {
            console.error(e);
          });
      } else {
        console.log('getting test data');
        this.getTestData().then(function (data) {
          that._setCurrentData(data);
          deferred.resolve(that.flights);
        });
      }

      return deferred.promise;
    };

    this.getCurrentData = function () {
      var deferred = $q.defer(),
        that = this;

      if (this.flights != null) {
        deferred.resolve(this.flights);
      } else {
        this.loadData().then(function (data) {
          that._setCurrentData(data);
          deferred.resolve(that.flights);
        });
      }

      return deferred.promise;
    };
      }])
