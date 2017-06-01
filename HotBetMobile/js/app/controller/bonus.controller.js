(function() {
	'use strict';
	angular
		.module('betApp')
		.controller('bonusCtrl', bonusCtrl);
	function bonusCtrl($scope, $rootScope, $translate, $filter, localStorageService, loginData, $state, $http, $stateParams) {
				
	    $scope.model = {};

	    $scope.navto = function (page) {
	        $rootScope.searchMode = false;
	        $state.go(page);
	    }

		$scope.showExternalPage = function (page) {
		    page = page.replace('{lang}', $rootScope.currentLang);
		    $scope.infoPage = infoDomain + page;
		    window.scrollTo(0, 0);
		}

		$scope.getCurrent = function () {
		    
		    var url = apiURL + "/bonus/get";
		        
		    $http
                .get(url, loginData.getAuthOptions())
                .success(function (data) {
                    $scope.model = data;
                });
		}

		$scope.activateBonus = function (bonus) {
		    var url = apiURL + "/bonus/getactivation?id="+bonus.id;

		    $http
                .get(url,loginData.getAuthOptions())
                .success(function (data) {
                    $scope.getCurrent();
                });
		}

		angular.element(document).ready(function () {
		    $rootScope.currentPage = $filter('translate')($state.$current.name);
		    loginData.isLoggedin().then(function (promise) {

		        $scope.isLoggedin = promise.success;

		        if (!$scope.isLoggedin) {
		            $rootScope.currentPage = $filter('translate')($stateParams.name);
		            $scope.showExternalPage($stateParams.page);
		            return;
		        }
		        else
		            $scope.getCurrent();



		    });

		    
   		 });
		}

})();