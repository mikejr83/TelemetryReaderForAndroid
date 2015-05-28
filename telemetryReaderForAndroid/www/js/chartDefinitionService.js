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
          "animationEnabled": true,
          "title": {
            "text": "Altitude"
          },
          "axisX": {
            "title": "Time",
            "labelFormatter": function (e) {
              return _timeTickFormatter(e.value);
            }
          },
          "axisY": {
            "title": "Altitude (meters)",
            "labelFormatter": function (e) {
              return (e.value / 10) + "m"
            }
          },
          "toolTip": {
            "contentFormatter": function (e) {
              var dataPoint = e.entries[0].dataPoint;
              return (dataPoint.y / 10) + 'm (' + _timeTickFormatter(dataPoint.x) + ')';
            }
          },
          "data": [
            {
              "type": "line",
              "dataPoints": []
            }
          ]
        },
        "current": {
          "animationEnabled": true,
          "title": {
            "text": "Current"
          },
          "axisX": {
            "title": "Time",
            "labelFormatter": function (e) {
              return _timeTickFormatter(e.value);
            }
          },
          "axisY": {
            "title": "Current (mA)",
            "labelFormatter": function (e) {
              return (e.value / 10) + 'A'
            }
          },
          "toolTip": {
            "contentFormatter": function (e) {
              var dataPoint = e.entries[0].dataPoint;
              return (dataPoint.y / 10) + 'A (' + _timeTickFormatter(dataPoint.x) + ')';
            }
          },
          "data": [
            {
              "name": "Current",
              "type": "line",
              "dataPoints": []
            }
          ]
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
          "animationEnabled": true,
          "title": {
            "text": "PowerBox"
          },
          "legend": {
            "horizontalAlign": "center", // "center" , "right"
            "verticalAlign": "bottom", // "top" , "bottom"
//            "fontSize": 15
          },
          "axisX": {
            "title": "Time",
            "labelFormatter": function (e) {
              return _timeTickFormatter(e.value);
            }
          },
          "axisY": {
            "title": "Volts"
          },
          "axisY2": {
            "title": "Capacity (mAh)",
            "labelFormatter": function (e) {
              return (e.value) + "mAh"
            }
          },
          "toolTip": {
            "contentFormatter": function (e) {
              var entry = e.entries[0];
              if (entry.dataSeries.axisYType === 'primary') {
                return entry.dataPoint.y + ' volts (' + _timeTickFormatter(entry.dataPoint.x) + ')';
              } else {
                return entry.dataPoint.y + 'mAh (' + _timeTickFormatter(entry.dataPoint.x) + ')';
              }
            }
          },
          "data": [
            {
              "showInLegend": true,
              "name": "Voltage One",
              "type": "line",
              "dataPoints": []
            },
            {
              "showInLegend": true,
              "name": "Voltage Two",
              "type": "line",
              "dataPoints": []
            },
            {
              "showInLegend": true,
              "name": "Capacity One",
              "type": "line",
              "axisYType": "secondary",
              "dataPoints": []
            },
            {
              "showInLegend": true,
              "name": "Capacity Two",
              "type": "line",
              "axisYType": "secondary",
              "dataPoints": []
            }
          ]
        },
        "rx": {
          "animationEnabled": true,
          "title": {
            "text": "RX"
          },
          "legend": {
            "horizontalAlign": "center", // "center" , "right"
            "verticalAlign": "bottom", // "top" , "bottom"
//            "fontSize": 15
          },
          "axisX": {
            "title": "Time",
            "labelFormatter": function (e) {
              return _timeTickFormatter(e.value);
            }
          },
          "axisY": {
            "title": "Volts"
          },
          "axisY2": {
            "title": "Capacity (mAh)",
            "labelFormatter": function (e) {
              return (e.value) + "mAh"
            }
          },
          "toolTip": {
            "contentFormatter": function (e) {
              var entry = e.entries[0];
              if (entry.dataSeries.axisYType === 'primary') {
                return entry.dataPoint.y + ' volts (' + _timeTickFormatter(entry.dataPoint.x) + ')';
              } else {
                return entry.dataPoint.y + 'mAh (' + _timeTickFormatter(entry.dataPoint.x) + ')';
              }
            }
          },
          "data": [
            {
              "showInLegend": true,
              "name": "A",
              "type": "line",
              "dataPoints": []
            },
            {
              "showInLegend": true,
              "name": "B",
              "type": "line",
              "dataPoints": []
            },
            {
              "showInLegend": true,
              "name": "L",
              "type": "line",
              "dataPoints": []
            },
            {
              "showInLegend": true,
              "name": "R",
              "type": "line",
              "dataPoints": []
            }
            ,
            {
              "showInLegend": true,
              "name": "Frame Loss",
              "type": "line",
              "dataPoints": []
            }
            ,
            {
              "showInLegend": true,
              "name": "Holds",
              "type": "line",
              "dataPoints": []
            }
            ,
            {
              "showInLegend": true,
              "name": "RX Voltage",
              "type": "line",
              "dataPoints": []
            }
          ]
        },
        "standard": {
          "animationEnabled": true,
          "title": {
            "text": "RX"
          },
          "legend": {
            "horizontalAlign": "center", // "center" , "right"
            "verticalAlign": "bottom", // "top" , "bottom"
//            "fontSize": 15
          },
          "axisX": {
            "title": "Time",
            "labelFormatter": function (e) {
              return _timeTickFormatter(e.value);
            }
          },
          "axisY": {
            "title": "Volts"
          },
//          "axisY2": {
//            "title": "Capacity (mAh)",
//            "labelFormatter": function (e) {
//              return (e.value) + "mAh"
//            }
//          },
//          "toolTip": {
//            "contentFormatter": function (e) {
//              var entry = e.entries[0];
//              if (entry.dataSeries.axisYType === 'primary') {
//                return entry.dataPoint.y + ' volts (' + _timeTickFormatter(entry.dataPoint.x) + ')';
//              } else {
//                return entry.dataPoint.y + 'mAh (' + _timeTickFormatter(entry.dataPoint.x) + ')';
//              }
//            }
//          },
          "data": [
            {
              "showInLegend": true,
              "name": "RPM",
              "type": "line",
              "dataPoints": []
            },
            {
              "showInLegend": true,
              "name": "Temperature",
              "type": "line",
              "dataPoints": []
            },
            {
              "showInLegend": true,
              "name": "Voltage",
              "type": "line",
              "dataPoints": []
            }
          ]
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
