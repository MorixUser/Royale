(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('pwrecoverCtrl', pwrecoverCtrl);

	function pwrecoverCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, loginData, $filter, msgDialogSrvc, $mdMedia) {
	    var loadingEl = angular.element(document.querySelector('.page-loading'));

		$rootScope.currentPage = $filter('translate')($state.$current.name);
		
		$scope.getChangePassword = function (user) {
		    if (user.pw1 != user.pw2)
			    return;

			loadingEl.removeClass('hidden');
			var salt = NewSalt();
			var hash = CryptoJS.SHA256(salt + user.pw1);
			var newURL = apiURL + "/user/GetFinishPasswordRecovery?salt=" + salt + "&hash=" + hash + "&code=" + $scope.activationcode + "&username=" + $scope.username;
                        
			$http
				.get(newURL)
				.then(function (datares) {
					loadingEl.addClass('hidden');

					if (datares && datares.data.success) {
					    msgDialogSrvc.showDialog('#loginForm', 'success', 'changepw_succeded');
					    $state.go(startpage);
					}
					else {
						if (datares && datares.data.msg)
							msgDialogSrvc.showDialog('#loginForm', 'error', datares.data.msg);
						else
							msgDialogSrvc.showDialog('#loginForm', 'error', 'changepw_failed');
					}
							    
				});
			
				
		}

		
		$scope.username = "";
		$scope.activationcode = "";

		angular.element(document).ready(function () {
		    $scope.username = getParameterByName('username');
		    $scope.activationcode = getParameterByName('activationcode');
		});
	}
})();