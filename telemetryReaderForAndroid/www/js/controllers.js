angular.module('telemetryReaderForAndroid.controllers', [])
.service('dataService', ['$q', function ($q) {
  this.currentData = null;
  
  this.loadData = function (storeAsCurrent) {
    var deferred = $q.defer(), that = this;
    
    if (window.com && window.com.monstarmike && window.com.monstarmike.telemetry && window.com.monstarmike.telemetry.decodeFile) {
      window.com.monstarmike.telemetry.decodeFile(function (data) {
        if (storeAsCurrent && data) {
          that.currentData = data;
        }
        
        deferred.resolve(data);
      },
      function (e) {
        console.error(e);
      });
    } else {
      deferred.reject('error\'d bitch. you gots to have your plugin around fool.');
    }
    
    return deferred.promise;
  }
  
  this.getCurrentData = function() {
    var deferred = $q.defer(), that = this;
    
    if (this.currentData != null) {
      deferred.resolve(this.currentData);
    } else {
      this.loadData().then(function (data) {
        that.currentData = data;
        deferred.resolve(that.currentData);
      });
    }
    
    return deferred.promise;
  }
}])
.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', 'dataService', function($scope, $ionicModal, $timeout, dataService) {
  $scope.telemetryData = null;
  
  $scope.doGetDataFile = function () {
    dataService.loadData(true).then(function(data) {
      $scope.telemetryData = data;
    });
  };
}])
.controller('AltitudeController', ['$scope', '$ionicView', 'dataService', function($scope, $ionicView, dataService) {
  $scope.altitudeChartData = null;
  $scope.flights = [];
  
  $ionicView.enter = function() {
    dataService.getCurrentData().then(function (data) { 
      $scope.flights = data;
    });
  }
  
  $scope.selectedFlightChanged = function(flight) {
    if (!flight) {
      dataService.getCurrentData().then(function (data) { 
        if (data && data[0]) {
          $scope.selectedFlightChanged(data[0]); 
        }
      });
      return;
    }
    
    $scope.altitudeChartData = {
      "xScale": "linear",
      "yScale": "linear",
      "type": "line",
      "main": [{
        "className": ".altitude",
        "data": []
      }]
    };
    
    _.forEach(flight.blocks, function(block) {
      if (block.blockType !== 'AltitudeBlock') return;
      
      $scope.altitudeChartData.main[0].data.push({
        "x": block.timestamp,
        "y": block.altitude
      });
    });
    
    $scope.altitudeChartData.xMin = $scope.altitudeChartData.main[0].data[0].x;
    $scope.altitudeChartData.xMax = $scope.altitudeChartData.main[0].data[$scope.altitudeChartData.main[0].data.length - 1].x;
    
    console.log('altitudeChartData', $scope.altitudeChartData);
    
    var altitudeChart = new xChart('line', $scope.altitudeChartData, '#myChart');
  };
}])

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
