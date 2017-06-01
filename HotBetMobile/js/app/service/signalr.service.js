(function() {
	'use strict';
	angular
	.module('betApp')
	.factory('signalRHubProxy', signalRHubProxy);

	function signalRHubProxy($rootScope, signalRServer, $timeout) {
		function signalRHubProxyFactory(serverUrl, hubName, startOptions) {

			var connection = $.hubConnection(signalRServer);
			
			
			
			var proxy = connection.createHubProxy(hubName);
			
			connection.stateChanged(function (change) {
				
				console.log('signalR state changed. new state: '+change.newState);
				
                if (change.newState == 4) //disconnected
                {
        	        console.log('signalR state changed. new state: disconneced');
                }

                if (change.newState == 1) //connected
                {
        	        console.log('signalR state changed. new state: conneced');
                }
            });

			return {
				on: function (eventName, callback) {
					proxy.on(eventName, function (result) {
						$rootScope.$apply(function () {
							if (callback) {
								callback(result);
							}
						});
					});
				},
				connection: connection
			};


		};

		return signalRHubProxyFactory;  
	}
})();