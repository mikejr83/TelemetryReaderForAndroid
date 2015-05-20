angular.module('telemetryReaderForAndroid.controllers', [])
.service('dataService', ['$q', '$http', function ($q, $http) {
  this.currentData = null;
    
  this.getTestData = function () {
    var deferred = $q.defer();
      
    $http.get('js/data.json').then(function(response) {
       deferred.resolve(response.data); 
    });
      
    return deferred.promise;
  };
  
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
      this.getTestData().then(function(data) {
         that.currentData = data;
          deferred.resolve(data);
      });
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
.controller('AltitudeController', ['$scope', '$window', '$ionicLoading', '$ionicScrollDelegate', 'dataService', 
                                   function($scope, $window, $ionicLoading, $ionicScrollDelegate, dataService) {
  $scope.altitudeChartData = null;
  $scope.flights = [];
  $scope.flight = null;
                                       
  $('.grid-container').resize(function () {
     console.log('resized');
     var figure = $('.grid-container figure');
     figure.height(gridContainer.height());
     figure.width(gridContainer.width());
  });
    
  $scope.onEnter = function () {
      $ionicLoading.show();
      dataService.getCurrentData().then(function (data) { 
        $scope.flights = data;
        if (data && data[0]) {
          $scope.flight = data[0];
            $scope.selectedFlightChanged(data[0]);
        } else {
            $ionicLoading.hide();
        }
      });
  }
  
  $scope.selectedFlightChanged = function(f) {
    $ionicLoading.show();
    
    if (f) {
        $scope.flight = f;
    } else {
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
    
    _.forEach($scope.flight.blocks, function(block) {
      if (block.blockType !== 'AltitudeBlock') return;
      
      $scope.altitudeChartData.main[0].data.push({
        "x": block.timestamp,
        "y": block.altitude
      });
    });
    
    $scope.altitudeChartData.xMin = $scope.altitudeChartData.main[0].data[0].x;
    $scope.altitudeChartData.xMax = $scope.altitudeChartData.main[0].data[$scope.altitudeChartData.main[0].data.length - 1].x;
    
    var altitudeChart = new xChart('line', $scope.altitudeChartData, '#myChart');
      
    $ionicLoading.hide();
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
