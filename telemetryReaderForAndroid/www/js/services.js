angular.module('telemetryReaderForAndroid.services', [])
  .service('dataService', ['$q', '$http', 'chartDefinitionsService', function ($q, $http, chartDefinitionsService) {
    this.file = null;
    this.selectedFlight = null;
    this.selectedKey = 'altitude';
    this.selectedTitle = 'Altitude';
    this.chart = null;

    this._setCurrentData = function (data) {
      this.file = data;

      console.log('file', this.file);

      _.forEach(this.file.flights, function (flight, index) {

      });

      console.log('file done', this.file);
    };

    this._setCurrentFlight = function(flight) {
      var chartDefinitions = chartDefinitionsService.getChartDefinitions();
      for (var sensorType in chartDefinitions) {
        if (chartDefinitions.hasOwnProperty(sensorType)) {
          if (flight.flightData[sensorType] === undefined) {
            console.warn('Flight doesn\'t have:', sensorType);
            flight.flightData[sensorType] = chartDefinitions[sensorType];
          } else {
            flight.flightData[sensorType].basic = chartDefinitions[sensorType].basic;
            _.forEach(chartDefinitions[sensorType].chartSeriesTypes, function (baseSeries, index) {
              var series = flight.flightData[sensorType].chartSeriesTypes[index];
              if (!series) {
                console.warn('base series not found for sensor: ' + sensorType + ' - ' + index);
              }
              series.selected = baseSeries.selected
              series.axis = baseSeries.axis;
              series.tooltip = baseSeries.tooltip
            });
          }
        }
      }

      this.selectedFlight = flight;

      var flightIndex = -1;
      _.forEach(this.file.flights, function (cachedFlight, index) {
        if (cachedFlight['_id'] == flight['_id']) {
          flightIndex = index;
          flight['_cached'] = true;
        }
      });

      if (flightIndex > -1) {
        this.file.flights[flightIndex] = flight;
      }
    };

    var testOne = true;
    
    /**
      * Testing getting file data.
      */
    this._getTestFileData = function () {
      var deferred = $q.defer();

      if (testOne) {
        console.log('testone');
        $http.get('js/file_data.json').then(function (response) {
          deferred.resolve(response.data);
        });
      } else {
        console.log('test two');
        $http.get('js/file_data.json').then(function (response) {
          deferred.resolve(response.data);
        });
      }
      testOne = !testOne;

      return deferred.promise;
    };
    
    this._consoleSave = function(data, filename){
      if(!data) {
          console.error('Console.save: No data')
          return;
      }

      if(!filename) filename = 'console.json'

      if(typeof data === "object"){
          data = JSON.stringify(data, undefined, 4)
      }

      var blob = new Blob([data], {type: 'text/json'}),
          e    = document.createEvent('MouseEvents'),
          a    = document.createElement('a')

      a.download = filename
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
    };
      
    /**
      * Testing getting decoded flight data.
      */
    this._getTestFlightData = function (flight) {
      var deferred = $q.defer();
      
      console.log('Getting test decoded flight data for: ', flight);
      
      $http.get('js/flight' + flight._id + '_data.json').then(function (response) {
        console.log('Test data returned', response.data);
        deferred.resolve(response.data);
      }, function(error) {
        console.log('http get error for flight!', error);
      });
      
      return deferred.promise;
    };

    this.loadData = function (storeAsCurrent) {
      var deferred = $q.defer(),
        that = this;

      if (window.com && window.com.monstarmike 
          && window.com.monstarmike.telemetry 
          && window.com.monstarmike.telemetry.plugins 
          && window.com.monstarmike.telemetry.plugins.tlmDecoder 
          && window.com.monstarmike.telemetry.plugins.tlmDecoder.openFile) {
        window.com.monstarmike.telemetry.plugins.tlmDecoder.openFile(function (data) {
            if (storeAsCurrent && data) {
              that._setCurrentData(that.file);
            }

            deferred.resolve(data);
          },
          function (e) {
            deferred.reject(e);
          });
      } else {
        console.log('getting test data');
        this._getTestFileData().then(function (data) {
          that._setCurrentData(data);
          deferred.resolve(that.file);
        });
      }

      return deferred.promise;
    };

    this.getCurrentData = function () {
      var deferred = $q.defer(),
        that = this;

      if (this.flights != null) {
        deferred.resolve(this.file);
      } else {
        this.loadData().then(function (data) {
          that._setCurrentData(data);
          deferred.resolve(that.file);
        });
      }

      return deferred.promise;
    };
    
    this.setSelectedFlight = function (flight) {
      var deferred = $q.defer(),
        that = this;
        
      var successHandler = function (decodedFlight) {
          that._setCurrentFlight(decodedFlight);
          deferred.resolve(that.selectedFlight);
        },
        errorHandler = function (error) {
          console.error("error during decoding of flight.", error);
          deferred.reject(error);
        };

      if (window.com && window.com.monstarmike 
          && window.com.monstarmike.telemetry 
          && window.com.monstarmike.telemetry.plugins 
          && window.com.monstarmike.telemetry.plugins.tlmDecoder 
          && window.com.monstarmike.telemetry.plugins.tlmDecoder.decodeFlight) {
        console.log("Sending uri: ", this.file.uri);
        window.com.monstarmike.telemetry.plugins.tlmDecoder.decodeFlight(this.file.uri, flight, successHandler, errorHandler);
      } else {
        this._getTestFlightData(flight).then(successHandler, errorHandler);
      }
      
      return deferred.promise;
    };
      }]);
