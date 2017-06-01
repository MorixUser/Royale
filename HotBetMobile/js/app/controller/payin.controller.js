(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('payinCtrl', payinCtrl);

	function payinCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, loginData, $filter, msgDialogSrvc, $mdMedia, $document) {
		
	    $scope.selcurrency = "EUR";
	    $scope.amount = "0.00";

	    $scope.paymentMethods = [];
	    $scope.setPaymentMethods = function (pmts) {
	        $scope.paymentMethods = [
                { id: 0, name: 'Skrill', pclass: 'logo_skrill', condiinfoDomaintionUrl: '/apcotransactions/pmtcontainer?pmt=Skrill' },
		        { id: 8, name: 'Neteller', pclass: 'logo_neteller', infoDomain: '/apcotransactions/pmtcontainer?pmt=Neteller' },
		        { id: 2, name: 'SofortBanking', pclass: 'logo_sofortbanking', infoDomain: '/apcotransactions/pmtcontainer?pmt=SofortBanking' },
		        { id: 1, name: 'EcoPayz', pclass: 'logo_ecopayz', infoDomain: '/apcotransactions/pmtcontainer?pmt=EcoPayz', currency: 'EUR,USD' },
		        { id: 7, name: 'PaySafe', pclass: 'logo_paysafecard', infoDomain: '/apcotransactions/pmtcontainer?pmt=PaysafeCard', currency: 'EUR' },
		        // { id: 3, name: 'Cep', pclass: 'logo_cepbank', infoDomain: '/apcotransactions/pmtcontainer?pmt=CepBank', currency: 'TRY' },
	        ];
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
	            var msg = $filter('translate')('pleaseselectoneoffollowingcurrencies')+": " + pmt.currency;
	            msgDialogSrvc.showDialog('#registerForm', 'warning', msg);
	            return;
	        }

	        if (pmt.id == 3) {
	            $rootScope.tmpamount = $scope.amount;
	            $state.go('cepbankpayin');
	            return;
	        }

	        $scope.checkoutapco();
	    }


	    $scope.exchangeMsg = "";
	    $scope.onCurrencyChangeApco = function () {

	        var url = url = apiURL + "/payment/GetExchangeValue?currency=" + $scope.selcurrency + "&value=" + $scope.amount + "&payout=false";

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

	        var url = url = apiURL + "/payment/GetPayinValidation?currency=" + $scope.selcurrency + "&amount=" + $scope.amount + "&pmt=" + $scope.selectedPayMethod;

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
                   .get(apiURL + "/payment/GetCheckoutPage?payout=false", loginData.getAuthOptions())
                   .success(function (data2) {
                       var newDoc = document.open("text/html", "replace");
                       newDoc.write(data2);
                       newDoc.close();
			        });

			    }

			});
	    }


	    angular.element(document).ready(function () {
	        $rootScope.currentPage = $filter('translate')($state.$current.name);

		    loginData.isLoggedin().then(function (promise) {

		        if (!promise.success)
		            $state.go('login');


		        $http
                  .get(apiURL + "/payment/GetVerifiedStatus", loginData.getAuthOptions())
                  .success(function (data) {
                      $scope.verified = data.success;



                      $scope.geoip = data.geoip;
                      $scope.selcurrency = data.currency;
                      $scope.setPaymentMethods(data.pmts);
                  });

		    });
		});
	}
})();