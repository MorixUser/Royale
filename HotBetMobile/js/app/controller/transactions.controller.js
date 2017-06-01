(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('transactionsCtrl', transactionsCtrl);

	function transactionsCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, loginData, $filter, $mdDialog, $mdMedia) {
		
		$rootScope.currentPage = $filter('translate')($state.$current.name);
		$scope.filterByDate = false;
		$scope.items = [];
		$scope.pageSize = 20;
		$scope.pageNumber = 1;
		$scope.date = {
		    from: moment().add(-30, 'days'),
		    to: moment()
		};
		
		$scope.getTransactionByDate = function(date) {
			
		    var url = apiURL + "/stat/gettransactionhistory?fromdate=" + moment($scope.date.from).format('YYYY-MM-DD') + "&todate=" + moment($scope.date.to).format('YYYY-MM-DD');

			$http
				.get(url, loginData.getAuthOptions())
				.success(function(data) {
					$scope.totalItems = data.totalItems;
					$scope.items = data.list;

					angular.forEach($scope.items, function(i,v) {
						if (i.dValue > 0) {
							i.ispositive = true;
						} else {
							i.ispositive = false;
						}
					});
				});
		}
		

		$scope.changeTransactPage = function(page, limit) {
			$scope.pageNumber = page;
			$scope.pageSize = limit;
			$scope.getTransactionByDate();
		}

		angular.element(document).ready(function () {
		    loginData.isLoggedin().then(function (promise) {

		        if (!promise.success)
		            $state.go('login');

		    });
		});
	}
})();