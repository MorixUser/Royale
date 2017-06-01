(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('loginCtrl', loginCtrl);

	function loginCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, msgDialogSrvc, loginData, $filter) {
	    var loadingEl = angular.element(document.querySelector('.page-loading'));
	
	    var lastusername = $rootScope.currentUser ? $rootScope.currentUser : localStorageService.get('currentUser');

	    $scope.user = { rememberlogin: defaultrememberme, userName: lastusername, password: '' };

	    $rootScope.currentPage = $filter('translate')('login');
	

	$scope.getLogin = function (user) {

	    if (user.rememberlogin) {
	        try {
	            localStorageService.set('rememberMe', true);
	            localStorageService.remove('rememberMe');
	        }
	        catch (e) {
	            msgDialogSrvc.showDialog('#loginForm', 'warning', 'privatemode_warning');
	            return;
	        }
	    }

	    loadingEl.removeClass('hidden');
		if (!user.userName || !user.password || user.userName=='' || user.password=='') {
		    loadingEl.addClass('hidden');
		    msgDialogSrvc.showDialog('#loginForm','error','usernameorpasswordempty_warning');
		}
		loginData.login(user).then(function (promise) {

		    if(!promise.success)
		    {
		        msgDialogSrvc.showDialog('#loginForm', 'error', 'login_failed');
		        loadingEl.addClass('hidden');
		        return;
		    }

		    if (promise.payload.success == true) {
		        console.log('true');
		        loadingEl.addClass('hidden');
		        
		        $state.go(startpage);
		        console.log(promise.payload);
		        
		    }
		    else {
		        msgDialogSrvc.showDialog('#loginForm', 'error', promise.payload.msg);
		        loadingEl.addClass('hidden');
		    }

		});

		}

	}
})();