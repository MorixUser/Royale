(function () {
    'use strict';
    angular
        .module('betApp')
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('index', {
                    url: "/",
                    templateUrl: "pages/index.html?2"
                })
                .state('register', {
                    url: "/register",
                    templateUrl: "pages/register.html?2",
                })
                .state('password_recovery', {
                    url: "/password_recovery",
                    templateUrl: "pages/recoverpw.html?2",
                })
                .state('password_recovery_2', {
                    url: "/password_recovery_2",
                    templateUrl: "pages/recoverpw2.html?2",
                })
                .state('infopage', {
                    url: "/infopage/:page/:name",
                    templateUrl: function ($stateParams) {
                        return "pages/infopage.html?4";
                    },
                })
                .state('support', {
                    url: '/infopage/support',
                    templateUrl: 'info/support/index.html'
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
                .state('account', {
                    url: "/account",
                    controller: 'accountCtrl',
                    templateUrl: "pages/account.html?2",
                })
                .state('history', {
                    url: "/history",
                    controller: "transactionsCtrl",
                    templateUrl: "pages/history.html?2"
                })
                .state('changepw', {
                    url: "/changepw",
                    controller: "changepwCtrl",
                    templateUrl: "pages/changepw.html?2"
                })
                .state('personallimits', {
                    url: "/personallimits",
                    templateUrl: "pages/personallimits.html?2",
                })
                .state('payinpage', {
                    url: "/payinpage/:ptype",
                    templateUrl: "pages/payinpage.html?2",
                })
                .state('payoutpage', {
                    url: "/payoutpage/:ptype",
                    templateUrl: "pages/payoutpage.html?2",
                })
                .state('userdata', {
                    url: "/accountdata",
                    controller: "accountDataCtrl",
                    templateUrl: "pages/accountdata.html?2"
                })
                .state('settings', {
                    url: "/settings",
                    controller: "homeCtrl",
                    templateUrl: "pages/settings.html?2"
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
                .state('banktransfer', {
                    url: "/banktransfer",
                    controller: "banktransferCtrl",
                    templateUrl: "pages/banktransfer.html?2"
                })
                .state('casino', {
                    url: "/casino",
                    templateUrl: "pages/casino.html?4"
                })
            .state('casinofaq', {
                url: "/casino/faq",
                controller: "casinoCtrl",
                templateUrl: "pages/casino/faq.html?2"
            })
            .state('casinorules', {
                url: "/casino/rules",
                controller: "casinoCtrl",
                templateUrl: "pages/casino/rules.html?2"
            })
			.state('hbsport', {
                url: "/sport",
                templateUrl: "pages/hbsport.html"
            })
            .state('mail', {
                url: "/mail",
                templateUrl: "pages/mail.html"
            });

            $urlRouterProvider.when('', '/');
            $urlRouterProvider.otherwise('/');
        });
})();