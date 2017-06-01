(function () {
    'use strict';
    angular
		.module('betApp')
		.controller('realityCheckCtrl', realityCheckCtrl);

    function realityCheckCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, $filter, loginData, betSlipSrvc, $timeout, $interval) {
        $scope.isLoggedin = false;
        $scope.isPopupVisible = false;
        $scope.realityData = [];
        $scope.iTimer = null;

        $scope.startInterval = function () {
            $scope.iTimer = $interval($scope.realityCheck, 1000 * 1 * realityCheckTimeout);
        };

        $scope.stopInterval = function () {
            if (angular.isDefined($scope.iTimer)) {
                $interval.cancel($scope.iTimer);
            }
        };
          
        if (!angular.isDefined($rootScope.currDialogPriority)) {
            $rootScope.currDialogPriority = 0;
            console.log("isDefined?:" + angular.isDefined($rootScope.currDialogPriority));
        }

        var deregLoginEvent = $rootScope.$on('LOGIN_EVENT', function (event, args) {
            if (args.isLoggedin == $scope.isLoggedin) return;
            $scope.isLoggedin = args.isLoggedin;
            console.log("login is ok");
            if (args.isLoggedin) {
                //timer = $timeout($scope.realityCheck, 1000 * 60);
                $scope.startInterval();
            }
        });

        var deregLogoutEvent = $rootScope.$on('LOGOUT_EVENT', function (event, args) {
            $scope.kill(); 
            $scope.isLoggedin = args.isLoggedin; 
        });

        $scope.kill = function() {
            $scope.stopInterval();
            $scope.isPopupVisible = false;
            $scope.closeDialogs();
        };

        $scope.$on('destroy', function () {
            $scope.kill();
            deregLoginEvent();
            deregLogoutEvent();
        });

        $scope.doLogout = function () {
            console.log("logout user");
            $scope.closeDialogs();
            $scope.isLoggedin = false;
            $scope.kill();
            loginData.logout();
        };

        $scope.continueBrowsing = function () {
            console.log("continue browsing");
            $scope.closeDialogs();
            localStorageService.set('realityCheckLastDate', moment());
            $scope.isPopupVisible = false;
            $scope.startInterval();
        };

        $scope.closeDialogs = function() {
            parent.$.fancybox.close();
            $rootScope.currDialogPriority = 0;
        };

        $scope.realityCheck = function () {
            if (!$scope.isLoggedin) return;
            var url = apiURL + "/payment/GetRealityCheck";
            console.log("will call realitycheck");
            $http
                .get(url, loginData.getAuthOptions())
                .success(function (data) {
                    $scope.realityData = data;
                    console.log($scope.realityData);
                    $timeout(function () {
                    if (!$scope.isLoggedin) return;
                        if ($rootScope.currDialogPriority < 1) {
                            $scope.isPopupVisible = true;
                            $rootScope.currDialogPriority = 1;
                            $scope.stopInterval();
                            showRealityCheckFrame();
                        } 
                    }, 1000);
                    
                });
        }; 
    }
})();