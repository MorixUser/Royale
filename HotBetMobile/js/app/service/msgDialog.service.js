(function () { 
	'use strict';
	angular
		.module('betApp')
		.factory('msgDialogSrvc', msgDialogSrvc);
	
	function msgDialogSrvc($http, localStorageService, $state, $filter, $q, $rootScope, $mdDialog) {
		return {
		    
			
			showDialog: function(parent,title,content) {
			    $mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.querySelector(parent)))
					.clickOutsideToClose(true)
					.title($filter('translate')(title))
					.textContent($filter('translate')(content))
					.ok($filter('translate')('ok'))
					.targetEvent()
					);
			},
			
		}

	}

})();