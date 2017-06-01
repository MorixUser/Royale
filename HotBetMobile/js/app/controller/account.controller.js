(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('accountCtrl', accountCtrl);

	function accountCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, loginData, $filter, $mdDialog, $mdMedia) {
	    $scope.payinallowed = $rootScope.userSettings ? $rootScope.userSettings.OnlinePayinAllowed : localStorageService.get('userSettings') ? localStorageService.get('userSettings').OnlinePayinAllowed : false;
	    $scope.payoutallowed = $rootScope.userSettings ? $rootScope.userSettings.OnlinePayoutAllowed : localStorageService.get('userSettings') ? localStorageService.get('userSettings').OnlinePayoutAllowed : false;

	    $scope.usertype = $rootScope.usertype ? $rootScope.usertype : localStorageService.get('usertype') ? localStorageService.get('usertype') : false;

	    $scope.onlinepayment = onlinepayment;

		$rootScope.currentPage = $filter('translate')($state.$current.name);
		
		$scope.doLogout = function() {
			loginData.logout();
			$state.go('homepage');
		}
		
		
		angular.element(document).ready(function () {
		    loginData.isLoggedin().then(function (promise) {
		        if (!promise.success)
		            $state.go('login');

		    });
		});
	}
})();