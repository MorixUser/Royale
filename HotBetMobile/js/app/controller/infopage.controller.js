(function() {
	'use strict';
	angular
		.module('betApp')
		.controller('infoPageCtrl', infoPageCtrl);
	function infoPageCtrl($scope, $rootScope, $translate, $filter, localStorageService, loginData, $state, $http, $stateParams) {
				

		$scope.showExternalPage = function (page) {
		    page = page.replace('{lang}', $rootScope.currentLang);
		    $scope.infoPage = infoDomain + page;
		    window.scrollTo(0, 0);
		}

		angular.element(document).ready(function () {
		    $rootScope.currentPage = $filter('translate')($stateParams.name);
		    $scope.showExternalPage($stateParams.page);
   		 });
		}

})();