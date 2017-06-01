(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('navbarCtrl', navbarCtrl);

	function navbarCtrl($scope, $rootScope, $state, $translate, $window,$timeout, $document) {
    
	    $scope.focusSearch = function () {
	        if (!$('#appContainer').hasClass('menu-search'))
	            $('#appContainer').addClass('menu-search');
	    }
	    $scope.endSearch = function () {
	        $('#appContainer').removeClass('menu-search');
	    }

	    $scope.doSearch = function () {
	        $(window).scrollTop(0);
	        $('#appContainer').addClass('menu-search');
		    $timeout(function () {
		        $('.sinput').focus();
		    },10);
		    
		}

		$scope.closeSearch = function () {
		    if ($scope.searchtxt && $scope.searchtxt.length > 0) {
		        $rootScope.searchMode = false;
		    }
		    $scope.searchtxt = "";
		}

		$scope.changeSearch = function (searchtxt) {
		    if (searchtxt && searchtxt.length > 0 && $rootScope.stateName != 'search') {
		        $rootScope.searchMode = true;
		    }
		    if ((!searchtxt || searchtxt.length == 0) && $rootScope.stateName == 'search') {
		        $rootScope.searchMode = false;
		        return;
		    }

		    $rootScope.$broadcast('SEARCH_EVENT', { text: searchtxt });
		}

	}
})();