(function () { 
	'use strict';
	angular
		.module('betApp')
		.factory('dataChangeSvc', dataChangeSvc);
	
	function dataChangeSvc($http, localStorageService, $state, $filter, $q, $rootScope, signalRHubProxy) {
		return {
			init: function() {
			    // SIGNALR HUB PROXY - REAL TIME DATA CONNECTION CHECK

			    var betHubProxy = signalRHubProxy(siteURL, 'betHub',{ logging: true });
			    betHubProxy.on('dataChange', function (data) {
			        
			        angular.forEach(data.items, function(item, value) {
			            $rootScope.$broadcast('GAMECHANGE_EVENT', { data: item });
			        });
			        angular.forEach(data.bets, function (item, value) {
			            $rootScope.$broadcast('BETCHANGE_EVENT', { data: item });
			        });
			        angular.forEach(data.tips, function (item, value) {
			            if ($rootScope.userSettings && ($rootScope.userSettings.OddsFactor || $rootScope.userSettings.OddsFactorLive))
			                item.od += item.li ? $rootScope.userSettings.OddsFactorLive : $rootScope.userSettings.OddsFactor;
			            $rootScope.$broadcast('TIPCHANGE_EVENT', { data: item });
			        });
			        angular.forEach(data.liveInfos, function (item, value) {
			            $rootScope.$broadcast('LIVESTATS_EVENT', { data: item });
			        });

			    });

			    var connection = betHubProxy.connection;

			    betHubProxy.connection.start()
                .done(function(){ 
                    console.log('Now connected, connection ID=' + connection.id); 
                })

                .fail(function(e){ 
                    console.log('Could not connect'); 
                    location.reload();
                });
			}
			
		}

	}

})();