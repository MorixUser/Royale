(function () {
    'use strict';
    angular
	.module('betApp')
	.controller('navbarCtrl', navbarCtrl);

    function navbarCtrl($scope, $rootScope, $state, $translate, $window, $timeout, $document, localStorageService, loginData, $http, $filter,balanceChangeSvc) {
        $rootScope.isSearchBoxOpen = false;
        $scope.isLoadingTickets = false;
        $scope.startPage = startpage;
        $scope.startPageisDifferentThanLandingPage = true;
        $scope.lastRefresh = moment().add(0, 'seconds');

        $scope.reloadPage = function () {
            if($state.$current.name == 'livebets')
                $state.reload();
        }

        $scope.userstats = {
            possiblepayout: 0,
            betstoday: 0,
            currentbonus: 0
        };

        $scope.langs = [{
            id: 1,
            name: "Deutsch",
            short: "de"
        },
            {
                id: 2,
                name: "English",
                short: "en"
            },
            {
                id: 3,
                name: "Türkçe",
                short: "tr"
            },
            {
                id: 3,
                name: "Espaniol",
                short: "es"
            },
            {
                id: 4,
                name: "Français",
                short: "fr"
            }];
        $scope.focusSearch = function () {
            if (!$('#appContainer').hasClass('menu-search'))
                $('#appContainer').addClass('menu-search');
        };
        $scope.endSearch = function () {
            $('#appContainer').removeClass('menu-search');
        };

        $scope.doSearch = function () {
            $(window).scrollTop(0);
            $('#appContainer').addClass('menu-search');
            $timeout(function () {
                $('.sinput').focus();
            }, 10);

        };

        $scope.getGames = function (string) {
            $scope.items = [];
            var url = apiURL + "/bet/get?pagesize=50&name=" + string;
            var lang = $rootScope.currentLang;
            $http
                .get(url)
                .success(function (data) {
                    angular.forEach(data.items, function (i, v) {
                        $scope.addNew(i);
                        var gametips = data.tips.filter(function (x) { return x.gid == i.gid });
                        angular.forEach(gametips, function (tip, value) {
                            if ($rootScope.userSettings && ($rootScope.userSettings.OddsFactor || $rootScope.userSettings.OddsFactorLive))
                                tip.od += tip.li ? $rootScope.userSettings.OddsFactorLive : $rootScope.userSettings.OddsFactor;
                            $scope.setMainOdds(tip, i, true);
                        });
                    });
                    $scope.gamesInitialized = true;
                    var betSlip = betSlipSrvc.init();
                    betSlip.then(function (data) {
                        angular.forEach(data.data.InputList, function (i, v) {
                            angular.forEach(i.FTips, function (i, v) {
                                $scope.selectedTips.push(i.TipID);
                            });
                        });
                    });
                });
        };
        function querySearch(query) {
            var results = query ? self.repos.filter(createFilterFor(query)) : self.repos,
                deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        $scope.onSelectLang = function (item) {
            $scope.selectedLang = item.name;
            $rootScope.currentLang = item.short;
            $translate.use(item.short);
            try {
                localStorageService.set('selectedLang', item.short);
            } catch (e) {

            }

            var url = apiURL + "/user/getsetculture?lang=" + item.short;
            $http
                .get(url, loginData.getAuthOptions())
                .success(function (data) {
                    console.log("language set");
                    location.reload();
                });

        };
        $scope.closeSearch = function () {
            if ($scope.searchtxt && $scope.searchtxt.length > 0) {
                $rootScope.searchMode = false;
            }
            $scope.searchtxt = "";
        };

        $scope.changeSearch = function (searchtxt) {
            if (searchtxt && searchtxt.length > 0 && $rootScope.stateName != 'search') {
                $rootScope.searchMode = true;
            }
            if ((!searchtxt || searchtxt.length == 0) && $rootScope.stateName == 'search') {
                $rootScope.searchMode = false;
                return;
            }

            $rootScope.$broadcast('SEARCH_EVENT', { text: searchtxt });
        };

        $scope.navto = function (page) {
            $rootScope.searchMode = false;
            $state.go(page);
        };

        $scope.gotoCasino = function () {
            $window.location = casinolink;
        };

        $scope.isLoggedin = false;
        $rootScope.isLoggedin = $scope.isLoggedin;
        $scope.userBalance = 0;
        $rootScope.currentUser = $rootScope.currentUser ? $rootScope.currentUser : localStorageService.get('currentUser');
        $rootScope.userSettings = $rootScope.userSettings ? $rootScope.userSettings : localStorageService.get('userSettings');
        $scope.userSettings = $rootScope.userSettings;

        $scope.getUserBalance = function (setlang) {
            var url = apiURL + "/user/GetCurrentBalance";

            $http
			.get(url, loginData.getAuthOptions())
			.success(function (data) {
			    $scope.userBalance = data.saldo;
			    if (setlang) {
			        var url2 = apiURL + "/user/getsetculture?lang=" + $rootScope.currentLang;
			        $http
                        .get(url2, loginData.getAuthOptions())
                        .success(function (data2) {
                            console.log("language set");
                        });
			    }

			});
        };

        $scope.getUserStats = function () {
            var url = apiURL + "/user/GetUserStats";

            $http
			.get(url, loginData.getAuthOptions())
			.success(function (data) {
			    $scope.userstats.betstoday = data.cnt;
			    $scope.userstats.possiblepayout = data.allowedpayout;
			    $scope.userstats.currentbonus = data.bonus;
			    $scope.userBalance = data.balance;
			});
        };

		var deregBalanceEvent = $rootScope.$on('BALANCE_EVENT', function (event, args) {
			console.log('balanceevent received');
			if($rootScope.isLoggedin)
				$scope.userBalance = args.data.balance;
        });
		
        var deregLoginEvent = $rootScope.$on('LOGIN_EVENT', function (event, args) {
            $scope.isLoggedin = args.isLoggedin;
            $rootScope.isLoggedin = $scope.isLoggedin;
            if (args.isLoggedin) {
                $scope.getUserBalance(true);
            } 
        });
        var deregLogoutEvent = $rootScope.$on('LOGOUT_EVENT', function (event, args) { 
            $scope.isLoggedin = args.isLoggedin;
            $rootScope.isLoggedin = $scope.isLoggedin;
            $scope.userBalance = 0;
            $state.go($scope.startPage);
        });
        var deregTPEvent = $rootScope.$on('TICKET_PLACED_EVENT', function (event, args) {
            $scope.getUserBalance();
            $scope.loadUserTickets();
        });
        var deregCloseSearchBoxEvent = $rootScope.$on('CLOSE_SEARCHBOX_EVENT', function (event, args) {
            $scope.closeSearchBox();
        });

        $scope.openSearchBox = function () {
            if ($rootScope.isSearchBoxOpen) return;
            console.log("opening search box");
            $rootScope.searchBoxPosition = {
                left: $('#searchImage').position().left - 150,//searchInput.width=300
                top: $('#appPageHeader').height() + 10
            };
            $rootScope.isSearchBoxOpen = true;
        };

        $scope.closeSearchBox = function () {
            if (!$rootScope.isSearchBoxOpen) return;
            console.log("closing search box");
            $rootScope.isSearchBoxOpen = false;
        };


        $scope.$on('$destroy', function () {
			deregBalanceEvent();
            deregLoginEvent();
            deregLogoutEvent();
            deregTPEvent();
            deregCloseSearchBoxEvent();
        });

        $scope.checkLoginInterval = function () {

            setTimeout(function () {
                loginData.isLoggedin().then(function (promise) { $scope.checkLoginInterval(); });
            }, 60000);
        };
		
		
		

        angular.element(document).ready(function () {
            var currentlang = localStorageService.get('selectedLang');

            if (currentlang) {
                $rootScope.currentLang = currentlang;
                $translate.use(currentlang);
            }
            else {
                $rootScope.currentLang = defaultLang;
                $translate.use(defaultLang);
                try {
                    localStorageService.set('selectedLang', defaultLang);
                }
                catch (e) {

                }

            }

            var url = apiURL + "/user/getsetculture?lang=" + $rootScope.currentLang;
            $http
                .get(url, loginData.getAuthOptions())
                .success(function (data) {
                    console.log("language set");
                });

            var currentzone = localStorageService.get('selectedZone');
            if (currentzone) {
                $rootScope.currentZone = currentzone;
                moment.tz.setDefault(currentzone);
            }
            else {
                $rootScope.currentZone = defaultZone;
                moment.tz.setDefault(currentzone);
                try {
                    localStorageService.set('selectedZone', defaultZone);
                }
                catch (e) {

                }

            }

            
			balanceChangeSvc.init();
            $scope.casinoallowed = true;
            loginData.isLoggedin().then(function (promise) {
                $scope.checkLoginInterval();
                $("input[name=loginUsername]").focus();
                
            });


            $scope.selectedLang = $rootScope.currentLang ? $scope.langs.filter(function (x) { return x.short == $rootScope.currentLang; })[0].name : $scope.langs.filter(function (x) { return x.short == defaultLang; })[0].short;
            $translate.use($rootScope.currentLang);


        });
       

    }
})();