(function () {
    'use strict';
    angular
        .module('betApp', ['ui.router', 'pascalprecht.translate', 'LocalStorageModule', 'ngMaterial', 'md.data.table', 'infinite-scroll', 'angular.filter',
            'angular-carousel', 'ngDialog', 'ngRoute', 'ngIdle', 'ngLazyRender'])
        .value('signalRServer', siteURL).config(function ($sceDelegateProvider) {
            $sceDelegateProvider.resourceUrlWhitelist([
                // Allow same origin resource loads.
                'self',
                // Allow loading from our assets domain.  Notice the difference between * and **.
                infoDomain + '/**',
                LMTUrl + '**'
            ]);


        })
        .run(function ($http) {
            //$('#splash-screen').css('display', 'none');

            var localversion = localStorage.getItem("localAppVersion");
				
            var url = apiURL + "/user/GetAppVersion";
            var oldhash,
                oldsalt;
            $http
                .get(url)
                .then(function (data) {
                    if (localversion != data.data.version) {
                        try {
                            localStorage.setItem("localAppVersion", data.data.version);
							if(localversion && localversion!="")
								location.reload(true);
                        } catch (e) {
                        }
                    }
                });
        });
})();

