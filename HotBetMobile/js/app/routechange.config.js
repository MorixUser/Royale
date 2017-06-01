  (function() {
	'use strict';
	angular
		.module('betApp')
		.run(function($rootScope, $state, $stateParams, $location, localStorageService){
      $rootScope.prevState = '';
      $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
          $rootScope.searchMode = false;
          $rootScope.showTournamentNav = false;
          
          var stateName = $state.$current.name;
          $rootScope.stateName = $state.$current.name;
          $rootScope.prevState = !$rootScope.prevState ? 'homepage' : from.name;
          $('#appContainer').removeClass('menu-search');
          if (stateName != 'search') {
              $rootScope.showSearchInput = false;
          }
            
          if ($rootScope.stateName == 'login')
            $rootScope.inLogin = true;
          else
              $rootScope.inLogin = false;

          $(window).scrollTop(0);
          setTimeout(function () { $(window).scrollTop(1); }, 0);
         });

    });
})();