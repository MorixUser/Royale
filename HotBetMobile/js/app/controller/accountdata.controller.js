(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('accountDataCtrl', accountDataCtrl);

	function accountDataCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, loginData, $filter, msgDialogSrvc, $mdMedia) {
	    var loadingEl = angular.element(document.querySelector('.page-loading'));
		$rootScope.currentPage = $filter('translate')($state.$current.name);
		
		$scope.countries = [];
		$scope.user = {};
		$scope.currencies = [{
			id:0,
			name: "Euro",
			code: "EUR"
		}, {
			id:1,
			name: "Turkish Lira",
			code: "TRY"
		}, {
			id:2,
			name: "US-Dollar",
			code: "USD"
		},
		{
			id:3,
			name: "Russian Pubel",
			code: "RUB"
		}, {
			id:4,
			name: "Switzer Franken",
			code: "CHF"
		}];

		
		$scope.getUserInformation = function() {
			var url = apiURL + "user/getpersonalsettings";
			$http
				.get(url, loginData.getAuthOptions())
				.success(function(data) {
					$scope.user = data;
					var date = new Date(data.birthyear, data.birthmonth, data.birthday);
					$scope.user.bdate = moment(date).format();
					$scope.user.bdate = new Date($scope.user.bdate);
					$scope.countries = data.Countries;
				});
		}

		$scope.getChangeUserData = function (user) {

		    if (!user || !user.email || !user.mobilephone)
		        return;
		    loadingEl.removeClass('hidden');
		    var url = apiURL + "user/GetSetPersonalSettings?email=" + user.email + "&mobile=" + user.mobilephone;
			$http
				.get(url, loginData.getAuthOptions())
				.then(function (data) {
				    loadingEl.addClass('hidden');
				    if (data && data.data.msg) {
				            msgDialogSrvc.showDialog('#loginForm', 'success', data.data.msg);
				    }
				});
			
		}
		
		angular.element(document).ready(function () {
		    loginData.isLoggedin().then(function (promise) {
		        if (!promise.success) {
		            $state.go('login');
		            return;
		        }

		        $scope.getUserInformation();

		    });
		});
	}
})();