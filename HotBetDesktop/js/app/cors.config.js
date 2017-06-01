(function() {
	'use strict';
	angular
		.module('betApp')
		.config(function($httpProvider){
			$httpProvider.defaults.useXDomain = true;
  			$httpProvider.defaults.withCredentials = true;
 			delete $httpProvider.defaults.headers.common['X-Requested-With'];
		});
})();