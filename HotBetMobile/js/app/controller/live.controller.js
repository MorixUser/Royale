(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('liveCtrl', liveCtrl);

	function liveCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams) {
	$scope.items = [];
	$scope.getSports = function(){
		var url = apiURL + "/sport/get?type=1";
		$http
			.get(url)
			.success(function(data) {
				$scope.items = data.items;
			});
	}
	$scope.getSports();
	$scope.changeCat = function (item) {
		$state.go('livebets', {catId: item.id, catName: item.name});
	}
	}
})();