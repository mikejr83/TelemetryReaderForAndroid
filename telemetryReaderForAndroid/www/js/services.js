angular.module('telemetryReaderForAndroid.services', [])
  .service('dataService', ['$q', '$http', function ($q, $http) {
    this.flights = null;
    this.selectedFlight = null;
    this.selectedKey = 'altitude';
    this.selectedTitle = 'Altitude';

    this._setCurrentData = function (data) {
      this.flights = data;
      _.forEach(this.flights, function (flight, index) {
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

        var timeTickFormatter = function (x) {
          var durationObj = moment.duration(x * 10);
          var durationStr = '';

          if (durationObj.hours() > 0) durationStr = durationObj.hours() + ':';

          durationStr += durationObj.minutes() > 0 ? (durationObj.minutes() + ':') : '0:';
          durationStr += durationObj.seconds() > 0 ? (durationObj.seconds() + ':') : '00.';
          durationStr += durationObj.milliseconds() > 0 ? (durationObj.milliseconds()) : '0';
          return durationStr;
        };

        flight.flightData = {
          "altitude": {
            "xLabelFormat": timeTickFormatter,
              "data":[],
              "xkey": "timestamp",
              "ykeys": ["altitude"],
              "labels": ["Altitude"]
          },
          "current": {
            "xLabelFormat": timeTickFormatter
          },
          "powerbox": {
              "xLabelFormat": timeTickFormatter
          },
          "rx": {
            "xLabelFormat": timeTickFormatter
        }
        };

        var altitude = function (block) {
          flight.flightData['altitude'].data.push(block);
        };

        var current = function (block) {
//          flight.flightData['current'].dataSet.main[0].data.push({
//            "x": block.timestamp,
//            "y": block.current
//          });
        };

        var powerbox = function (block) {
//          flight.flightData['powerbox'].dataSet.main[0].data.push({
//            "x": block.timestamp,
//            "y": block.capacityOne
//          });
//          flight.flightData['powerbox'].dataSet.comp[0].data.push({
//            "x": block.timestamp,
//            "y": block.voltageOne
//          });
        };

        var rx = function (block) {
//          flight.flightData['rx'].dataSet.main[0].data.push({
//            "x": block.timestamp,
//            "y": block.a || 0
          };
          //          flight.flightData['rx'].dataSet.main[1].data.push({
          //            "x": block.timestamp,
          //            "y": block.b || 0
          //          });
          //          flight.flightData['rx'].dataSet.main[2].data.push({
          //            "x": block.timestamp,
          //            "y": block.frameLoss || 0
          //          });
          //          flight.flightData['rx'].dataSet.main[3].data.push({
          //            "x": block.timestamp,
          //            "y": block.holds || 0
          //          });
          //          flight.flightData['rx'].dataSet.main[4].data.push({
          //            "x": block.timestamp,
          //            "y": block.l || 0
          //          });
          //          flight.flightData['rx'].dataSet.main[5].data.push({
          //            "x": block.timestamp,
          //            "y": block.r || 0
          //          });
//          flight.flightData['rx'].dataSet.comp[0].data.push({
//            "x": block.timestamp,
//            "y": block.volts || 0
//          });
//        };
        var done = false;
        _.forEach(flight.blocks, function (block) {
          switch (block.blockType) {
          case 'AltitudeBlock':
            altitude(block);
            break;
          case 'CurrentBlock':
            current(block);
            break;
          case 'PowerboxBlock':
            powerbox(block);
            break;
          case 'RXBlock':
            rx(block);
            break;

          case 'StandardBlock':
            console.log(block);
            break;
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
