(function () {
    'use strict';
    angular
	.module('betApp')
	.controller('supportCtrl', supportCtrl);

    function supportCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, $filter, betSlipSrvc, $timeout, msgDialogSrvc, $q, loginData, $location) {
        $scope.isChatServProtocolSsl = function () {
            var protocol = $location.protocol;
            if (protocol == 'http:')
                return true;
            return false;
        };
    }
})();