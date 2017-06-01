(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('personalLimitCtrl', personalLimitCtrl);

	function personalLimitCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, loginData, $filter, msgDialogSrvc, $mdMedia) {
		
	    $scope.limits = {};

	    $scope.savelimits = function () {

	        if ($scope.limits.LockedTimeRangeType == 4){
	            $scope.limits.Locked = true;
	        }


	        $http.get(apiURL + "/user/GetSetPersonalLimits?StakeSessionValue=" + $scope.limits.StakeSessionValue + "&LossTimeRangeType=" + $scope.limits.LossTimeRangeType +
                "&LossValue=" + $scope.limits.LossValue + "&StakeValue=" + $scope.limits.StakeValue + "&StakeTimeRangeType=" + $scope.limits.StakeTimeRangeType +
                "&Locked=" + $scope.limits.Locked + "&LockedTimeRangeType=" + $scope.limits.LockedTimeRangeType +
                "&CasinoTimeRangeType=" + $scope.limits.CasinoTimeRangeType + "&CasinoValueInt=" + $scope.limits.CasinoValueInt,
                loginData.getAuthOptions()).
            success(function (data, status, headers, config) {
                if (!data.success)
                    msgDialogSrvc.showDialog('#registerForm', 'error', data.msg);
                else {
                    msgDialogSrvc.showDialog('#registerForm', 'success', data.msg);
                    setTimeout(function () {
                        loginData.logout();
                    }, 3000);
                }
            }).
            error(function (data, status, headers, config) {
                msgDialogSrvc.showDialog('#registerForm', 'error', 'saving_failed');
            });
	    }

	    angular.element(document).ready(function () {
	        $rootScope.currentPage = $filter('translate')($state.$current.name);

		    loginData.isLoggedin().then(function (promise) {

		        if (!promise.success)
		            $state.go(startpage);


		        $http
                  .get(apiURL + "/user/GetPersonalLimits", loginData.getAuthOptions())
                  .success(function (data) {

                      $scope.limits = data;
                      if (!$scope.limits.LossTimeRangeType)
                          $scope.limits.LossTimeRangeType = 0;
                      if (!$scope.limits.StakeTimeRangeType)
                          $scope.limits.StakeTimeRangeType = 0;
                      if (!$scope.limits.CasinoTimeRangeType)
                          $scope.limits.CasinoTimeRangeType = 0;
                      $scope.limits.LockedTimeRangeType = 0;
                      
                  });

		    });
		});
	}
})();