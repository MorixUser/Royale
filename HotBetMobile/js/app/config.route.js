(function() {
	'use strict';
	angular
		.module('betApp')
		.config(function($stateProvider, $urlRouterProvider){
			$stateProvider
			.state('index', {
				url:"/",
				templateUrl: "pages/index.html?2"
			})
			.state('homepage', {
				url:"/home",
				templateUrl: "pages/homepage.html?2",
			})
              .state('landingpage', {
                url: "/start",
               templateUrl: "pages/landingpage.html?2",
             })
			.state('register', {
				url:"/register",
				templateUrl: "pages/register.html?2",
				
			})
            .state('password_recovery', {
                url: "/password_recovery",
                templateUrl: "pages/recoverpw.html?2",

            })
			
            .state('infopage', {
                url: "/infopage/:page/:name",
                templateUrl: function ($stateParams) {
                    return "pages/infopage.html?2";
                },
            })
            .state('bonus', {
                url: "/bonus/:page/:name",
                templateUrl: function ($stateParams) {
                    return "pages/bonus.html?2";
                },
            })
			.state('login', {
				url: "/login",
				templateUrl: "pages/login.html?2",
			})
			.state('hbsport', {
				url: "/sport",
				templateUrl: "pages/hbsport.html?2",
			})
			.state('hbbetslip', {
				url: "/hbbetslip",
				templateUrl: "pages/hbbetslip.html?2",
			})
			.state('account', {
				url:"/account",
				controller:'accountCtrl',
				templateUrl: "pages/account.html?2",
			})
			.state('history', {
				url:"/history",
				controller: "transactionsCtrl",
				templateUrl: "pages/history.html?2"
			})
			.state('changepw', {
				url:"/changepw",
				controller: "changepwCtrl",
				templateUrl: "pages/changepw.html?2"
			})
            .state('personallimits', {
                url: "/personallimits",
                templateUrl: "pages/personallimits.html?2",
            })
            .state('payinpage', {
                url: "/payinpage",
                templateUrl: "pages/payinpage.html?2",
            })
            .state('payoutpage', {
                url: "/payoutpage",
                templateUrl: "pages/payoutpage.html?2",
            })
			.state('userdata', {
				url:"/accountdata",
				controller: "accountDataCtrl",
				templateUrl: "pages/accountdata.html?2"
			})
			.state('settings', {
				url:"/settings",
				controller:"homeCtrl",
				templateUrl: "pages/settings.html?2"
			})
			.state('search', {
				url:"/search",
				controller:"searchCtrl",
				templateUrl: "pages/search.html?2"
			})
            .state('cepbankpayin', {
                url: "/cepbankpayin",
                controller: "cepbankpayinCtrl",
                templateUrl: "pages/cepbankpayin.html?2"
            })
            .state('cepbankpayout', {
                url: "/cepbankpayout",
                controller: "cepbankpayoutCtrl",
                templateUrl: "pages/cepbankpayout.html?2"
            })
			.state('casino', {
                url: "/casino",
                templateUrl: "pages/casino.html?2"
            })
		    ;

			$urlRouterProvider.when('', '/');
			$urlRouterProvider.otherwise('/home');
		});
})();