(function () { 
	'use strict';
	angular
		.module('betApp')
		.factory('authBase', authBase);
	
	function authBase($http, localStorageService, $state, $filter, $q, $rootScope) {
		return {
		    
			
			getAuthOptions: function() {
			    var token = $rootScope.jwt ? $rootScope.jwt : localStorageService.get('jwt');

			    var options = {
			        headers: {
			            'accept': 'true'
			        }, withCredentials: true
			    };

			    if (token && token != null && token != '')
			        options.headers.jauth = token;
			    return options;
			},

			setDemoSession: function () {
			    
			    var url = apiURL + "user/GetDemoSession";
			    $http
                .get(url)
                .then(function (data) {

                    $rootScope.jwt = data.data.UserIDToken;
                    $rootScope.usertype = 'demo';
                    $rootScope.userSettings = {};
                    try {
                        localStorageService.set('jwt', data.data.UserIDToken);
                        localStorageService.set('usertype', 'demo');
                        localStorageService.set('userSettings', {});
                    } catch (e) { }
                    
                    
                    var authOpt = {
                        headers: {
                            'accept': 'true'
                        }, withCredentials: true
                    };

                    if (data.data.UserIDToken && data.data.UserIDToken != null && data.data.UserIDToken != '')
                        authOpt.headers.jauth = data.data.UserIDToken;

                    $http.get(apiURL + "/tipbasket/gettipbasketdata", authOpt).then(function (data) {
                        $rootScope.betslipiteml = data.data.CntTips;
                    });

                });

			}
			
		}

	}

})();