(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('navbarInnerCtrl', navbarInnerCtrl);

	function navbarInnerCtrl($scope, $rootScope, $state, $translate, $window, $timeout, $stateParams) {
    
		$scope.goPrevState = function() {
			$window.history.back();
		}
		$scope.closeSearch = function () {
		    $rootScope.searchMode=false;
		}

		$scope.nextTournament = function () {

		    var ct = $rootScope.currentTournaments.filter(function (x) { return x.id == $stateParams.tourId })[0];
		    if (!ct)
		        return;
		    var tidx = $rootScope.currentTournaments.indexOf(ct)+1;
		    if (!$rootScope.currentTournaments[tidx])
		        tidx = 0;
		    ct = $rootScope.currentTournaments[tidx];

		    $state.go('games', { sportId: $stateParams.sportId, catId: $stateParams.catId, tourId: ct.id, name: ct.name });
		}
		$scope.prevTournament = function () {

		    var ct = $rootScope.currentTournaments.filter(function (x) { return x.id == $stateParams.tourId })[0];
		    if (!ct)
		        return;
		    var tidx = $rootScope.currentTournaments.indexOf(ct)-1;
		    if (!$rootScope.currentTournaments[tidx])
		        tidx = $rootScope.currentTournaments.length - 1;
		    ct = $rootScope.currentTournaments[tidx];

		    $state.go('games', { sportId: $stateParams.sportId, catId: $stateParams.catId, tourId: ct.id, name: ct.name });
		}
	}
})();