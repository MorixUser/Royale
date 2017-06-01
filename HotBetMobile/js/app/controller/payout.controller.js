(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('payoutCtrl', payoutCtrl);

	function payoutCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, loginData, $filter, msgDialogSrvc, $mdMedia) {
		
	    $scope.selcurrency = "EUR";
	    $scope.amount = "0.00";

	    $scope.paymentMethods = [];

	    
	    $scope.setPaymentMethods = function (pmts) {

	        $scope.paymentMethods = [
                { id: 10, name: 'BankTransfer', pclass: 'logo_banktransfer' },
	        ];

	        if (pmts.indexOf("CEP")>=0 && $scope.geoip=="TRY") {
	            $scope.paymentMethods.push(
                    { id: 3, name: 'Cep', pclass: 'logo_cepbank', currency: 'TRY' }
                );
	        }

	        if (pmts.indexOf("UKASHRPP")>=0) {
	            $scope.paymentMethods.push(
                    { id: 4, name: 'UKash', pclass: 'logo_ukash' }
                );
	        }
	        if (pmts.indexOf("MBKR")>=0) {
	            $scope.paymentMethods.push(
                    { id: 0, name: 'Skrill', pclass: 'logo_skrill' }
                );
	        }
	        if (pmts.indexOf("ECOW")>=0) {
	            $scope.paymentMethods.push(
                    { id: 1, name: 'EcoPayz', pclass: 'logo_ecopayz' }
                );
	        }
	        if (pmts.indexOf("VISA")>=0) {
	            $scope.paymentMethods.push(
                    { id: 5, name: 'Visa', pclass: 'logo_visa'}
                );
	        }
	        if (pmts.indexOf("MASTERCARD")>=0) {
	            $scope.paymentMethods.push(
                    { id: 6, name: 'MasterCard', pclass: 'logo_mastercard' }
                );
	        }
	        if (pmts.indexOf("NT") >= 0) {
	            $scope.paymentMethods.push(
                    { id: 8, name: 'Neteller', pclass: 'logo_neteller' }
                );
	        }
	    }

	    $scope.vCondition = -1;
	    $scope.ngcheckoutapco = function () {

	        var ptv = $scope.selectedPayMethod;
	        var pt = parseInt(ptv);
	        var pmt = {};
	        angular.forEach($scope.paymentMethods, function (item, value) {
	            if (item.id == pt)
	                pmt = item;
	        });

	        if (pmt.currency && pmt.currency.indexOf($scope.selcurrency) < 0) {
	            var msg = $filter('translate')('pleaseselectoneoffollowingcurrencies') + pmt.currency;
	            msgDialogSrvc.showDialog('#registerForm', 'warning', msg);
	            return;
	        }

	        if (pmt.id == 3) {
	            $rootScope.tmpamount = $scope.amount;
	            $state.go('cepbankpayout');
	            return;
	        }

	        $scope.checkoutapco();
	    }


	    $scope.exchangeMsg = "";
	    $scope.onCurrencyChangeApco = function () {

	        var url = url = apiURL + "/payment/GetExchangeValue?currency=" + $scope.selcurrency + "&value=" + $scope.amount + "&payout=true";

	        $http
			.get(url, loginData.getAuthOptions())
			.success(function (data) {
			    $scope.exchangeMsg = data.message;

			});

	    }

	    $scope.selectedPayMethod = 0;
	    $scope.changeMethod = function (id) {
	        $scope.selectedPayMethod = id;
	    }

	    $scope.checkoutapco = function () {

	        var url = url = apiURL + "/payment/GetPayoutValidation?currency=" + $scope.selcurrency + "&amount=" + $scope.amount + "&pmt=" + $scope.selectedPayMethod;

	        $http
			.get(url, loginData.getAuthOptions())
			.success(function (data) {
			   
			    if (data.message && data.message.length > 0)
			        msgDialogSrvc.showDialog('#registerForm', 'error', data.message);
			    if (data.success) {
			        window.parent.scroll(0, 0);
			        if (data.redirect) {
			            window.location.href = data.redirecturl;
			            return;
			        }

			        $http
                   .get(apiURL + "/payment/GetCheckoutPage?payout=true", loginData.getAuthOptions())
                   .success(function (data2) {
                       var newDoc = document.open("text/html", "replace");
                       newDoc.write(data2);
                       newDoc.close();
                   });

			    }

			});
	    }

	    $scope.verified = false;
	    $scope.notverified = false;
	    $scope.geoip = "";

	    angular.element(document).ready(function () {
	        $rootScope.currentPage = $filter('translate')($state.$current.name);

		    loginData.isLoggedin().then(function (promise) {

		        if (!promise.success)
		            $state.go('login');

		        $http
                   .get(apiURL + "/payment/GetVerifiedStatus", loginData.getAuthOptions())
                   .success(function (data) {
                       $scope.verified = data.success;
                       $scope.notverified = !data.success;
                       
                       if (!$scope.verified)
                           return;

                       
                       $scope.geoip = data.geoip;
                       $scope.selcurrency = data.currency;
                       $scope.setPaymentMethods(data.pmts);
                   });

		    });
		});
	}
})();