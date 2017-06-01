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
	
	    $scope.doLogout = function () {
	        loginData.logout();
	    }

	    $scope.checkEnter = function (evt, field) {
	        if (evt.keyCode != 13)
	            return;
	        if (field == 'username')
	            $("input[name=loginPassword]").focus();
	        if (field == 'pw' && $scope.user.password)
	            $scope.getLogin($scope.user);

	    }

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
		    msgDialogSrvc.showDialog('#loginForm', 'error', 'usernameorpasswordempty_warning');
		    return;
		}
		loginData.login(user).then(function (promise) {
		    user.password = "";
		    if(!promise.success)
		    {
		        if (promise.msg)
		            msgDialogSrvc.showDialog('#loginForm', 'error', promise.msg);
                else
		            msgDialogSrvc.showDialog('#loginForm', 'error', 'login_failed');
		        loadingEl.addClass('hidden');
		        return;
		    }

		    if (promise.payload.success == true) {
		        console.log('true');
		        loadingEl.addClass('hidden');
		        
		        if($state.current.name=='login')
		            $state.go(startpage);
		       
		        
		    }
		    else {
		        msgDialogSrvc.showDialog('#loginForm', 'error', promise.payload.msg);
		        loadingEl.addClass('hidden');
		    }

		});

		}

	}
})();