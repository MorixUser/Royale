(function() {
	'use strict';
	angular
	.module('betApp')
	.factory('betSlipSrvc', betSlipSrvc);

	function betSlipSrvc($rootScope, $http, loginData, $q) {
		//var items = [];
		//var cntBets = 0;
		//var totalOdd = 0;
		//var maxWin = 0;
		//var systemItems = [];
		
		return {
		    addtip: function(selectedtips,gameid,tipid,live){
		        var getIndex = function (array, value) {
		            for (var i = 0; i < array.length; i++) {
		                if (array[i] == value) {
		                    return i;
		                }
		            }
		        }

		        var tipexists = selectedtips.filter(function (x) { return x == tipid })[0];
		            
		        if (tipexists) {
		            var index = getIndex(selectedtips, tipexists);
		            selectedtips.splice(index, 1);
		        } else {
		            selectedtips.push(tipid);
		        }
		        return selectedtips;
		        

		    },
			set: function(data) {
				//items = data.InputList;
				//cntBets = data.CntBets;
				//totalOdd = data.TotalOdd;
				//maxWin = data.MaxWin;
				//systemItems = data.PossibleSystems;
				$rootScope.betslipiteml=data.CntTips;
			},
			//get: function() {
			//	return {items: items, cntbets: cntBets, totalOdd: totalOdd, maxWin: maxWin, systemItems:systemItems};
			//},
			init: function() {
				var authOpt = loginData.getAuthOptions();
				var promise = $http.get(apiURL + "/tipbasket/gettipbasketdata", authOpt);
				return promise;
			},
			setTipCount: function() {
			    var authOpt = loginData.getAuthOptions();
			    $http.get(apiURL + "/tipbasket/GetTipCnt", authOpt).then(function (data) {
			        $rootScope.betslipiteml = data.data.CntTips;
			    });
			}

		}
	}
})();