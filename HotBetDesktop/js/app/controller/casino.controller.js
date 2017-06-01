(function () {
    'use strict';
    angular
	.module('betApp')
	.controller('casinoCtrl', casinoCtrl);

    function casinoCtrl($http, $scope, $rootScope, localStorageService, $translate, $filter, $location, loginData, $timeout, $state, msgDialogSrvc) {
        $scope.companyName = companyname;
       
        var hayFlash = function (a, b) { try { a = new ActiveXObject(a + b + '.' + a + b) } catch (e) { a = navigator.plugins[a + ' ' + b] } return !!a }('Shockwave', 'Flash');
        $scope.allItems = [];
        $scope.viewitems = [];
        $scope.jackpotItems = [];
        $scope.dealers = [];
        $scope.bjdealers = [];

        $scope.categories = [
		
		{
		    name: 'new_and_popular',
		    id: 4,
            type:'Fav'
		},
        {
            name: 'classic_slots',
            id: 5,
            type: 'Slot'
        },
        {
            name: 'video_slots',
            id: 6,
            type: 'VideoSlot'
        },
		{
		    name: 'video_poker',
		    id: 9,
            type: 'Poker'
		},
		{
		    name: 'TABLES',
		    id: 13,
            type:'Table'
		},
		{
		    name: 'CASUALGAMES',
		    id: 16,
            type:'Casual Games'
		}
		];

        $scope.viewcategories = $scope.categories.filter(function (x) { return x.id == x.id });

        $scope.currency = '€';
        $scope.cTabId = 1;
        $scope.selectedCasino = 0;
        $scope.loggedIn = false;

        $scope.lang = $rootScope.currentLang;
        if (!$scope.lang || $scope.lang == '' || $scope.lang == null)
            $scope.lang = 'en';

       
        

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

        $scope.currentTab = 'pages/casino/allgameslist.html';

        $scope.$watch('currentTab', function (newValue, oldValue) {
            if (!newValue)
                $scope.currentTab = 'pages/casino/allgameslist.html';
        });

        

        $scope.GetSupportedGames = function (data, name) {

            var result = []

            for (var x in data) {

                var i = data[x];

                

                i.prop = name;
                i.showGame = true;

                i.options = [];
                i.provider = i.provider ? i.provider : 'portomaso';

                
                if (!$scope.getGameViewProperties(i))
                    continue;


                angular.forEach(i.tables, function (table, e) {

                    i.familyId = table.familyGameId;
                        i.gameId = table.gameId;
                        i.uiId = table.tableId;
                        i.sid = table.tableId;
                        i.showGame = true;
                        i.width = table.width;
                        i.height = table.height;
                        i.playSessionType = table.playSessionType;

                        var limit = table.limits.EUR;
                        if (limit.playerMaxValue)
                            var optioncaption = limit.playerMinValue + " - " + limit.playerMaxValue + limit.currency;
                        else if (limit.maxValue)
                            var optioncaption = limit.minValue + " - " + limit.maxValue + limit.currency;
                        else if (!limit.playerMaxValue && !limit.maxValue)
                            var optioncaption = 'PLAY NOW';
                        var option = { caption: optioncaption, familyGameId: table.familyGameId };
                        i.options.push(option);

            
                        result.push(i);
                    
                            

                });

                angular.forEach(i.ui, function (ui, e) {

                    if (!hayFlash) {
                        if (ui.uiMode == "html") {
                            i.loaderUrl = ui.loaderJS && ui.loaderJS != "" ? ui.loaderJS : ui.loaderHtml && ui.loaderHtml != "" ? ui.loaderHtml : '';

                            if (i.loaderUrl != "") {

                                i.uiId = ui.id;
                                i.width = ui.width;
                                i.height = ui.height;
                                i.familyId = ui.familyGameId;
                                i.showGame = true;
                                i.gameid = i.gameId;
                                i.sid = ui.id;
                                result.push(i);
                            }
                        }
                    }
                    else {
                        if (ui.uiMode == "flash") {
                            i.loaderUrl = ui.loaderJS && ui.loaderJS != "" ? ui.loaderJS : ui.loaderHtml && ui.loaderHtml != "" ? ui.loaderHtml : '';

                            if (i.loaderUrl != "") {
                                i.uiId = ui.id;
                                i.width = ui.width;
                                i.height = ui.height;
                                i.familyId = ui.familyGameId;
                                i.showGame = true;
                                i.gameid = i.gameId;
                                i.sid = ui.id;
                                i.uiDevice = ui.uiDevice;
                                result.push(i);
                            }
                        }
                    }

                });

                angular.forEach(i.variants, function (variant, e) {
                    angular.forEach(variant.ui, function (ui, e) {

                        if (!hayFlash) {
                            if (ui.uiMode == "html") {
                                i.loaderUrl = ui.loaderJS && ui.loaderJS != "" ? ui.loaderJS : ui.loaderHtml && ui.loaderHtml != "" ? ui.loaderHtml : '';

                                if (i.loaderUrl != "") {

                                    i.uiId = ui.id;
                                    i.width = ui.width;
                                    i.height = ui.height;
                                    i.familyId = variant.familyGameId;
                                    i.showGame = true;
                                    i.gameid = i.gameId;
                                    i.sid = ui.id;
                                    result.push(i);
                                }
                            }
                        }
                        else {
                            if (ui.uiMode == "flash") {
                                i.loaderUrl = ui.loaderJS && ui.loaderJS != "" ? ui.loaderJS : ui.loaderHtml && ui.loaderHtml != "" ? ui.loaderHtml : '';

                                if (i.loaderUrl != "") {
                                    i.uiId = ui.id;
                                    i.width = ui.width;
                                    i.height = ui.height;
                                    i.familyId = variant.familyGameId;
                                    i.showGame = true;
                                    i.gameid = i.gameId;
                                    i.sid = ui.id;
                                    i.uiDevice = ui.uiDevice;
                                    result.push(i);
                                }
                            }
                        }

                    });

                    angular.forEach(variant.jackpots, function (j, p) {
                        if (!$scope.jackpotItems.filter(function (x) { return x.id == j.id })[0])
                            $scope.jackpotItems.push(j);
                    });

                });
            }

            return result;
        }

        $scope.getGameViewProperties = function (item) {
            
            item.imgsrc = portalurl2 + item.thumb;
            
            item.viewtitle = item.title ? item.title : item.deviceName;
            if (!item.viewtitle)
                return false;
            return true;
        }




        $scope.currentCat = 0;

        $scope.selectCasino = function (casino) {
            $scope.showLobby();
            $scope.currentCat = 0;
            if (!casino) {
                casino = {
                    name: 'FEATURED',
                    id: 1,
                    mid: 0
                };
            }
            $timeout(function () {
                $scope.$apply(function () { $scope.selectedCasino = casino.mid; });
            }, 300);
            $scope.selectedCasinoId = casino.id;
            
			$scope.currentTab = 'pages/casino/allgameslist.html';

            if (!$scope.allItems || $scope.allItems.length <= 0 || !$scope.allItems[0]) {
                $scope.viewitems = [];
                return;
            }
      
            switch (casino.name) {
                case 'FEATURED':
                    $scope.viewitems = $scope.allItems.filter(function (x) { return favoritegameids.indexOf(x.gameId) > -1 });
                    break;
				case 'gwt':
                    $scope.viewitems = $scope.allItems.filter(function (x) { return (x.provider == 'gwt') });
                    break;
                default:
                    $scope.viewitems = $scope.allItems.filter(function (x) { return (x.provider == casino.name && x.prop == 'slot') });
                    break;
            }  
        }


        $scope.setViewItems = function () {
            $scope.viewitems = $scope.allItems.filter(function (x) { return 1==1 });
        }


        $scope.onClickCat = function (cat) {
            $scope.showLobby();
            
            $scope.currentCat = cat.id;
            $scope.searchCasino = "";
            if (cat.type == "Fav")
                $scope.viewitems = $scope.allItems.filter(function (x) { return favoritegameids.indexOf(x.gameId) > -1 });
            else
                $scope.viewitems = $scope.allItems.filter(function (x) { return (x.type == cat.type) });

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
							$scope.PopupCenter(purl,'fullscreen');
							return;
						});
						return;
					
					
                    var url = mgdemourl.replace("GameName", item.gameId).replace("langcode", $scope.lang);
                    $scope.PopupCenter(url);
                    //window.location = url;
                    return;
                }
				
				
				var url = getgwtgameurl+'?gamename='+item.gameId+'&demo=false';
				$http.get(url, $scope.getAuthOptions())
				.success(function (data) {
					Cookies.set("noreg_session", data.sessionid, { expires : 7 });
					localStorageService.set('SID',data.SID);
					var purl = GwtWrUrl+'?GameName='+item.gameId;
					$scope.PopupCenter(purl,'fullscreen');
					return;
				});
				return;
				  
				

                

            
        }

        
        $scope.PopupCenter = function (url, title, w, h, full) {
            full = true;
            var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;
            var newWindow = '';
            if (full) {
                w = screen.width;
                h = screen.height - 100;
                newWindow = window.open(url, '', 'type=fullWindow,fullscreen,scrollbars=no,location=no, titlebar=no,menubar=no,width=' + w + ', height=' + h + ',top=0, left=0');
            }
            else {

                newWindow = window.open(url, '', 'scrollbars=no,location=no, titlebar=no,menubar=no,width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

            }
            if (newWindow == undefined)
                msgDialogSrvc.showDialog('#wrap', 'error', 'disable_popop_blocker'); 

        }



        

        
       

        angular.forEach($scope.GetSupportedGames(favoritelist, 'favorites'), function (item, e) {
            $scope.allItems.push(item);
        });

        $scope.loadGameList = function () {

            
			    angular.forEach(gwtGameList, function (item, e) {
                    item.imgsrc = gwtimgpath+item.gameId+'.jpeg';
					if($scope.loggedIn)
					{
						item.options=[];
						item.options.push({caption:'play_real'});
						item.options.push({caption:'play_demo'});
					}
					item.viewtitle = item.title;
					$scope.allItems.push(item);
                });
            
                $scope.selectCasino();
        }


        $scope.initSlyCasino = function () {
            var $frame = $('.frameCasino');
            var $slidee = $frame.children('ul').eq(0);

            var $wrap = $frame.parent();

            // Call Sly on frame
            var options = {
                horizontal: 1,
                itemNav: 'forceCentered',
                smart: 1,
                activateMiddle: 1,
                activateOn: 'click',
                mouseDragging: 1,
                touchDragging: 1,
                releaseSwing: 1,
                startAt: 0,
                scrollBar: $wrap.find('.scrollbar'),
                scrollBy: 1,
                speed: 300,
                elasticBounds: 1,
                easing: 'easeOutExpo',
                dragHandle: 1,
                dynamicHandle: 1,
                clickBar: 1,
                cycleBy: 'items',
                cycleInterval: 5000,
                pauseOnHover: 1,
            };
            $scope.slyCasino = new Sly($frame, options, {

            }).init();

        }
        
        angular.element(document).ready(function () {
            setTimeout(function () {
                $(".frameCasino .slideeCasino li").css('width', window.innerWidth);
                $scope.initSlyCasino();
            }, 100);
            

            loginData.isLoggedin().then(function (promise) {
                $scope.loggedIn = promise.success;

                $scope.selectCasino();
                $scope.loadGameList();
            });
        });



        //var deregloginevent = $rootScope.$on('LOGIN_EVENT', function (event, args) {
        //    if (!$scope.loggedIn)
        //        location.reload();
        //});

        //var dereglogoutevent = $rootScope.$on('LOGOUT_EVENT', function (event, args) {
        //    if ($scope.loggedIn)
        //        location.reload();
        //});


        $scope.doResize = function () {
            if ($scope.slyImage) {
                $(".frameImage .slideeImage li").css('width', window.innerWidth);
                $scope.slyImage.reload();
            }
        }
        window.addEventListener('resize', $scope.doResize);
        $scope.$on('$destroy', function () {
            //deregloginevent();
            //dereglogoutevent();

            window.removeEventListener('resize', $scope.doResize);
            if ($scope.slyCasino)
                $scope.slyCasino.destroy();
        });

        $scope.contentClass = 'games';
        $scope.$watch('currentTab', function (newValue, oldValue) {
            if ($scope.currentTab != 'pages/casino/allgameslist.html') {
                $scope.contentClass = 'info';
            }
            else {
                $scope.contentClass = 'games';
            }
        });

        $scope.goBack = function () {
            var lastPage = localStorageService.get('lastPage');
            $scope.currentTab = lastPage;
        }

       

        $scope.showLobby = function () {
            $scope.currentTab = 'pages/casino/allgameslist.html';
            
        }


        $scope.filterCasinoGames = function(x)
		{
			if(x.deviceSubType == 'Virtual' && x.viewtitle && x.viewtitle.length>0)
				return true;
			return false;
		};

        $scope.filterLive = function (x) {
            if ((x.deviceSubType == 'Live' || x.gameFamily == 'Blackjack Studio' || x.deviceId == 'malta04' || x.deviceId == 'amatic01'))
                return true;
            return false;
        };

        $scope.filterFeatured = function (x) {
            if (favoritegameids.indexOf(x.gameId) > -1)
                return true;
            return false;
        };

        $scope.filterSlot = function(x)
		{
			if((x.prop == 'slot' || x.gameFamily == 'Slot') && x.showGame == true && x.viewtitle && x.viewtitle.length>0 || x.type == 'Slot' || x.type=='Video Slot') {
				return true;
			}
			return false;
		};

		$scope.filterPoker = function(x)
		{
			if(x.prop == 'pokerGames' || x.type.indexOf('Poker')>-1)
				return true;
			return false;
		};

		$scope.filterTables = function(x)
		{
			if(x.type.indexOf('Table')>-1)
				return true;
			return false;
		};
		$scope.filterOther = function(x)
		{
			if(x.type=='Scratch Card' || x.type=='Casual Game' || x.type=='Parlor')
				return true;
			return false;
		};

        $scope.filterPoker = function (x) {
            if (x.prop == 'pokerGames')
                return true;
            return false;
        };


        $scope.findJackpots = function (jackpot) {
            $scope.viewitems = [];
            angular.forEach($scope.allItems, function (item, value) {
                if (item.variants) {
                    angular.forEach(item.variants, function (v, j) {
                        if (v.jackpots) {
                            angular.forEach(v.jackpots, function (l, p) {
                                if (jackpot.name == l.name && !$scope.viewitems.filter(function (x) { return x.gameId == item.gameId })[0])
                                    $scope.viewitems.push(item);
                            });
                        }
                    });
                }
            });
            
        }

        $scope.changePage = function (name) {
            $scope.currentTab = 'pages/casino/' + name + '.html';

        }


        $scope.showMoreGames = function () {
            if (angular.element('.casino-mgames-cont').hasClass('ha')) {
                angular.element('.casino-mgames-cont').removeClass('ha');
                angular.element('.casino-mgames').removeClass('ha');
                angular.element('.btn-more-footer').removeClass('b10');
            } else {
                angular.element('.casino-mgames-cont').addClass('ha');
                angular.element('.btn-more-footer').addClass('b10');
                angular.element('.casino-mgames').addClass('ha');
            }
        }

        
    }
})();