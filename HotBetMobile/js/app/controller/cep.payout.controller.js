(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('cepbankpayoutCtrl', cepbankpayoutCtrl);

	function cepbankpayoutCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, loginData, $filter, msgDialogSrvc, $mdMedia) {
	    var loadingEl = angular.element(document.querySelector('.page-loading'));
		$rootScope.currentPage = $filter('translate')($state.$current.name);
		
		$scope.user = {};
		$scope.banks = [{
			id:0,
			name: "Akbank",
		},
        {
            id:1,
            name: "DenizBank",
        },
        {
            id:2,
            name: "Garanti Bankasi",
        },
        {
            id:3,
            name: "Isbank",
        },
        {
            id:4,
            name: "Yapi Kredi",
        }
		];
		$scope.myDate = new Date();
		$scope.minDate = new Date(
			$scope.myDate.getFullYear(),
			$scope.myDate.getMonth() - 2,
			$scope.myDate.getDate());

		$scope.maxDate = new Date(
			$scope.myDate.getFullYear() - 18,
			$scope.myDate.getMonth(),
			$scope.myDate.getDate());


		$scope.requestPayment = function (user) {

		    if (!user || !user.bdate)
		        return;

		    var bdate = moment(user.bdate).format('YYYY-MM-DD');

		    loadingEl.removeClass('hidden');
		    var url = apiURL + "payment/GetPerformCepWithrawalMobile?value=" + user.amount + "&personalid=" + user.personalid +
                "&bankname="+user.bank+"&name="+user.name+"&PhoneNumber="+user.phonenumber+
                "&Account1=" + user.account1 + "&Account2=" + user.account2 + "&birthdate=" + bdate;
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
		            $state.go('login');
		            return;
		        }
		        $scope.user = {
		            amount: $rootScope.tmpamount
		        };

		    });
		});
	}
})();