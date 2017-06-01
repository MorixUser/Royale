(function() {
	'use strict';
	angular
	.module('betApp')
	.controller('searchCtrl', searchCtrl);

	function searchCtrl($rootScope, $state, $scope, $translate, localStorageService, $http, $stateParams, $filter, loginData, betSlipSrvc, $timeout, $q, $window) {


	    $scope.gamesInitialized = false;
	    $scope.items = [];
	    $scope.selectedTips = [];
	    $scope.netsports = netsports;
	    $rootScope.currentPage = $filter('translate')('searchresult');
		
		$scope.sportId = $stateParams.catId ? $stateParams.catId : 1;

        $scope.leaguetable=[];

		$scope.getLeagueTable = function (id,name) {
		    var deferred = $q.defer();
		    var url = apiURL + "/LeagueTable/GetTable?tournamentid=" + id + "&lang=" + $rootScope.currentLang;
		            
		    $http
			.get(url)
			.success(function (data) {
			    if (!data.success)
			        return;
			    deferred.resolve({ success: data.success, payload: data.items, trid:id,tn:name });
			})
            .error(function (e) {
                deferred.resolve({ success: false, payload: [] });
            });
		    return deferred.promise
		}

		$scope.leaguetableForTN = function (tn) {
		    return $scope.leaguetable.filter(function (x) { return x.tn == tn });
		}

		
		

		var deregSearchEvent = $rootScope.$on('SEARCH_EVENT', function (event, args) {
            
		    if (args.text && args.text.length > 0)
		      $scope.getGames(args.text);
		});

		$scope.getGames = function(string){
			$scope.items=[];
		    var url = apiURL + "/bet/get?pagesize=50&name="+string;
		    var lang = $rootScope.currentLang;		    
			$http
			.get(url)
			.success(function(data) {
				angular.forEach(data.items, function(i,v) {
					$scope.addNew(i);
					var gametips = data.tips.filter(function(x){ return x.gid==i.gid });
					angular.forEach(gametips, function(tip, value) {
						$scope.setMainOdds(tip,i,true);
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

		$scope.addNew = function(item) {
		    if (item.gs != "NotStarted" || !item.ac && !item.vi)
				return;
		    item.mc = item.mc > 1 ? "(" + item.mc + ")" : "";

		    item.tip12 = { ac: false, id: 0, odd: 1.0 }; item.tipx2 = { ac: false, id: 0, odd: 1.0 }; item.tip22 = { ac: false, id: 0, odd: 1.0 };

		    var i = $scope.items.filter(function (x) { return x.gid == item.gid })[0];
		    if (!i) {
		        $scope.items.push(item);
		    }
		}

	    $scope.setGameData= function (item,i){

		    if(!i)
		        return;

	        i.gd=item.gd;
	        i.ac=item.ac;
	        i.mc= item.mc > 1 ? "("+item.mc+")" : "";
	        i.gs = item.gs;
            i.cb = item.cb;

	        $scope.handleGameState(i);
	    };


		$scope.handleGameRemove = function(i){
			$scope.items = $scope.items.filter(function (x) { return x.gid != i.gid });
		};

		$scope.handleGameState = function(i){
		    if (i.gs != 'NotStarted' || !i.ac || !i.vi)
				$scope.handleGameRemove(i);
			return;
		};

		$scope.setMainTipProperties = function(newtip,tip,newgame){
			if(!tip)
			    return;

			tip.odd = newtip.od;
			tip.ac = newtip.ac;
			tip.id = newtip.id;

			if(newgame || !tip.ac)
			{
			    tip.higher = '';
			    return;
			}

			if (newtip.od > tip.odd) {
				tip.higher = 'high';
			} else if (newtip.od < tip.odd) {
				tip.higher = 'low';
			}
			
	        
		    setTimeout(function () {
				tip.higher = '';
			}, 1000);
	        
        };


        $scope.setMainOdds= function (tip,i,newgame){
	        if(!i)
		        return;
	
	        if(i.gs!='NotStarted')
		        return;

	        switch (tip.tp) {
		        case '0':
			        $scope.setMainTipProperties(tip, i.tip12, newgame);
		        break;
		        case '1':
			        $scope.setMainTipProperties(tip, i.tipx2, newgame);
		        break;
		        case '2':
			        $scope.setMainTipProperties(tip, i.tip22, newgame);
		        break;
		        default:
		        break;
	        }
        };


        $scope.addTip = function (gameid, tipid, live) {

            $scope.selectedTips = betSlipSrvc.addtip($scope.selectedTips, gameid, tipid, live);

            var url = apiURL + "/tipbasket/getaddtip?TipID=" + tipid + "&live=" + live;
            $http.get(url, loginData.getAuthOptions())
			.success(function (data) {
			    if (!data.success) {
			        $scope.selectedTips = betSlipSrvc.addtip($scope.selectedTips, gameid, tipid, live);
			        if (data.ErrorList || data.ErrorList.length > 0)
			            msgDialogSrvc.showDialog('#betslip', 'warning', $filter('translate')('addtip_failed') + ': ' + data.ErrorList[0].ErrorTypeText);
			        else
			            msgDialogSrvc.showDialog('#betslip', 'warning', 'addtip_failed');
			    }
			    betSlipSrvc.set(data);
			})
			.error(function (data) {
			    console.log("Somethings wrong about adding tip - 2485 line");
			});
        }

        $scope.isTipSelected = function (name, tipid) {
            var tipexists = $scope.selectedTips.filter(function (x) { return x == tipid })[0];

            if (tipexists)
                return true;
            else
                return false;
        }

	    angular.element(document).ready(function () {

	        

	    });


	    // SIGNALR HUB PROXY - REAL TIME DATA CONNECTION CHECK

		var deregGameChangeEvent = $rootScope.$on('GAMECHANGE_EVENT', function (event, args) {
		    if (!$scope.gamesInitialized)
		        return;

		    var item = args.data;
		    var i = $scope.items.filter(function (x) { return item.sid == $stateParams.sportId && item.cid == $stateParams.catId && item.tid == $stateParams.tourId && x.gid == item.gid })[0];
		    
		    if (i) {
		        $scope.setGameData(item, i);
		    }
		});
		var deregTipChangeEvent = $rootScope.$on('TIPCHANGE_EVENT', function (event, args) {
		    if (!$scope.gamesInitialized || args.data.bt!=1 || args.data.li) //todo enum
		        return;
		    var item = args.data;
		    var i = $scope.items.filter(function (x) { return x.gid == item.gid })[0];
		    $scope.setMainOdds(item, i, false);
		});

		$scope.$on('$destroy', function () {
		    deregGameChangeEvent();
		    deregTipChangeEvent();
		    deregSearchEvent();
		});


		

	}
})();