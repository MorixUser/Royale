(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('mailCtrl', mailCtrl);

	function mailCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, $filter, loginData, $timeout, msgDialogSrvc) {
	    $scope.model = {};
	    $scope.mailmessage = $filter('translate')('contact_mail').replace('{mail}', supportmail);
		

		$scope.send = function(model){
		    var url = apiURL + "mail/GetContactMail?from=" + model.from + "&subject=" + model.subject + "&mailbody="+model.mailbody;
		    $http
			.get(url)
			.success(function (data) {
			    if (data.success == true) {
			        msgDialogSrvc.showDialog('#registerForm', 'success', 'message_sent');
			        model = "";
			    }
			    else {
			        msgDialogSrvc.showDialog('#registerForm', 'error', data.msg);
			    }
			});

		}

		angular.element(document).ready(function () {
		    var stateName = $state.$current.name;
		    $rootScope.currentPage = $stateParams.name;
		});



	}
})();