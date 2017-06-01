(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('bottommenuCtrl', bottommenuCtrl);

	function bottommenuCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams,
        loginData, $filter, $mdDialog, $mdMedia, betSlipSrvc,$timeout,$window,balanceChangeSvc) {
	    $scope.isLoggedin = false;
	    $rootScope.isLoggedin = $scope.isLoggedin;
	    $scope.userBalance = 0;
	    $scope.usecasino = usecasinobottom;
	    $rootScope.header3 = header3;

	    $scope.navto = function (page) {
	        $rootScope.searchMode = false;
	        $state.go(page);
	    }

	    $scope.gotoCasino = function () {
	        $window.location = casinolink;
	    }


		$scope.getUserBalance = function (setlang) {
		    var url = apiURL + "/user/GetCurrentBalance";

		    $http
			.get(url, loginData.getAuthOptions())
			.success(function (data) {
			    $scope.userBalance = data.saldo;
			    if (setlang) {
			        var url2 = apiURL + "/user/getsetculture?lang=" + $rootScope.currentLang;
			        $http
                        .get(url2, loginData.getAuthOptions())
                        .success(function (data2) {
                            console.log("language set");
                        });
			    }

			});
		}
		
		var deregBalanceEvent = $rootScope.$on('BALANCE_EVENT', function (event, args) {
			console.log('balanceevent received');
			if($rootScope.isLoggedin)
				$scope.userBalance = args.data.balance;
        });

		var deregLoginEvent = $rootScope.$on('LOGIN_EVENT', function (event, args) {
		    $scope.isLoggedin = args.isLoggedin;
		    $rootScope.isLoggedin = $scope.isLoggedin;
		    if (args.isLoggedin) {
		        $scope.getUserBalance(true);

		    }
		    betSlipSrvc.setTipCount();
		});
		var deregLogoutEvent = $rootScope.$on('LOGOUT_EVENT', function (event, args) {
		    $scope.isLoggedin = args.isLoggedin;
		    $rootScope.isLoggedin = $scope.isLoggedin;
		    $scope.userBalance = 0;
		});
		var deregTPEvent = $rootScope.$on('TICKET_PLACED_EVENT', function (event, args) {
		    $scope.getUserBalance();
		});

		$scope.$on('$destroy', function () {
			deregBalanceEvent();
		    deregLoginEvent();
		    deregLogoutEvent();
		    deregTPEvent();
		});

		$scope.checkLoginInterval = function () {

		    setTimeout(function () {
		        loginData.isLoggedin().then(function (promise) { $scope.checkLoginInterval(); });
		    }, 60000)
		}


		angular.element(document).ready(function () {

		    var currentlang = localStorageService.get('selectedLang');
		    if (currentlang) {
		        $rootScope.currentLang = currentlang;
		        $translate.use(currentlang);
		    }
		    else {
		        $rootScope.currentLang = defaultLang;
		        $translate.use(defaultLang);
		        try {
		            localStorageService.set('selectedLang', defaultLang);
		        }
		        catch (e) {

		        }

		    }

		    var url = apiURL + "/user/getsetculture?lang=" + $rootScope.currentLang;
		    $http
                .get(url, loginData.getAuthOptions())
                .success(function (data) {
                    console.log("language set");
                });

		    var currentzone = localStorageService.get('selectedZone');
		    if (currentzone) {
		        $rootScope.currentZone = currentzone;
		        moment.tz.setDefault(currentzone);
		    }
		    else {
		        $rootScope.currentZone = defaultZone;
		        moment.tz.setDefault(currentzone);
		        try {
		            localStorageService.set('selectedZone', defaultZone);
		        }
		        catch (e) {

		        }

		    }

			balanceChangeSvc.init();
		    $scope.casinoallowed = true;
		    loginData.isLoggedin().then(function (promise) {
		        $scope.checkLoginInterval();
		        if (promise.success && usecasinobottom) {
		            $scope.casinoallowed = $rootScope.userSettings ? $rootScope.userSettings.CasinoAllowed : localStorageService.get('userSettings') ? localStorageService.get('userSettings').CasinoAllowed : false;
		        }
		    });
		});
	}
})();