(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('liveGamesCtrl', liveGamesCtrl);

	function liveGamesCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, $filter, loginData, betSlipSrvc, $timeout, msgDialogSrvc, $q, $window) {
	    $scope.gamesInitialized = false;
	    $scope.items = [];
		$scope.pageNumber = 1;
		$scope.pageSize = 20;
		$scope.totalPages = 0;
		$scope.selectedTips = [];
		$scope.thisposition = 0;
		
		$scope.showBetTypes = false;
		$scope.multibetSelection = multibetSelection;
		$scope.netsports = netsports;
		$scope.othersports = othersports;
		$scope.liveSportSliderMode = liveSportSliderMode;
		$scope.usemorebets = usemorebets;
		$scope.usefavorites = usefavorites;

		$scope.currentBetTypes = $rootScope.currentBetTypes ? $rootScope.currentBetTypes : bettypesettings;

		$scope.toggleBetTypes = function () {
		    $scope.showBetTypes = !$scope.showBetTypes;
		}
		$scope.selectBetType = function (type) {
		    $scope.showBetTypes = false;
		   
		    if ($scope.multibetSelection) {
		        $scope.currentBetTypes.filter(function (x) { return x.name == type.name })[0].selected = !$scope.currentBetTypes.filter(function (x) { return x.name == type.name })[0].selected;
		    }
		    else{
		        angular.forEach($scope.currentBetTypes, function (item, v) {
		            item.selected = false;
		        });
		        $scope.currentBetTypes.filter(function (x) { return x.name == type.name })[0].selected = true;
		    }

		    
		    $rootScope.currentBetTypes = $scope.currentBetTypes;
		}

		$scope.getmainbettypes = function () {
		    if ($scope.netsports.indexOf($scope.sportId) > -1)
		        return $scope.currentBetTypes.filter(function (x) { return x.main && x.netsport});
		    if ($scope.othersports.indexOf($scope.sportId) > -1)
		        return $scope.currentBetTypes.filter(function (x) { return x.main && x.othersport });

		    return $scope.currentBetTypes.filter(function (x) { return x.main && !x.onlynetsport && !x.onlyothersport });
		}
		$scope.getmorebettypes = function () {
		    return $scope.currentBetTypes.filter(function (x) { return $scope.netsports.indexOf($scope.sportId) <= -1 && $scope.othersports.indexOf($scope.sportId) <= -1 && (!x.main || ($scope.sportId <= 0 && (x.netsport || x.othersport))) });
		}
		$scope.getselectedbettypes = function () {
		    return $scope.currentBetTypes.filter(function (x) { return x.selected==true });
		}

		$scope.tipclass = function (item, bet) {
		    if (bet.bt == 2)
		        return 'overunder';
		    if (bet.bt == 8 && ($scope.netsports.indexOf(item.sid) > -1 || othersports.indexOf(item.sid) > -1))
		        return 'twoway';
		    if (bet.bt == 3 && bet.netsport)
		        return 'twoway';

		    return 'threeway';
		}

		$scope.tipsforbet = function (item, bet) {
		    return item.tips.filter(function (x) {
		        return x.bt == bet.bt && x.gt == bet.gt &&
                    (
                    (bet.onlynetsport && $scope.netsports.indexOf(item.sid) > -1) ||
                    (bet.onlyothersport && $scope.othersports.indexOf(item.sid) > -1) ||
                    (bet.onlyballsport && $scope.othersports.indexOf(item.sid) <= -1 && $scope.netsports.indexOf(item.sid) <= -1) ||
                    (!bet.onlyothersport && !bet.onlynetsport && !bet.onlyballsport) 
                    )
		    });
        }

		$scope.favgames = $rootScope.favGames && $rootScope.favGames.length>0 ? $rootScope.favGames : [];
		$scope.favClick = function (item) {
		    if (!$scope.usefavorites)
		        return;

		    if ($scope.favgames.filter(function (x) { return x == item.gn })[0]) {
		        $scope.favgames = $scope.favgames.filter(function (x) { return x != item.gn });
		        item.fav = false;
		    }
		    else {
		        item.fav = true;
		        $scope.favgames.push(item.gn);
		    }
		    $rootScope.favGames = $scope.favgames;
		    if ($scope.favgames.length > 0 && $('#favselector').length <= 0)
		        $scope.addFavSportOption();
		    if ($scope.favgames.length <= 0 && $('#favselector').length > 0)
		        $scope.removeFavSportOption();
		}
		$scope.addFavSportOption = function (oninit) {
		    var item = $('<li class="item" id="favselector" href="#" title="' + $filter('translate')('favorites') + '">' +
                                                                '<img class="content" src="images/carousel/fav.png"/>' +
                                                                '<div class="caption">' + $filter('translate')('favorites') + '</div>' +
                                                                '</li>');
		    item.data('id', -1);
		    item.data('cntgames', $scope.favgames.count);
		    item.data('name', $filter('translate')('favorites'));
		    item.data('sort', -1);
		    if (oninit)
		        $('.slidee').append(item);
            else
		        $scope.sly.add(item, 0);
		}
		$scope.removeFavSportOption = function () {
		    var item = $('#favselector');
		    $scope.sly.remove(item);
		}

		

		$scope.sportTitle = $stateParams.catName ? $stateParams.catName : $filter('translate')('soccer');
		
		$scope.sportId = $rootScope.sportId ? $rootScope.sportId : 0;
		$scope.sports = [];
		
		

		$scope.addAllSportOption = function (index) {
		    var item = $('<li class="item" href="#" title="' + $filter('translate')('all') + '">' +
                                                                '<img class="content" src="images/carousel/all.png"/>' +
                                                                '<div class="caption">' + $filter('translate')('all') + '</div>' +
                                                                '</li>');
		    item.data('id', 0);
		    item.data('cntgames', 0);
		    item.data('name', $filter('translate')('all'));
		    item.data('sort', index);
		    $('.slidee').append(item);
		}
		$scope.addSportOption = function (index,v) {
		    var item = $('<li class="item" href="#" title="' + v.name + '">' +
                            '<img class="content" src="images/carousel/' + $.trim(v.id) + '.png"/>' +
                            '<div class="caption" >' + v.name + '</div>' +
                            '</li>');
		    item.data('id', v.id);
		    item.data('cntgames', v.cntgames);
		    item.data('name', v.name);
		    item.data('sort', index);

		    $('.slidee').append(item);
		}

		$scope.middleindex = 0;

		$scope.getSports = function(){
		    var url = apiURL + "/sport/get?type=1&lang=" + $rootScope.currentLang;
		    
		    $http
			.get(url)
			.success(function (data) {
			    $scope.sports = data.items;

			    var index = 0;

			    if ($scope.usefavorites && $rootScope.sportId == -1) {
			        if ($scope.favgames.length > 0) {
			            $scope.addFavSportOption(true);
			            index++;
			        }
			    }

			    if ($scope.liveSportSliderMode == 'forceCentered') {
			        for (var sc = 0; sc <= 5; sc++) {
			            if (useAllLiveSports) {
			                $scope.addAllSportOption(index);
			                index++;
			            }

			            $.each($scope.sports, function (k, v) {
			                $scope.addSportOption(index, v);
			                index++;
			            });
			        }
			    }
			    if($scope.liveSportSliderMode == 'forceCentered'){
			        $scope.middleindex = index;
			    }

			    if (useAllLiveSports) {
			        $scope.addAllSportOption(index);
			        index++;
			    }
			    var scnt = 0;
			    if ($scope.liveSportSliderMode == 'forceCentered')
			        scnt = 5;
			    for (var sc = 0; sc <= scnt; sc++) {


			        $.each($scope.sports, function (k, v) {
			            $scope.addSportOption(index, v);

			            if ($scope.liveSportSliderMode != 'forceCentered' && $rootScope.sportId == v.id) {
			                $scope.middleindex = index;
			            }

			            index++;
			        });
			        if ($scope.usefavorites && $rootScope.sportId == -1 && $scope.favgames.length > 0) {
			                $scope.middleindex = 0;
			        }

			        if (useAllLiveSports && $scope.liveSportSliderMode == 'forceCentered') {
			            $scope.addAllSportOption(index);
			            index++;
			        }
			    }

			    $scope.lastindex = index-1;

			    $scope.initSly();
			   

			});

		}

		$scope.initSly = function () {
		    var $frame = $('.frame');
		    var $slidee = $frame.children('ul').eq(0);
		    var $wrap = $frame.parent();

		    // Call Sly on frame
		    var options = {
		        horizontal: 1,
		        itemNav: $scope.liveSportSliderMode,
		        smart: 1,
		        activateMiddle: 1,
		        activateOn: 'click',
		        mouseDragging: 1,
		        touchDragging: 1,
		        releaseSwing: 1,
		        startAt: $scope.middleindex,
		        scrollBar: $wrap.find('.scrollbar'),
		        scrollBy: 1,
		        speed: 300,
		        elasticBounds: 1,
		        easing: 'easeOutExpo',
		        dragHandle: 1,
		        dynamicHandle: 1,
		        clickBar: 1,
		    };
		    $scope.sly = new Sly($frame, options, {
		        moveEnd: function () {
		            if ($scope.liveSportSliderMode != 'forceCentered')
		                return;

		            var target = $('.slidee .item.active');
		            var payload = {
		                id: target.data('id'),
		                cntgames: target.data('cntgames'),
		                name: target.data('name'),
		                sort: target.data('sort')
		            };
		            $scope.selectSport(payload);
		            if (payload.sort == 0 || payload.sort == $scope.lastindex) {
		                $scope.sly.toCenter();
		            }


		        },
		        active: function () {
		            if ($scope.liveSportSliderMode == 'forceCentered')
		                return;
		            var target = $('.slidee .item.active');
		            var payload = {
		                id: target.data('id'),
		                cntgames: target.data('cntgames'),
		                name: target.data('name'),
		                sort: target.data('sort')
		            };
		            $scope.selectSport(payload);
		        },
		    }).init();
        }

		$scope.selectSport = function (payload) {
		    setTimeout(function () {
		        $scope.$apply(function () {
		            $scope.sportTitle = payload.name;

		            $scope.sportId = payload.id;
		            $rootScope.sportId = $scope.sportId;

		            $(window).scrollTop(0);
		            $scope.pageNumber = 1;
		            $scope.getGames();
		        });
		    }, 50);
		}

		$scope.getSports();

		$scope.getsportname = function(sid){
		    var s = $scope.sports.filter(function (x) { return x.id == sid })[0];
		    if (s)
		        return s.name;
		    else
		        return "";
		}

		$scope.getGames = function () {

		    if ($scope.usefavorites && $scope.sportId == -1) {
		        $scope.items = [];
		        $scope.totalPages = 1;
		        $scope.pageNumber = 1;

		        angular.forEach($scope.favgames, function (i, v) {
		            var url = apiURL + '/live/get?gamenbr=' + i + '&lang=' + $rootScope.currentLang;
		            $http.get(url)
					.success(function (data) {
					    
					    angular.forEach(data.items, function (i, v) {

					        i = $scope.addNew(i, true);

					        var gametips = data.tips.filter(function (x) { return x.gid == i.gid });

					        angular.forEach(gametips, function (tip, value) {
					            if ($rootScope.userSettings && ($rootScope.userSettings.OddsFactor || $rootScope.userSettings.OddsFactorLive))
					                tip.od += tip.li ? $rootScope.userSettings.OddsFactorLive : $rootScope.userSettings.OddsFactor;
					            $scope.setMainOdds(tip, i, true);
					        });
					    });
					    
					    
					    $scope.gamesInitialized = true;

					});
		        });


		        return;
		    }
		    
		    var url = apiURL + "/live/get?pagesize=10&pagenumber=1" + '&lang=' + $rootScope.currentLang;
		    if ($scope.sportId && $scope.sportId > 0)
		        url = url + "&sport=" + $scope.sportId;
		    
			$http
			.get(url)
			.success(function (data) {
			    $scope.items = [];
			    console.log(data);
			    $scope.totalPages = 1;
				angular.forEach(data.items, function(i,v) {
					
					i=$scope.addNew(i, true);

					var gametips = data.tips.filter(function (x) { return x.gid == i.gid });

					angular.forEach(gametips, function (tip, value) {
					    if ($rootScope.userSettings && ($rootScope.userSettings.OddsFactor || $rootScope.userSettings.OddsFactorLive))
					        tip.od += tip.li ? $rootScope.userSettings.OddsFactorLive : $rootScope.userSettings.OddsFactor;
						$scope.setMainOdds(tip,i,true);
					});
				});
				$scope.pageNumber = 1;
				$scope.totalPages = data.totalPages;
				$scope.gamesInitialized = true;
                if($scope.items.length<10)
			        $scope.loadMore();
				
			}).error(function () {
			    $scope.totalPages = 1;
			    $scope.pageNumber = 0;
			    $scope.gamesInitialized = true;
			});
			
		}

		$scope.waitforloading = false;
		$scope.checkPosition = function (top) {
		    $scope.thisposition = top;

		    if ($scope.gamesInitialized && $scope.thisposition < 550 && !$scope.waitforloading) {
		        $scope.loadMore();
		    }
		}

		$scope.loadMore = function () {
		
		    if ($scope.usefavorites && $scope.sportId == -1) {

		        return;
		    }

		    if ($scope.pageNumber >= $scope.totalPages)
		        return;
		    $scope.waitforloading = true;

		    $scope.pageNumber = $scope.pageNumber + 1;

		    console.log("loadmore page: " + $scope.pageNumber);

		    var toDate = moment().format('YYYY-MM-DD');
		    var url = apiURL + "/live/get?pagesize=10&pagenumber=" + $scope.pageNumber + '&lang=' + $rootScope.currentLang;
		    if ($scope.sportId && $scope.sportId > 0)
		        url = url + "&sport=" + $scope.sportId;
		    $http
			.get(url)
			.success(function (data) {
			    console.log("loadmore 1");
			    $scope.totalPages = data.totalPages;
			    angular.forEach(data.items, function (i, v) {
					
			        i = $scope.addNew(i, true);
							
						var gametips = data.tips.filter(function(x){ return x.gid==i.gid });

						angular.forEach(gametips, function (tip, value) {
						    if ($rootScope.userSettings && ($rootScope.userSettings.OddsFactor || $rootScope.userSettings.OddsFactorLive))
						        tip.od += tip.li ? $rootScope.userSettings.OddsFactorLive : $rootScope.userSettings.OddsFactor;
							$scope.setMainOdds(tip,i,true);
						});

			    });

			    console.log("loadmore 2");
			    $scope.waitforloading = false;
			})
            .error(function () {
                $scope.waitforloading = false;
            });
			
		}

		$scope.loadSpecial = function (item) {
			console.log(item);
			$rootScope.gameInfo = item;
		    try {
		        localStorageService.set('gameInfo', item);
		    }
		    catch (e) {
		    }
		}
		
		
		$scope.goLiveCat = function() {
			$state.go('livecategories');
		}



		$scope.tipq = [];
		$scope.addTip = function (gameid, tipid, live) {
		    if ($scope.tipq.filter(function (x) { return x.tipid == tipid })[0])
		        return;
		    $scope.tipq.push({ gameid: gameid, tipid: tipid, live: live });
		}
		$scope.checkq = true;
		$scope.checkTipQ = function () {
		    if (!$scope.checkq)
		        return;
		    if ($scope.tipq.length <= 0) {
		        setTimeout(function (t) {
		            $scope.checkTipQ();
		        }, 10);
		        return;
		    }
		    var tip = $scope.tipq[0];
		    $scope.tipq.splice(0, 1);
		    $scope.addTipBase(tip.gameid, tip.tipid, tip.live).then(function (x) {
		        setTimeout(function (t) {
		            $scope.checkTipQ();
		        }, 10);
		    });
		}
		$scope.checkTipQ();


		$scope.addTipBase = function (gameid, tipid, live) {

		    var deferred = $q.defer();
		    $scope.selectedTips = betSlipSrvc.addtip($scope.selectedTips, gameid, tipid, live);

		    var url = apiURL + "/tipbasket/getaddtip?TipID=" + tipid + "&live=" + live;
		    $http.get(url, loginData.getAuthOptions())
			.success(function (data) {
			    if (!data.success) {
			        $scope.selectedTips = betSlipSrvc.addtip($scope.selectedTips, gameid, tipid, live);
			        if (data.ErrorList && data.ErrorList.length > 0)
			            msgDialogSrvc.showDialog('#betslip', 'warning', $filter('translate')('addtip_failed') + ': ' + data.ErrorList[0].ErrorTypeText);
			        else
			            msgDialogSrvc.showDialog('#betslip', 'warning', 'addtip_failed');
			    }
			    betSlipSrvc.set(data);
			    deferred.resolve();
			})
			.error(function (data) {
			    console.log("Somethings wrong about adding tip - 2485 line");
			    msgDialogSrvc.showDialog('#betslip', 'warning', 'addtip_failed');
			    deferred.resolve();
			});

		    return deferred.promise
		}

		$scope.isTipSelected = function(name, tipid) {
			var tipexists = $scope.selectedTips.filter(function(x){ return x ==tipid })[0];
			
			if (tipexists)
				return true;
			else
				return false;
		}

		$scope.addNew = function (item, init) {
		    if (item.gs == "Interrupted" || item.gs == "abandoned" || item.gs == 'Finished' || item.gs == 'Retired' ||
                item.gs == 'OverTimeFinished' || item.gs == 'Walkover' || !item.ac || !item.vi || item.type==2)
		        return;

		    if ($scope.usefavorites) {
		        item.fav = false;
		        if ($scope.favgames.filter(function (x) { return x == item.gn })[0]){
		            item.fav = true;
		            if ($('#favselector').length <= 0)
		                $scope.addFavSportOption();
		        }

		    }
		    
		    item.t1rc = item.t1rc;
		    item.t2rc = item.t2rc;

		    item.mc = item.mc > 1 ? "(" + item.mc + ")" : "";
		    item.tips = [];
		    for (var t = 0; t < 22; t++)
		        item.tips.push({ ac: false, id: 0, odd: 1.0, tp: t + '' });
		    angular.forEach(item.tips, function (tip, v) {
		        switch (tip.tp) {
		            case "0": tip.bt = 1; tip.gt = 1; tip.sn = "1"; break;
		            case "1": tip.bt = 1; tip.gt = 1; tip.sn = "x"; break;
		            case "2": tip.bt = 1; tip.gt = 1; tip.sn = "2"; break;
		            case "3": tip.bt = 2; tip.gt = 1; tip.sn = "+"; break;
		            case "4": tip.bt = 2; tip.gt = 1; tip.sn = "-"; break;
		            case "5": tip.bt = 3; tip.gt = 1; tip.sn = "1"; break;
		            case "6": tip.bt = $scope.netsports.indexOf(item.sid) > -1 ? -1 : 3; tip.gt = 1; tip.sn = "x"; break;
		            case "7": tip.bt = 3; tip.gt = 1; tip.sn = "2"; break;
		            case "8": tip.bt = 8; tip.gt = 1; tip.sn = "1"; break;
		            case "9": tip.bt = $scope.netsports.indexOf(item.sid) > -1 || $scope.othersports.indexOf(item.sid) > -1 ? -1 : 8; tip.gt = 1; tip.sn = "x"; break;
		            case "10": tip.bt = 8; tip.gt = 1; tip.sn = "2"; break;
		            case "11": tip.bt = 8; tip.gt = 2; tip.sn = "1"; break;
		            case "12": tip.bt = $scope.netsports.indexOf(item.sid) > -1 || $scope.othersports.indexOf(item.sid) > -1 ? -1 : 8; tip.gt = 2; tip.sn = "x"; break;
		            case "13": tip.bt = 8; tip.gt = 2; tip.sn = "2"; break;
		            case "14": tip.bt = 1; tip.gt = 2; tip.sn = "1"; break;
		            case "15": tip.bt = 1; tip.gt = 2; tip.sn = "x"; break;
		            case "16": tip.bt = 1; tip.gt = 2; tip.sn = "2"; break;
		            case "17": tip.bt = 2; tip.gt = 2; tip.sn = "+"; break;
		            case "18": tip.bt = 2; tip.gt = 2; tip.sn = "-"; break;
		            case "19": tip.bt = 3; tip.gt = 2; tip.sn = "1"; break;
		            case "20": tip.bt = 3; tip.gt = 2; tip.sn = "x"; break;
		            case "21": tip.bt = 3; tip.gt = 2; tip.sn = "2"; break;
		            default: break;
		        }

		    });

			if (item.gs == 'NotStarted')
			{
			    item.t1s = "";
			    item.t2s = "";
			}
			var i = $scope.items.filter(function(x){ return x.gid==item.gid })[0];
			if (!i) {
			    item.setscores = [];
			    var sslist = item.ss.split('-');
			    for (var index in sslist) {
			        var ss = sslist[index];
			        if (!ss || ss == '' || ss == ' ' || ss == ':')
			            continue;
			        var last = false;
			        if (parseInt(index) == sslist.length - 2)
			            last = true;
			        item.setscores.push({ id: index * -1, home: ss.split(':')[0], away: ss.split(':')[1], last: last });
			    }
			    $scope.items.push(item);
			    return item;
			}
			else
			    return i;
		    
		}

	    $scope.setGameData= function (item,i){

		    if(!i)
			    return;
		    i.mp=item.mp;

	        i.t1s=item.t1s;
	        i.t2s=item.t2s;
	        i.gd=item.gd;
	        i.ac=item.ac;
	        i.ss = item.ss;
	        i.t1rc = item.t1rc;
	        i.t2rc = item.t2rc;
	        i.t1yc = item.t1yc;
	        i.t2yc = item.t2yc;
	        i.mc= item.mc > 1 ? "("+item.mc+")" : "";

	        var ogs = i.gs;
	        i.gs=item.gs;
	    
	        i.cb = item.cb;

	        $scope.handleGameState(i,ogs);

	    };

        

		$scope.handleGameState = function(i,ogs){
			
		    if (!i.ac || !i.vi || i.gs == "Interrupted" || i.gs == "abandoned" || i.gs == 'Finished' || i.gs == 'Retired' ||
                i.gs == 'OverTimeFinished' || i.gs == 'Walkover' || i.gs == 'Delayed')
			{
				setTimeout(function () {
					$scope.$apply( function() {
						$scope.handleGameRemove(i);
					});
				}, 10000);
		    }

		};

		$scope.handleGameRemove = function (i) {
		    $scope.items = $scope.items.filter(function (x) { return x.gid != i.gid });
		};

		$scope.setMainTipProperties = function(newtip,tip,newgame){
			if(!tip)
			    return;

			tip.id = newtip.id;
			
			tip.ac = newtip.ac;
			if (newgame || !tip.ac)
			{
			    tip.odd = newtip.od;
			    tip.higher = '';
			    return;
			}
			
				
			if (newtip.od > tip.odd) {
				tip.higher = 'high';
			} else if (newtip.od < tip.odd) {
				tip.higher = 'low';
			}
			tip.odd = newtip.od;
		    setTimeout(function () {
				tip.higher = '';
			}, 4000);
	        
        };


        $scope.setMainOdds= function (tip,i,newgame){
	        if(!i)
		        return;
	        
	        if(i.gs!='NotStarted' && !tip.li)
	            return;
	        if (i.gs == 'NotStarted' && tip.bt==1 && !tip.li) {
	            tip.bt = 8;
	            if (tip.tp == 0)
	                tip.tp = 8;
	            if (tip.tp == 1)
	                tip.tp = 9;
	            if (tip.tp == 2)
	                tip.tp = 10;
	        }

	        var cs = i.t1s + ':' + i.t2s;

	        
            
	        i.tips[parseInt(tip.tp)].bt = tip.bt;
	        i.tips[parseInt(tip.tp)].gt = tip.gt;

	        if (tip.tp == '3' || tip.tp == '4' || tip.tp == '17' || tip.tp == '18') {
	            if (tip.ac && (tip.tp == '3' || tip.tp == '4'))
	                i.ouvalue = tip.vl;
	            if (tip.ac && (tip.tp == '17' || tip.tp == '18'))
	                i.ouvalueht = tip.vl;

                if (!(tip.ac == false && i.ouvalue != tip.vl))
                    $scope.setMainTipProperties(tip, i.tips[parseInt(tip.tp)], newgame);
            }
            else {
                if (tip.ac || cs == tip.vl.trim())
                    $scope.setMainTipProperties(tip, i.tips[parseInt(tip.tp)], newgame);
            }
		};

		angular.element(document).ready(function () {

		    $rootScope.currentPage = $filter('translate')('LIVE');
		    var betSlip = betSlipSrvc.init().then(function (data) {
		        angular.forEach(data.data.InputList, function (i, v) {
		            angular.forEach(i.FTips, function (i, v) {
		                $scope.selectedTips.push(i.TipID);
		            });
		        });
		    });
		    //doAddToHomeScreen();
		});


	    // SIGNALR HUB PROXY - REAL TIME DATA CONNECTION CHECK

		var deregGameChangeEvent = $rootScope.$on('GAMECHANGE_EVENT', function (event, args) {
		    if (!$scope.gamesInitialized)
		        return;

		    var item = args.data;
		    var i = $scope.items.filter(function (x) { return x.gid == item.gid })[0];
		    if (!i) {
		        var sid = parseInt($scope.sportId);
		        if (sid > 0 && item.sid != sid)
		            return;
		        $scope.addNew(item, false);
		        i = $scope.items.filter(function (x) { return x.gid == item.gid })[0];
		    }
		    $scope.setGameData(item, i);

		});
		var deregTipChangeEvent = $rootScope.$on('TIPCHANGE_EVENT', function (event, args) {
		    if (!$scope.gamesInitialized || (args.data.bt != 1 && args.data.bt != 2 && args.data.bt != 3 && args.data.bt != 8)) //todo enum
		        return;

		    var item = args.data;
		    var i = $scope.items.filter(function (x) { return x.gid == item.gid })[0];
		    $scope.setMainOdds(item, i, false);
		});

		$scope.doOnOrientationChange = function () {
		    if (!$scope.sly)
		        return;
		    switch (window.orientation) {
		        case -90:
		        case 90:
		            $scope.sly.reload();
		            break;
		        default:
		            $scope.sly.reload();
		            break;
		    }
		}

		window.addEventListener('orientationchange', $scope.doOnOrientationChange);

		$scope.$on('$destroy', function () {
		    $scope.checkq = false;
		    deregGameChangeEvent();
		    deregTipChangeEvent();
		    window.removeEventListener('orientationchange', $scope.doOnOrientationChange);
		    if (!$scope.sly)
		        $scope.sly.destroy();

		    angular.element($window).unbind('scroll');
		});


		

	}
})();