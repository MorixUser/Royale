(function () {
    'use strict';
    angular
	.module('betApp')
	.controller('hbbetslipCtrl', hbbetslipCtrl);

    function hbbetslipCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, loginData, $filter, $mdDialog, $mdMedia, $sce) {

        $rootScope.currentPage = $filter('translate')($state.$current.name);
        
        $scope.url = $sce.trustAsResourceUrl(sblobbyurl+"/Mobile/Betslip");

    }
})();