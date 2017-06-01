(function () {
    'use strict';
    angular
	.module('betApp')
	.controller('indexCtrl', indexCtrl);

    function indexCtrl($rootScope, $state, loginData, $http, msgDialogSrvc) {
        $rootScope.inIndex = true;
        var token = getParameterByName('token');
        var code = getParameterByName('code');
        var username = getParameterByName('username');

        var rmode = getParameterByName('reqmode');
        if (rmode && rmode == "accountactivation") {
            var activationcode = getParameterByName('activationcode');
            var userid = getParameterByName('userid');
            var newURL = apiURL + "/user/GetActivateAccount?userid=" + userid + "&activationcode=" + activationcode + "&username=" + username;
            $http
				.get(newURL)
				.then(function (datares) {
				    
				    if (datares && datares.data.success) {
				        if (datares.data.IsIA) {
				            var iapath = iapixelpath.replace('{0}', userid);
				            var iaframe = '<iframe style="display:none" src="' + iapath + '"></iframe>';
				            $(iaframe).appendTo('body');

				        }
				        msgDialogSrvc.showDialog('#loginForm', 'success', 'activation_succeded');
				    }
				    else {
				        if (datares && datares.data.msg)
				            msgDialogSrvc.showDialog('#loginForm', 'error', datares.data.msg);
				        else
				            msgDialogSrvc.showDialog('#loginForm', 'error', 'activation_failed');
				    }

				});
        }

        if (token && code && username && token.length > 0 && code.length > 0 && username.length > 0) {
            loginData.autologin(username, token, code).then(function (promise) {
                //if (promise.payload.success == true) {
                //    location.reload();
                //}
                //$rootScope.inIndex = false;
                //$state.$current.name = startpage;
                //$state.go(startpage);
                window.location = infoDomain;
            });
        }
        else {
            $rootScope.inIndex = false;
            $state.$current.name = startpage;
            $state.go(startpage);
        }
    }
})();