(function () {
    'use strict';
    angular
	.module('betApp')
	.controller('casinoCtrl', casinoCtrl);

    function casinoCtrl($http, $scope, $rootScope, localStorageService, $translate, $filter, $location, loginData, $timeout, $state) {
        $scope.companyName = companyname;
       
       
        $scope.allItems = [];
        $scope.viewitems = [];


        $scope.currency = '€';
        $scope.cTabId = 1;
        $scope.selectedCasino = 0;
        $scope.loginState = false;
        $scope.loggedIn = false;

        $scope.lang = localStorageService.get('language');
        if (!$scope.lang || $scope.lang == '' || $scope.lang == null)
            $scope.lang = 'en';

       
        $scope.casinos = [
			{
				name: 'ALLCASINOGAMES',
				id: 0,
				mid: 0
			},
              {
                  name: 'FEATURED',
                  id: 1,
                  mid: 1
              }
        ];

        $scope.getAuthOptions = function () {
            var token = localStorageService.get('jwt');

            var options = {
                headers: {
                    //'jauth': token,
                    'accept': 'true'
                }, withCredentials: true
            };

            if (token && token != null && token != '')
                options.headers.jauth = token;
            return options;
        }

        $scope.currentTab = LobbyUrl + '/pages/casino/allgameslist.html?2';

        $scope.$watch('currentTab', function (newValue, oldValue) {
            if (!newValue)
                $scope.currentTab = LobbyUrl + '/pages/casino/allgameslist.html?2';
        });

        
        $scope.selectCasino = function (casino) {

            if (!casino) {
                casino = {
                    name: 'ALLCASINOGAMES',
                    id: 1,
                    mid: 0
                };
            }
            $timeout(function () {
                $scope.$apply(function () { $scope.selectedCasino = casino.mid; });
            }, 300);
            $scope.selectedCasinoId = casino.id;
            $scope.currentTab = LobbyUrl + '/pages/casino/allgameslist.html?2';

            if (!$scope.allItems || $scope.allItems.length <= 0 || !$scope.allItems[0]) {
                $scope.viewitems = [];
                return;
            }
      
                switch (casino.name) {
                    case 'FEATURED':
                        $scope.viewitems = $scope.allItems.filter(function (x) { return favoritegameidsMobile.indexOf(x.gameId) > -1 });
                        break;
                    case 'ALLCASINOGAMES':
                        $scope.viewitems = $scope.allItems.filter(function (x) { return (x.prop == 'slot' || x.provider == 'gwt') });
                        break;
                    default:
                        $scope.viewitems = $scope.allItems.filter(function (x) { return (x.provider == casino.name && x.prop == 'slot') });
                        break;
                }
   
        }


        $scope.isCasinoSelected = function (id) {
            return $scope.selectedCasino == id;
        }

        $scope.showOptions = function ($index) {
            var table = angular.element('#table' + $index);
            var tableCnt = angular.element('.tableCont');

            if (table.hasClass('hidden')) {
                table.removeClass('hidden');
                table.addClass('table-animation-add');
            } else {
                table.addClass('hidden');
                table.addClass('table-animation-del');
            }
        }


        $scope.openGame = function (item,option) {

            localStorageService.set('lastPage', $scope.currentTab);

			var token = localStorageService.get('jwt');


			if (!$scope.loggedIn || !token || token == null || token == '' || (option && option.caption=="demo")) {
				
				
					var url = getgwtgameurl+'?gamename='+item.gameId+'&demo=true';
					$http.get(url, $scope.getAuthOptions())
					.success(function (data) {
						Cookies.set("noreg_session", data.sessionid, { expires : 7 });
						localStorageService.set('SID',data.SID);
						var purl = GwtWrUrl+'?GameName='+item.gameId;
						window.location = purl;
						return;
					});
					return;
			}
			
			
			var url = getgwtgameurl+'?gamename='+item.gameId+'&demo=false';
			$http.get(url, $scope.getAuthOptions())
			.success(function (data) {
				Cookies.set("noreg_session", data.sessionid, { expires : 7 });
				localStorageService.set('SID',data.SID);
				var purl = GwtWrUrl+'?GameName='+item.gameId;
				window.location = purl;
				return;
			});
			return;
            
        }



        $scope.refreshSportsbookBalance = function () {
            angular.element(".ot").addClass('spin');
            $http.get(apiURL + 'user/GetCurrentBalance', $scope.getAuthOptions())
            .success(function (data) {
                $timeout(function () {
                    $scope.$apply(function () {
                        var balance = data.saldo;
                        $scope.otherBalance = balance;
                        angular.element(".ot").removeClass('spin');
                    });
                }, 500);

            });
        }



        $scope.openSlider = function (name) {

        }


        $scope.loadGameList = function () {

            angular.forEach(gwtGameList, function (item, e) {
				item.imgsrc = gwtimgpath+item.gameId+'.jpeg';
				if($scope.loggedIn)
				{
					item.options=[];
					item.options.push({caption:'play_real'});
					item.options.push({caption:'play_demo'});
				}
				$scope.allItems.push(item);
			});
		
			$scope.selectCasino();
        }

        angular.element(document).ready(function () {

            loginData.isLoggedin().then(function (promise) {
                $scope.loggedIn = promise.success;
                if($scope.loggedIn)
                {
                    $scope.refreshSportsbookBalance();
                    setInterval(function () {
                        $scope.refreshSportsbookBalance();
                    }, 60000);
                }

                $scope.selectCasino();
                $scope.loadGameList();
            });
        });

        $scope.contentClass = 'games';
        $scope.$watch('currentTab', function (newValue, oldValue) {
            if ($scope.currentTab != LobbyUrl + '/pages/casino/allgameslist.html?2') {
                $scope.loginState = true;
                $scope.contentClass = 'info';
            }
            else {
                $scope.loginState = false;
                $scope.contentClass = 'games';
            }
        });

        $scope.goBack = function () {
            var lastPage = localStorageService.get('lastPage');
            $scope.currentTab = lastPage;
        }

        $scope.showPage = function (page) {
            localStorageService.set('lastPage', $scope.currentTab);
            $scope.currentTab = LobbyUrl + '/pages/' + page + '.html';
            window.scrollTo(0, 0);
        }

        $scope.showExternalPage = function (page) {
            localStorageService.set('lastPage', $scope.currentTab);
            page = page.replace('{{lang}}', $scope.lang);
            $scope.currentTab = page;
            window.scrollTo(0, 0);
        }

        $scope.showInfoPage = function (page) {
            localStorageService.set('lastPage', $scope.currentTab);
            page = LobbyUrl + '/pages/info/' + $scope.lang + '/' + page + '/index.html';
            $scope.currentTab = page;
            window.scrollTo(0, 0);
        }

        $scope.showLobby = function () {
            $scope.currentTab = LobbyUrl + '/pages/allgameslist.html?2';
        }

        $scope.openNetentAlert = function () {
            ngDialog.open({ template: '<h1 style="text-align:center;">You dont have NetEnt Balance for play that game</h1>', plain: true });
        }
    }
})();