(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('recoverPWCtrl', recoverPWCtrl);

	function recoverPWCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, msgDialogSrvc, $filter) {
		$rootScope.currentPage = $filter('translate')('password_recovery');
		$rootScope.inIndex = false;
		$scope.user = { value: "" };
		
		$scope.submit = function(user) {
			
		    var url = apiURL + "/user/GetPasswordRecovery?value=" + user.value;
			
			$http
			.get(url)
			.success(function(data) {
				console.log(data);
				if (data.success == true) {
				    msgDialogSrvc.showDialog('#registerForm', 'success', data.msg);
				}
				else {
				    msgDialogSrvc.showDialog('#registerForm', 'error', data.msg);
				}
			});
		}
	}
})();