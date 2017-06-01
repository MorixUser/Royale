(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('transactionsCtrl', transactionsCtrl);

	function transactionsCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, loginData, $filter, $mdDialog, $mdMedia) {
		
		$rootScope.currentPage = $filter('translate')($state.$current.name);
		$scope.items = [];
		$scope.currentPage = 1;
		$scope.pageSize = 10;
		$scope.totalPages = 1;
		$scope.filterMode = 'simple';
		$scope.selectedMonth = '0';
		var myTimeUnformatted = new Date();
		$scope.filter = { fromDate: myTimeUnformatted, toDate: myTimeUnformatted };

		
		$scope.getTransactionByDate = function(page) {
		    
		    if (page && page > $scope.totalPages)
		        page = $scope.totalPages;
		    if (page && page < 1)
		        page = 1;
		    if (page) {
		        $scope.currentPage = page;
		    }

		    if ($scope.filterMode == 'simple') {

		        switch ($scope.selectedMonth) {
                    case '0':
		                $scope.filter.fromDate = moment().add(-1, 'months').format('DD.MM.YYYY');
		                $scope.filter.toDate = moment().add(0, 'days').format('DD.MM.YYYY');
		                break;
		            case '1':
		                $scope.filter.fromDate = moment().add(-3, 'months').format('DD.MM.YYYY');
		                $scope.filter.toDate = moment().add(0, 'days').format('DD.MM.YYYY');
		                break;
		            case '2':
		                $scope.filter.fromDate = moment().add(-1, 'year').format('DD.MM.YYYY');
		                $scope.filter.toDate = moment().add(0, 'days').format('DD.MM.YYYY');
		                break;
		            case '3':
		                $scope.filter.fromDate = '1.1.2000';
		                $scope.filter.toDate = moment().add(0, 'days').format('DD.MM.YYYY');
		                break;
		        }

		    }

		    var url = apiURL + "/stat/gettransactionhistory?fromdate=" + $filter('serviceDateFilter')($scope.filter.fromDate) + "&todate=" + $filter('serviceDateFilter')($scope.filter.toDate) + "&pagesize=" + $scope.pageSize + "&pagenumber=" + $scope.currentPage;

			$http
				.get(url, loginData.getAuthOptions())
				.success(function(data) {
					$scope.totalItems = data.totalItems;
					$scope.items = data.list;
					$scope.totalPages = data.totalPages;
					if ($scope.totalPages < 1)
					    $scope.totalPages = 1;

					angular.forEach($scope.items, function(i,v) {
						if (i.dValue > 0) {
							i.ispositive = true;
						} else {
							i.ispositive = false;
						}
					});
				});
		}
		

		
		angular.element(document).ready(function () {
		    loginData.isLoggedin().then(function (promise) {

		        if (!promise.success)
		            $state.go(startpage);
		        else
		            $scope.getTransactionByDate();
		    });
		});
	}
})();