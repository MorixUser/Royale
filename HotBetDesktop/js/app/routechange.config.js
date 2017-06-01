(function () {
    'use strict';
    angular
		.module('betApp')
		.run(function ($rootScope, $state, $stateParams, $location, $route, $window, localStorageService) {
		    $rootScope.prevState = '';
		    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
		        $rootScope.searchMode = false;
		        $rootScope.needRefreshPage = localStorageService.get('needRefreshPage') ? localStorageService.get('needRefreshPage') : false;
		        var stateName = $state.$current.name;
		        console.log("state change success : " + stateName);
		        $rootScope.stateName = $state.$current.name;
		        $rootScope.prevState = !$rootScope.prevState ? startpage : from.name;
		        console.log("prevState:" + $rootScope.prevState);
		        $('#appContainer').removeClass('menu-search');
		        if (stateName != 'search') {
		            $rootScope.showSearchInput = false;
		        }

		        if ($rootScope.stateName == 'login')
		            $rootScope.inLogin = true;
		        else
		            $rootScope.inLogin = false;
		        if ($rootScope.prevState == 'support') {
		            if ($rootScope.stateName != 'support') {
		                if ($rootScope.needRefreshPage) {
		                    $rootScope.needRefreshPage = false;
		                    localStorageService.set('needRefreshPage', $rootScope.needRefreshPage);
		                } else {
		                    $rootScope.needRefreshPage = true;
		                    localStorageService.set('needRefreshPage', $rootScope.needRefreshPage);
		                    $window.location.reload();
		                }
		            }
		        } else if ($rootScope.stateName == 'support') {
		            if ($rootScope.needRefreshPage) {
		                $rootScope.needRefreshPage = false;
		                localStorageService.set('needRefreshPage', $rootScope.needRefreshPage);
		            } else {
		                $rootScope.needRefreshPage = true;
		                localStorageService.set('needRefreshPage', $rootScope.needRefreshPage);
		                $window.location.reload();
		            }
		        } 
		        $(window).scrollTop(0);
		        setTimeout(function () { $(window).scrollTop(1); }, 0);
		    });

		});
})();