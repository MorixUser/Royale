(function () { 
	'use strict';
	angular
		.module('betApp')
		.factory('loginData', loginData);
	
	function loginData($http, localStorageService, $state, $filter, $q, $rootScope, authBase,msgDialogSrvc) {
		var autologinafterlogout=false;
		var manuallogin=false;
		var previouslylogin=false;
		
		window.addEventListener("message", function (e) {
			try {
				
				if(e.data=="requestAuthorization"){
						msgDialogSrvc.showDialog('#wrap', 'error', 'please_login_for_bet');
				}
			} catch (e) { }
		});
		
		return {
		    login: function (user) {

		        var deferred = $q.defer();

				$http.defaults.useXDomain = true;
				var url = apiURL + "/user/GetCheckLogonPart1?username="+user.userName;
		        $http
			        .get(url)
			        .success(function (data) {
				        if (data.success == true) {
					        console.log(data);
					        var hash = CryptoJS.SHA256(data.salt + user.password);
					        var code = CryptoJS.SHA256(data.token + hash);
					        var demosession = $rootScope.jwt ? $rootScope.jwt : "";
					        var url = apiURL + "/user/GetCompleteLoginMobile2?username="+user.userName+"&token="+data.token+"&code="+code+"&demosession="+demosession;
					        $http
						        .get(url)
						        .success(function (data) {
						            $rootScope.jwt = data.UserIDToken;
						            $rootScope.usertype = data.usertype;
						            $rootScope.currentUser = user.userName;
						            $rootScope.userSettings = data.settings;
						            try {
						                if (user.rememberlogin) {
						                    localStorageService.set('jwt', data.UserIDToken);
						                    localStorageService.set('usertype', data.usertype);
						                    localStorageService.set('currentUser', user.userName)
						                    localStorageService.set('userSettings', data.settings)
						                }
						            }catch(e){}
						            $rootScope.$broadcast('LOGIN_EVENT', { isLoggedin: true });
                                    
						            deferred.resolve({ success: true, payload: data });

						        });
				        }
				        else
				            deferred.resolve({ success: false });
			        });

		        return deferred.promise

		    },
		    autologin: function (username,token,code) {

		        var deferred = $q.defer();

		        $http.defaults.useXDomain = true;
		        
			    var url = apiURL + "/user/GetCompleteLoginMobile2?username="+username+"&token="+token+"&code="+code+"&demosession=";
			    $http
					.get(url)
					.success(function (data) {
						$rootScope.jwt = data.UserIDToken;
						$rootScope.usertype = data.usertype;
						$rootScope.currentUser = username;
						$rootScope.userSettings = data.settings;
						try {
						    
						    localStorageService.set('jwt', data.UserIDToken);
						    localStorageService.set('usertype', data.usertype);
						    localStorageService.set('currentUser', username)
						    localStorageService.set('userSettings', data.settings)
						    
						}catch(e){}
						$rootScope.$broadcast('LOGIN_EVENT', { isLoggedin: true });
                                    
						deferred.resolve({ success: true, payload: data });

					}); 

		        return deferred.promise

		    },
		    logout: function () {
				$http.get(apiURL + "/user/GetLogout", authBase.getAuthOptions()).success(function (data) { 
					$rootScope.jwt = "";
					$rootScope.usertype = "";
					//$rootScope.currentUser = "";
					$rootScope.userSettings = {};
					try {
						
						localStorageService.remove('jwt');
						localStorageService.remove('usertype');
						localStorageService.remove('userSettings');
					} catch (e) { }

					$rootScope.$broadcast('LOGOUT_EVENT', { isLoggedin: false });
					authBase.setDemoSession();
					$state.go('login');
				});
			},
			isLoggedin: function () {

			    
			    var deferred = $q.defer();
			    var token = $rootScope.jwt ? $rootScope.jwt : localStorageService.get('jwt');
			    if (token) {

			        $http.get(apiURL + '/user/GetCheckLoggedin', authBase.getAuthOptions())
                        .success(function (data) {
                            $rootScope.$broadcast('LOGIN_EVENT', { isLoggedin: data.success });
							if(previouslylogin && !data.success){
								console.log('logout');
								$rootScope.jwt = "";
								$rootScope.usertype = "";
								//$rootScope.currentUser = "";
								$rootScope.userSettings = {};
								try {
									
									localStorageService.remove('jwt');
									localStorageService.remove('usertype');
									localStorageService.remove('userSettings');
								} catch (e) { }

								
								$rootScope.$broadcast('LOGOUT_EVENT', { isLoggedin: false });
								authBase.setDemoSession();
								$state.go('login');
							}
							previouslylogin = data.success;
                            deferred.resolve({ success: data.success });
                            
                        })
                        .error(function (xhr, status) {
                            console.log("Exception: " + status);
                            authBase.setDemoSession();
                            $rootScope.$broadcast('LOGIN_EVENT', { isLoggedin: false });
                            deferred.resolve({ success: false });
                            
                        });

			    } else {
			        $rootScope.$broadcast('LOGIN_EVENT', { isLoggedin: false });
			        authBase.setDemoSession();
			        deferred.resolve({ success: false });
			        
			    }

			    return deferred.promise
			},
			getAuthOptions: function() {
			    return authBase.getAuthOptions();
			}
			
		}

	}

})();