(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('changepwCtrl', changepwCtrl);

	function changepwCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, loginData, $filter, msgDialogSrvc, $mdMedia) {
	    var loadingEl = angular.element(document.querySelector('.page-loading'));

		$rootScope.currentPage = $filter('translate')($state.$current.name);
		
		$scope.getChangePassword = function (user) {
		    if (!user || user.pw1 != user.pw2)
			    return;

			loadingEl.removeClass('hidden');

			var username = $rootScope.currentUser ? $rootScope.currentUser : localStorageService.get('currentUser');
			var url = apiURL + "/user/GetCheckLogonPart1?username=" + username;
			var oldhash,
			oldsalt;
			$http
				.get(url)
				.then(function (data) {

				    

				    if (data && data.data && data.data.success == true) {
				        oldhash = CryptoJS.SHA256(data.data.salt + user.oldpw);
				        var oldcode = CryptoJS.SHA256(data.data.token + oldhash);
				        var salt = NewSalt();
				        var hash = CryptoJS.SHA256(salt + user.pw1);
				        var newURL = apiURL + "/user/GetChangePassword?salt=" + oldhash + "&hash=" + oldcode + "&questionid=" + user.persq + "&answer=" + user.persa + "&newsalt=" + salt + "&newhash=" + hash;
                        
				        $http
							.get(newURL,loginData.getAuthOptions())
							.then(function (datares) {
							    loadingEl.addClass('hidden');

							    if (datares && datares.data.success) {
							        msgDialogSrvc.showDialog('#loginForm', 'success', 'changepw_succeded');
							    }
							    else {
							        if (datares && datares.data.msg)
							            msgDialogSrvc.showDialog('#loginForm', 'error', datares.data.msg);
							        else
							            msgDialogSrvc.showDialog('#loginForm', 'error', 'changepw_failed');
							    }
							    
							});
				    }
				    else {
				        loadingEl.addClass('hidden');
				        msgDialogSrvc.showDialog('#loginForm', 'error', 'changepw_failed');
				    }
				});
		}

		
		
		angular.element(document).ready(function () {
		    loginData.isLoggedin().then(function (promise) {
		        
		        if (!promise.success)
		            $state.go('login');

		    });
		});
	}
})();