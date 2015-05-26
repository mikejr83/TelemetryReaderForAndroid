angular.module('telemetryReaderForAndroid.services')
  .service('chartDefinitionsService', [function () {
    this.getChartDefinitions = function (offset, useMetric) {
      var _timeTickFormatter = function (x) {
        var durationObj = moment.duration(x * 10 - offset);
        var durationStr = '';

        if (durationObj.hours() > 0) durationStr = durationObj.hours() + ':';

        durationStr += durationObj.minutes() > 0 ? (durationObj.minutes() + ':') : '0:';
        durationStr += durationObj.seconds() > 0 ? (durationObj.seconds() + ':') : '00.';
        durationStr += durationObj.milliseconds() > 0 ? (durationObj.milliseconds()) : '0';
        return durationStr;
      };

      return {
        "altitude": {
          "type": "serial",
          "categoryField": "timestamp",
          "startDuration": 1,
          "startEffect": "easeOutSine",
          "theme": "light",
          "categoryAxis": {
            "gridPosition": "start",
            "labelFunction": function (value, serialDataItem, categoryAxis) {
              return _timeTickFormatter(value);
            }
          },
          "trendLines": [],
          "graphs": [
            {
              "balloonText": "[[value]]",
              "id": "am-altitude",
              "title": "Altitude",
              "valueAxis": "altitudeAxis",
              "valueField": "altitude"
                  }
              ],
          "valueAxes": [
            {
              "id": "altitudeAxis",
              "integersOnly": true,
              "title": "Altitude",
              "labelFunction": function (value, valueText, valueAxis) {
                if (valueAxis.id == 'altitudeAxis') {
                  return (value / 10) + 'm';
                } else {
                  return valueText;
                }
              }
                  }
              ],
          "legend": {
            "useGraphSettings": true
          },
          "titles": [
            {
              "id": "Title-1",
              "size": 15,
              "text": "Altitude"
                  }
              ],
          "dataProvider": []
        },
        "current": {
          "type": "serial",
          "categoryField": "timestamp",
          "startDuration": 1,
          "startEffect": "easeOutSine",
          "theme": "light",
          "categoryAxis": {
            "gridPosition": "start",
            "labelFunction": function (value, serialDataItem, categoryAxis) {
              return _timeTickFormatter(value);
            }
          },
          "trendLines": [],
          "graphs": [
            {
              "balloonText": "[[value]]",
              "id": "am-current",
              "title": "Current",
              "valueAxis": "currentAxis",
              "valueField": "current"
      }
      ],
          "valueAxes": [
            {
              "id": "currentAxis",
              "title": "Current"
        }
      ],
          "legend": {
            "useGraphSettings": true
          },
          "titles": [
            {
              "id": "Title-1",
              "size": 15,
              "text": "Current"
        }
      ],
          "dataProvider": []
        },
        "gforce": {
          "type": "serial",
          "categoryField": "timestamp",
          "startDuration": 1,
          "startEffect": "easeOutSine",
          "theme": "light",
          "categoryAxis": {
            "gridPosition": "start",
            "labelFunction": function (value, serialDataItem, categoryAxis) {
              return _timeTickFormatter(value);
            }
          },
          "trendLines": [],
          "graphs": [],
          "dataProvider": []
        },
        "powerbox": {
          "type": "serial",
          "categoryField": "timestamp",
          "startDuration": 1,
          "startEffect": "easeOutSine",
          "theme": "light",
          "categoryAxis": {
            "gridPosition": "start",
            "labelFunction": function (value, serialDataItem, categoryAxis) {
              return _timeTickFormatter(value);
            }
          },
          "trendLines": [],
          "graphs": [
            {
              "balloonText": "[[value]]",
              "id": "am-capacityOne",
              "title": "Capacity One",
              "valueAxis": "capacityAxis",
              "valueField": "capacityOne"
                  },
            {
              "balloonText": "[[value]]",
              "id": "am-capacityTwo",
              "title": "Capacity Two",
              "valueAxis": "capacityAxis",
              "valueField": "capacityTwo"
                  },
            {
              "balloonText": "[[value]]",
              "id": "am-voltageOne",
              "title": "Voltage One",
              "valueAxis": "voltageAxis",
              "valueField": "voltageOne"
                  },
            {
              "balloonText": "[[value]]",
              "id": "am-voltageTwo",
              "title": "Voltage Two",
              "valueAxis": "voltageAxis",
              "valueField": "voltageTwo"
                  }
              ],
          "valueAxes": [
            {
              "id": "capacityAxis",
              "title": "Capacity (mAh)",
              "labelFunction": function (value, valueText, valueAxis) {
                return valueText + ' mAh';
              }
            },
            {
              "id": "voltageAxis",
              "title": "Volts",
              "position": "right",
//              "labelFunction": function (value, valueText, valueAxis) {
//                return (value / 100);
//              }
                  }
              ],
          "legend": {
            "useGraphSettings": true
          },
          "titles": [
            {
              "id": "Title-1",
              "size": 15,
              "text": "PowerBox"
                  }
              ],
          "dataProvider": []
        },
        "rx": {
          "type": "serial",
          "categoryField": "timestamp",
          "startDuration": 1,
          "theme": "light",
          "categoryAxis": {
            "gridPosition": "start",
            "labelFunction": function (value, serialDataItem, categoryAxis) {
              return _timeTickFormatter(value);
            }
          },
          "trendLines": [],
          "graphs": [
            {
              "balloonText": "[[value]]",
              "id": "am-rx-a",
              "title": "A",
              "valueAxis": "signalAxis",
              "valueField": "a"
            },
            {
              "balloonText": "[[value]]",
              "id": "am-rx-b",
              "title": "B",
              "valueAxis": "signalAxis",
              "valueField": "b"
            },
            {
              "balloonText": "[[value]]",
              "id": "am-rx-l",
              "title": "L",
              "valueAxis": "signalAxis",
              "valueField": "l"
            },
            {
              "balloonText": "[[value]]",
              "id": "am-rx-r",
              "title": "R",
              "valueAxis": "signalAxis",
              "valueField": "r"
            },
            {
              "balloonText": "[[value]]",
              "id": "am-rx-frameLoss",
              "title": "Frame Loss",
              "valueAxis": "frameAndHoldsAxis",
              "valueField": "frameLoss"
            },
            {
              "balloonText": "[[value]]",
              "id": "am-rx-holds",
              "title": "Holds",
              "valueAxis": "frameAndHoldsAxis",
              "valueField": "holds"
            },
            {
              "balloonText": "[[value]]",
              "id": "am-rx-holds",
              "title": "RX Voltage",
              "valueAxis": "voltageAxis",
              "valueField": "volts"
            }
          ],
          "valueAxes": [
            {
              "id": "rxVoltsAxis",
              "title": "Volts",
              //                      "labelFunction": function (value, valueText, valueAxis) {
              //                          if (valueAxis.id == 'altitudeAxis') {
              //                              return (value / 10) + 'm';
              //                          } else {
              //                              return valueText;
              //                          }
              //                      }
                  },
            {
              "id": "signalAxis",
              "title": "S Count",
              "position": "right"
            },
            {
              "id": "frameAndHoldsAxis",
              "title": "Count"
            }
          ],
          "legend": {
            "useGraphSettings": true
          },
          "titles": [
            {
              "id": "Title-1",
              "size": 15,
              "text": "RX"
                  }
              ],
          "dataProvider": []
        },
        "standard": {
          "type": "serial",
          "categoryField": "timestamp",
          "startDuration": 1,
          "startEffect": "easeOutSine",
          "theme": "light",
          "categoryAxis": {
            "gridPosition": "start",
            "labelFunction": function (value, serialDataItem, categoryAxis) {
              return _timeTickFormatter(value);
            }
          },
          "trendLines": [],
          "graphs": [
            {
              "balloonText": "[[value]]",
              "id": "am-rpm",
              "title": "RPM",
              "valueAxis": "rpmAxis",
              "valueField": "rpm"
            },
            {
              "balloonText": "[[value]]",
              "id": "am-temperature",
              "title": "Temperature",
              "valueAxis": "temperatureAxis",
              "valueField": "temperature"
            },
            {
              "balloonText": "[[value]]",
              "id": "am-voltage",
              "title": "RX Voltage",
              "valueAxis": "voltageAxis",
              "valueField": "volt"
            }
          ],
          "legend": {
            "useGraphSettings": true
          },
          "valueAxes": [
            {
              "id": "rpmAxis",
              "title": "RPM",
              //                      "labelFunction": function (value, valueText, valueAxis) {
              //                          if (valueAxis.id == 'altitudeAxis') {
              //                              return (value / 10) + 'm';
              //                          } else {
              //                              return valueText;
              //                          }
              //                      }
                  },
            {
              "id": "voltageAxis",
              "title": "Volts",
              //                      "labelFunction": function (value, valueText, valueAxis) {
              //                          if (valueAxis.id == 'altitudeAxis') {
              //                              return (value / 10) + 'm';
              //                          } else {
              //                              return valueText;
              //                          }
              //                      }
                  },
            {
              "id": "temperatureAxis",
              "title": "Temperature",
              //                      "labelFunction": function (value, valueText, valueAxis) {
              //                          if (valueAxis.id == 'altitudeAxis') {
              //                              return (value / 10) + 'm';
              //                          } else {
              //                              return valueText;
              //                          }
              //                      }
                  }
          ],
          "titles": [
            {
              "id": "Title-1",
              "size": 15,
              "text": "Standard"
                  }
              ],
          "dataProvider": []
        },
        "vario": {
          "type": "serial",
          "categoryField": "timestamp",
          "startDuration": 1,
          "startEffect": "easeOutSine",
          "theme": "light",
          "categoryAxis": {
            "gridPosition": "start",
            "labelFunction": function (value, serialDataItem, categoryAxis) {
              return _timeTickFormatter(value);
            }
          },
          "trendLines": [],
          "graphs": [],
          "legend": {
            "useGraphSettings": true
          },
          "titles": [
            {
              "id": "Title-1",
              "size": 15,
              "text": "Vario"
                  }
              ],
          "dataProvider": []
        }
      };
    }
}]);