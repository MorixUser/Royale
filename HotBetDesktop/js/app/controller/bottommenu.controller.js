(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('bottommenuCtrl', bottommenuCtrl);

	function bottommenuCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams,
        loginData, $filter, $mdDialog, $mdMedia, betSlipSrvc,$timeout) {
	    
	    

		$scope.$on('$destroy', function () {
		    
		});

		


		angular.element(document).ready(function () {

		    
		});
	}
})();