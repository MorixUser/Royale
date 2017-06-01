(function () { 
	'use strict';
	angular
		.module('betApp')
		.factory('balanceChangeSvc', balanceChangeSvc);
	
	function balanceChangeSvc($http, localStorageService, $state, $filter, $q, $rootScope, signalRHubProxy,loginData) {
		var connectionid="";
		
		return {
			
			init: function() {
			    // SIGNALR HUB PROXY - REAL TIME DATA CONNECTION CHECK

				
				
			    var betHubProxy = signalRHubProxy(siteURL, 'balanceHub',{ logging: true });
			    betHubProxy.on('balanceEvent', function (data) {
					$rootScope.$broadcast('BALANCE_EVENT', { data: data });
			    });

			    var connection = betHubProxy.connection;

			    betHubProxy.connection.start()
                .done(function(){ 
                    console.log('Now connected, connection ID=' + connection.id); 
					connectionid=connection.id;
					var url = apiURL + "/user/GetAddBalanceEventListener?ConnectionID="+connectionid;
						$http
						.get(url, loginData.getAuthOptions())
						.success(function (data) {
							console.log("balance connection set");
						});
                })

                .fail(function(e){ 
                    console.log('Could not connect'); 
                    location.reload();
                });
				
				
				var deregLoginEvent = $rootScope.$on('LOGIN_EVENT', function (event, args) {
					if (args.isLoggedin && connectionid!="") {
						var url = apiURL + "/user/GetAddBalanceEventListener?ConnectionID="+connectionid;
						$http
						.get(url, loginData.getAuthOptions())
						.success(function (data) {
							console.log("balance connection set");
						});
						
					} 
				});
				$rootScope.$on('$destroy', function () {
					deregLoginEvent();
				});
			}
			
		}

	}

})();