(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('banktransferCtrl', banktransferCtrl);

	function banktransferCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, loginData, $filter, msgDialogSrvc, $mdMedia) {
	    var loadingEl = angular.element(document.querySelector('.page-loading'));
		$rootScope.currentPage = $filter('translate')($state.$current.name);
		
		$scope.user = {};

		$scope.requestPayment = function (user) {

		    if (!user)
		        return;

		    if (!user.bankcode || !user.bankname || !user.amount || !user.accountnbr)
		    {
		        msgDialogSrvc.showDialog('#registerForm', 'error', 'required_inputs_missing');
		        return;
		    }

		    loadingEl.removeClass('hidden');
		    var url = apiURL + "payment/GetBankTransfer?amount=" + user.amount + "&currency=" + user.currency +
                "&bankname=" + user.bankname + "&bankcode=" + user.bankcode + "&accountnbr=" + user.accountnbr;
			$http
				.get(url, loginData.getAuthOptions())
				.then(function (data) {
				    loadingEl.addClass('hidden');
				    if (data.data.success == true) {
				        msgDialogSrvc.showDialog('#registerForm', 'success', data.data.msg);
				    }
				    else {
				        msgDialogSrvc.showDialog('#registerForm', 'error', data.data.msg);
				    }
				});
			
		}
		
		angular.element(document).ready(function () {
		    loginData.isLoggedin().then(function (promise) {
		        if (!promise.success) {
		            $state.go(startpage);
		            return;
		        }

		        if (!$rootScope.tmpamount || !$rootScope.tmpcurrency)
		            $state.go(startpage);

		        $scope.user = {
		            amount: $rootScope.tmpamount,
		            currency: $rootScope.tmpcurrency
		        };

		    });
		});
	}
})();