(function () {
    'use strict';
    angular
	.module('betApp')
	.controller('hbsportCtrl', hbsportCtrl);

    function hbsportCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, loginData, $filter, $mdDialog, $mdMedia, $sce) {

        $rootScope.currentPage = $filter('translate')($state.$current.name);
        var lang = $rootScope.currentLang;
        if (!lang || lang == '')
            lang = defaultLang;
        
        angular.element(document).ready(function () {



			$http.get(apiURL + "/hbsport/GetEToken?lang="+lang+"&layout=2", loginData.getAuthOptions()).
			success(function (data, status, headers, config) {

				if (data.success) {
					$scope.url = $sce.trustAsResourceUrl(sblobbyurl + "/service/authorization?mobile=1&" + data.token);
				}
			}).
			error(function (data, status, headers, config) {
				msgDialogSrvc.showDialog('#registerForm', 'error', 'loading_failed');
			});


        });
    }
})();