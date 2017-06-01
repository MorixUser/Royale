(function() {
	'use strict';
	angular
		.module('betApp')
		.controller('homeCtrl', homeCtrl);
			function homeCtrl($scope, $rootScope, $translate, $filter, localStorageService, loginData, $state, $http,$window) {
				$rootScope.inIndex = false;
				$rootScope.currentPage = $filter('translate')('navHome');
				$rootScope.inLogin = false;
				$scope.isLoggedin = false;
				$scope.useregistration = useregistration;
				$scope.showinfopages = showinfopages;
				$scope.usecasino = usecasino;

				$scope.gotoCasino = function () {
				    $window.location = casinolink;
				}
				
				
				$scope.zones = [
				    {
				        id: -5,
				        name: "America/Lima",
				        short: "GMT-5"
				    },
                    {
                        id: -2,
                        name: "Atlantic/Reykjavik",
                        short: "GMT-2"
                    },
                    {
                        id: -1,
                        name: "Europe/Lisbon",
                        short: "GMT-1"
                    },
                    {
                        id: 0,
                        name: "Europe/Londen",
                        short: "GMT+0"
                    },
                    {
				        id: 1,
				        name: "Europe/Amsterdam",
				        short: "GMT+1"
				    },
				    {
				        id: 2,
				        name: "Europe/Istanbul",
				        short: "GMT+2"
				    }
				];

				$scope.langs = [{
				    id: 1,
				    name: "Deutsch",
				    short: "de"
				},
				{
				    id: 2,
				    name: "English",
				    short: "en"
				},
				{
				    id: 3,
				    name: "Türkçe",
				    short: "tr"
				},
				{
				    id: 3,
				    name: "Espaniol",
				    short: "es"
				},
				{
				    id: 4,
				    name: "Français",
				    short: "fr"
				}];

				$scope.selectedLang = $rootScope.currentLang ? $scope.langs.filter(function (x) { return x.short == $rootScope.currentLang })[0].name : $scope.langs.filter(function (x) { return x.short == defaultLang })[0].name;
				
				$scope.onSelectLang = function (item) {
				
				    var filteredLang = $scope.langs.filter(function(x){ return x.name == $scope.selectedLang });
				    $scope.selectedLang = item.name;
				    $rootScope.currentLang = item.short;
				    $translate.use(item.short);

                    try{
                        localStorageService.set('selectedLang', item.short);
                    }
				    catch (e) {

				    }

				    var url = apiURL + "/user/getsetculture?lang="+item.short;
				    $http
					    .get(url,loginData.getAuthOptions())
					    .success(function(data) {
					        console.log("language set");
					        $state.reload();
					    });

				}
			    try{
			        $scope.selectedZone = $rootScope.currentZone ? $scope.zones.filter(function (x) { return x.name == $rootScope.currentZone })[0].name : $scope.zones.filter(function (x) { return x.name == defaultZone })[0].name;
			    }
			    catch(e){
			        $scope.selectedZone = defaultZone;
			    }

				$scope.onSelectZone = function (item) {

				    var filteredLang = $scope.zones.filter(function (x) { return x.name == $scope.selectedZone });
				    $scope.selectedZone = item.name;
				    $rootScope.currentZone = item.name;
				    moment.tz.setDefault(item.name);

				    try {
				        localStorageService.set('selectedZone', item.name);
				    }
				    catch (e) {

				    }
				}

			$scope.doLogout = function() {
				loginData.logout();
				$state.go('homepage');
				$state.reload();
			}

			var deregLoginEvent = $rootScope.$on('LOGIN_EVENT', function (event, args) {
			    $scope.isLoggedin = args.isLoggedin;
			});
			var deregLogoutEvent = $rootScope.$on('LOGOUT_EVENT', function (event, args) {
			    $scope.isLoggedin = args.isLoggedin;
			});

			$scope.$on('$destroy', function () {
			    deregLoginEvent();
			    deregLogoutEvent();
			});
			
			$scope.casinoallowed = true;

			angular.element(document).ready(function () {
			    
		        loginData.isLoggedin().then(function (promise) {
		            $scope.isLoggedin = promise.success;

		            if (promise.success && usecasino) {
		                $scope.casinoallowed = $rootScope.userSettings ? $rootScope.userSettings.CasinoAllowed : localStorageService.get('userSettings') ? localStorageService.get('userSettings').CasinoAllowed : false;
		            }
		        });

		        $(window).scrollTop(0);
   		     });
		}

})();