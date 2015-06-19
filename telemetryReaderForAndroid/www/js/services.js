angular.module('telemetryReaderForAndroid.services', [])
  .service('dataService', ['$q', '$http', '$log', 'chartDefinitionsService', function ($q, $http, $log, chartDefinitionsService) {
    /**
     * Current working file.
     */
    this.file = null;
    /**
     * The selected flight. This value should only be populated by the setter to insure that it is the fully decoded JSON.
     */
    this.selectedFlight = null;
    /**
     * The currently selected telemetry key. Used to find the telemetry data in the selected flight.
     */
    this.selectedKey = 'altitude';
    /**
     * The title which appears at the top of the page.
     */
    this.selectedTitle = 'Altitude';
    /**
     *
     */
    this.chart = null;

    this._setCurrentData = function (data) {
      this.file = data;

      $log.debug('file', this.file);

      _.forEach(this.file.flights, function (flight, index) {

      });

      $log.debug('file done', this.file);
    };

    /**
     * Private - Sets the current flight.
     * @param {Object} flight Decoded flight JSON.
     */
    this._setCurrentFlight = function (flight) {
      var chartDefinitions = chartDefinitionsService.getChartDefinitions();

      if (flight) {
        for (var sensorType in chartDefinitions) {
          if (chartDefinitions.hasOwnProperty(sensorType)) {
            if (flight.flightData[sensorType] === undefined) {
              $log.warn('Flight doesn\'t have:', sensorType);
              flight.flightData[sensorType] = chartDefinitions[sensorType];
            } else {
              flight.flightData[sensorType].basic = chartDefinitions[sensorType].basic;
              _.forEach(chartDefinitions[sensorType].chartSeriesTypes, function (baseSeries, index) {
                var series = flight.flightData[sensorType].chartSeriesTypes[index];
                if (!series) {
                  $log.warn('base series not found for sensor: ' + sensorType + ' - ' + index);
                }
                series.selected = baseSeries.selected
                series.axis = baseSeries.axis;
                series.tooltip = baseSeries.tooltip
              });
            }
          }
        }
      }

      this.selectedFlight = flight;

      if (flight) {
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
      }
    };

    /**
     * Testing getting file data.
     */
    this._getTestFileData = function () {
      var deferred = $q.defer();

      $http.get('js/file_data.json').then(function (response) {
        deferred.resolve(response.data);
      });

      return deferred.promise;
    };

    /**
     * Private - Gets testing data from prebuilt JSON.
     * @param   {Object}  flight Flight descriptor from the file object
     * @returns {Promise} A promise to resolve with fully decoded flight JSON.
     */
    this._getTestFlightData = function (flight) {
      var deferred = $q.defer();

      $log.debug('Getting test decoded flight data for: ', flight);

      if (flight) {
        $http.get('js/flight' + flight._id + '_data.json').then(function (response) {
          $log.debug('Test data returned', response.data);
          deferred.resolve(response.data);
        }, function (error) {
          $log.error('http get error for flight!', error);
        });
      } else {
        deferred.resolve(null);
      }

      return deferred.promise;
    };

    /**
     * Loads data by asking the plugin to start the native file chooser.
     * @param   {Boolean} storeAsCurrent After loading the data store it as the current file information
     * @returns {Promise} Promise to resolve with the decoded data from the native plugin.
     */
    this.loadData = function (storeAsCurrent) {
      var deferred = $q.defer(),
        that = this;

      if (window.com && window.com.monstarmike && window.com.monstarmike.telemetry && window.com.monstarmike.telemetry.plugins && window.com.monstarmike.telemetry.plugins.tlmDecoder && window.com.monstarmike.telemetry.plugins.tlmDecoder.openFile) {
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
        $log.debug('getting test data');
        this._getTestFileData().then(function (data) {
          that._setCurrentData(data);
          deferred.resolve(that.file);
        });
      }

      return deferred.promise;
    };

    /**
     * Gets the currently loaded file. If one is not loaded it will load it and set it as the current working file.
     * @returns {Promise} A promise to resolve with loaded file JSON.
     */
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

    /**
     * Sets the currently selected flight to the fully decoded flight JSON. If this flight was previously fully decoded it will not execute the native decoding code.
     * @param   {Object}  flight Flight object that is either a flight stub from the file JSON or fully decoded JSON from the native call.
     * @returns {Promise} A promise to resolve with fully decoded flight JSON.
     */
    this.setSelectedFlight = function (flight) {
      var deferred = $q.defer(),
        that = this;

      var successHandler = function (decodedFlight) {
          that._setCurrentFlight(decodedFlight);
          deferred.resolve(that.selectedFlight);
        },
        errorHandler = function (error) {
          $log.error("error during decoding of flight.", error);
          deferred.reject(error);
        };

      if (window.com && window.com.monstarmike && window.com.monstarmike.telemetry && window.com.monstarmike.telemetry.plugins && window.com.monstarmike.telemetry.plugins.tlmDecoder && window.com.monstarmike.telemetry.plugins.tlmDecoder.decodeFlight) {
        $log.debug("Sending uri: ", this.file.uri);
        window.com.monstarmike.telemetry.plugins.tlmDecoder.decodeFlight(this.file.uri, flight, successHandler, errorHandler);
      } else {
        this._getTestFlightData(flight).then(successHandler, errorHandler);
      }

      return deferred.promise;
    };
      }]);
