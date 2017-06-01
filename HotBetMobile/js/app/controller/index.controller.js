(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('indexCtrl', indexCtrl);

	function indexCtrl($rootScope, $state,loginData) {
    $rootScope.inIndex = true;
    var token = getParameterByName('token');
    var code = getParameterByName('code');
    var username = getParameterByName('username');
    if (token && code && username && token.length > 0 && code.length > 0 && username.length > 0) {
        loginData.autologin(username, token, code).then(function (promise) {
            //if (promise.payload.success == true) {
            //    location.reload();
            //}
            //$rootScope.inIndex = false;
            //$state.$current.name = startpage;
            //$state.go(startpage);
            //doAddToHomeScreen();
            window.location = infoDomain;
        });
    }
    else {

        setTimeout(function () {
            $rootScope.inIndex = false;
            $state.$current.name = startpage;
            $state.go(startpage);
            doAddToHomeScreen();
        }, 2000);
    }
  }
})();