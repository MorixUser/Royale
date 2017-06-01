(function () {
    'use strict';
    angular
        .module('betApp')
        .controller('idleCtrl', idleCtrl)
        .config(function (IdleProvider, KeepaliveProvider) {
            // configure Idle settings
            console.log("idle timeout:" + idleTimeout);
            console.log("idle final timeout:" + idleTimeoutFinal);
            IdleProvider.idle(idleTimeout); // in seconds
            IdleProvider.timeout(idleTimeoutFinal); // in seconds
            KeepaliveProvider.interval(idleTimeout); // in seconds
        });

    function idleCtrl($scope, Idle, $rootScope, loginData, $compile, $timeout, $translate) {
        $scope.idleWatchStarted = false;
        $scope.userIsIdle = false;
        $scope.isLoggedin = $rootScope.isLoggedin;
        $scope.timerStarted = false;
        var timer;

        if (!angular.isDefined($rootScope.currDialogPriority)) {
            $rootScope.currDialogPriority = 0;
            console.log("isDefined?:" + angular.isDefined($rootScope.currDialogPriority));
        }

        var deregloginevent = $rootScope.$on('LOGIN_EVENT', function (event, args) {
            if (args.isLoggedin == false) return;
            if ($scope.idleWatchStarted) return;
            console.log("will start idle.watch");
            $scope.isLoggedin = args.isLoggedin;
            Idle.watch();
            $scope.idleWatchStarted = true;
        });

        var dereglogoutevent = $rootScope.$on('LOGOUT_EVENT', function (event, args) {
            $scope.isLoggedin = args.isLoggedin;
            $scope.closeDialogs();
        });

        $scope.$on('$destroy', function () {
            deregloginevent();
            dereglogoutevent();
            $scope.closeDialogs();
            $scope.stopTimer();
            $scope.idleWatchStarted = false;
            Idle.unwatch();
        });

        $scope.$on('IdleStart', function () {
            // the user appears to have gone idle
            if (!$scope.isLoggedin) return;
            $scope.timerStarted = false;
            console.log("idle start");
            $scope.userIsIdle = true;
            $timeout(function () {
                if ($rootScope.currDialogPriority < 2) {
                    $scope.closeDialogs();
                    $rootScope.currDialogPriority = 2;
                    showUserIdleFrame();
                }
            }, 1000);

        });

        $scope.$on('IdleTimeout', function () {
            // the user has timed out (meaning idleDuration + timeout has passed     without any activity) 
            if (!$scope.isLoggedin) return;
            if ($scope.timerStarted) return;
            console.log("idle timeout");
            $scope.closeDialogs();
            $scope.logoutUser();
            $scope.idleWatchStarted = false;
            Idle.unwatch();
            //$scope.userIsIdle = false;
            //Idle.watch();
        });

        $scope.$on('IdleEnd', function () {
            // the user has come back from AFK and is doing stuff. if you are     warning them, you can use this to hide the dialog
            if (!$scope.isLoggedin) return;
            //parent.$.fancybox.close();
            //$scope.userIsIdle = false;
            $scope.startTimer();
            console.log("idle end");
        });

        $scope.continueBrowsing = function () {
            console.log("continue browsing");
            $scope.userIsIdle = false;
            $scope.closeDialogs();
            $scope.stopTimer();
        };

        $scope.logoutUser = function () {
            console.log("logout user");
            $scope.closeDialogs();
            $scope.stopTimer();
            Idle.unwatch();
            loginData.logout();
        };
         
        $scope.closeDialogs = function () {
            $rootScope.currDialogPriority = 0;
            parent.$.fancybox.close();
        };

        $scope.stopTimer = function () {
            if ($scope.timerStarted) {
                $timeout.cancel(timer);
                $scope.timerStarted = false;
            }
        };

        $scope.startTimer = function () {
            if ($scope.timerStarted == false) {
                timer = $timeout($scope.timeoutEnded, 1000 * idleTimeoutFinal);
                $scope.timerStarted = true;
            }
        };

        $scope.timeoutEnded = function () {
            $scope.closeDialogs();
            $scope.logoutUser();
            $scope.idleWatchStarted = false;
            Idle.unwatch();
        };
    }
})();
