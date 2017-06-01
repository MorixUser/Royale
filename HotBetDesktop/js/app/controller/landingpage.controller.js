(function () {
    'use strict';
    angular
	.module('betApp')
	.controller('landingPageCtrl', landingPageCtrl);

    function landingPageCtrl($http, $scope, localStorageService, $translate, $filter, $state, loginData, $rootScope, betSlipSrvc, $timeout) {
        $scope.slideItems = [];
        $scope.sliderurl = sliderUrl;
        $scope.selectedTips = [];
        $scope.sliderTabs = [{
            id: 1,
            name: $filter('translate')('HIGHLIGHTS')
        },
        {
            id: 2,
            name: $filter('translate')('LIVE')
        }];

        $scope.currentTab = 1;
        $scope.usecasino = usecasino;
        $scope.gotoCasino = function () {
            $window.location = casinolink;
        }
        $scope.casinoallowed = true;

        $scope.tournaments = [{
            sportId: 1,
            catId: 30,
            tourId: 42,
            mid: 0,
            name: 'Bundesliga',
            img: 'images/leagues/bundesliga.png',
        },
        {
            sportId: 1,
            catId: 46,
            tourId: 62,
            mid: 1,
            name: 'SüperLig',
            img: 'images/leagues/superlig.png',
        }, {
            sportId: 1,
            catId: 1,
            tourId: 1,
            mid: 2,
            name: 'PremierLig',
            img: 'images/leagues/premierleague.png',
        },
        {
            sportId: 1,
            catId: 32,
            tourId: 36,
            mid: 3,
            name: 'PrimeraDivision',
            img: 'images/leagues/laliga.png',
        }, ];

        $scope.addTournamentOption = function (index, v) {
            var item = $('<li class="item" href="#" title=""><img src="' + v.img + '" /></li>');
            item.data('id', v.tourId);
            item.data('catId', v.catId);
            item.data('sportId', v.sportId);
            item.data('name', v.name);
            item.data('sort', index);
            $('.slidee').append(item);
        }

        $scope.initSly = function () {
            var $frame = $('.frame');
            var $slidee = $frame.children('ul').eq(0);

            var $wrap = $frame.parent();

            // Call Sly on frame
            var options = {
                horizontal: 1,
                itemNav: 'basic',
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
                active: function () {
                    var target = $('.slidee .item.active');
                    var payload = {
                        tourId: target.data('id'),
                        catId: target.data('catId'),
                        sportId: target.data('sportId'),
                        name: target.data('name'),
                        sort: target.data('sort')
                    };
                    $scope.selectTournament(payload);
                },
            }).init();

        }
        $scope.selectTournament = function (element) {
            setTimeout(function () {
                $scope.$apply(function () {
                    $state.go('games', { sportId: element.sportId, catId: element.catId, tourId: element.tourId, name: element.name });
                });
            }, 50);
        }

        $scope.initTournaments = function () {
            var index = 0;
            $.each($scope.tournaments, function (k, v) {
                $scope.addTournamentOption(index, v);
                index++;
            });
            $scope.initSly();
        }



        //*image slider*//

        $scope.selectImage = function (element) {
            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.goSpecialBet(element.gid, element.mid, element.gs);
                });
            }, 50);
        }
        $scope.initSlyImage = function () {
            var $frame = $('.frameImage');
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
            $scope.slyImage = new Sly($frame, options, {

            }).init();

        }

        $scope.initImages = function () {
            $scope.initSlyImage();
        }






        //*match slider*//
        $scope.addMatchOption = function (index, v) {
            var item = $('<li class="item" href="#" title="">' +
                '<div class="content-item"><div class="content-date">' + $filter('matchTimeFilter')(v.gd) + '</div>' +
                '<div class="content-teams"><div>' + v.t1n + '</div><div>vs</div><div>' + v.t2n + '</div></div></div>' +
                '</li>');
            item.data('gid', v.gid);
            item.data('mid', v.mid);
            item.data('gs', v.gs);
            $('.slideeMatch').append(item);
        }
        $scope.selectMatch = function (element) {
            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.goSpecialBet(element.gid, element.mid, element.gs);
                });
            }, 50);
        }
        $scope.initSlyMatch = function () {
            var $frame = $('.frameMatch');
            var $slidee = $frame.children('ul').eq(0);

            var $wrap = $frame.parent();

            // Call Sly on frame
            var options = {
                horizontal: 1,
                itemNav: 'basic',
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
            $scope.slyMatch = new Sly($frame, options, {
                active: function () {
                    var target = $('.slideeMatch .item.active');
                    var payload = {
                        gid: target.data('gid'),
                        mid: target.data('mid'),
                        gs: target.data('gs')
                    };
                    $scope.selectMatch(payload);
                },
            }).init();

        }

        $scope.initMatches = function (items) {
            if ($scope.slyMatch)
                $scope.slyMatch.destroy();
            $('.slideeMatch').empty();
            var index = 0;
            $.each(items, function (k, v) {
                $scope.addMatchOption(index, v);
                index++;
            });
            $scope.initSlyMatch();
        }

        $scope.getItems = function (id) {
            var lang = $rootScope.currentLang;
            var url = '';
            switch (id) {
                case 1:
                    url = apiURL + "/bet/get?pagesize=10&sport=1&category=&tournament=" + "&lang=" + lang+"&highlight=true";
                    break;
                case 2:
                    url = apiURL + "/live/get?pagesize=10&pagenumber=1" + '&lang=';
                    break;
            }
            $http
             .get(url)
			.success(function (data) {
			    $scope.initMatches(data.items)
			});
        }
        $scope.changeTab = function (tab) {
            $scope.currentTab = tab.id;
            $scope.getItems(tab.id);
        }
        angular.element(document).ready(function () {
            loginData.isLoggedin().then(function (promise) {
                $scope.isLoggedin = promise.success;

                if (promise.success && usecasino) {
                    $scope.casinoallowed = $rootScope.userSettings ? $rootScope.userSettings.CasinoAllowed : localStorageService.get('userSettings') ? localStorageService.get('userSettings').CasinoAllowed : false;
                }
                $scope.getItems(1);

                var url = apiURL + "/slider/get?ad=0";
                $http
                .get(url)
                .success(function (data) {
                    $scope.slideItems = data.games;
                    setTimeout(function () {
                        $(".frameImage .slideeImage li").css('width', window.innerWidth);
                        $scope.initImages();
                    }, 100);
                });



            });


            $(window).scrollTop(0);

            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.initTournaments();
                });
            }, 50);
        });
        $scope.goSpecialBet = function (gameid, matchid, gs) {
            $state.go('specialbets', { gameId: gameid, mId: matchid, gs: gs });
        }

        $scope.goRegistration = function () {
            $state.go('register');
        }

        $scope.doOnOrientationChange = function () {
            if ($scope.sly) {
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
            if ($scope.slyMatch) {
                switch (window.orientation) {
                    case -90:
                    case 90:
                        $scope.slyMatch.reload();
                        break;
                    default:
                        $scope.slyMatch.reload();
                        break;
                }
            }
            if ($scope.slyImage) {
                switch (window.orientation) {
                    case -90:
                    case 90:
                        $scope.slyImage.reload();
                        break;
                    default:
                        $scope.slyImage.reload();
                        break;
                }
            }
        }

        $scope.doResize = function() {
            if ($scope.slyImage) {
                $(".frameImage .slideeImage li").css('width', window.innerWidth);
                $scope.slyImage.reload();
            }
        }

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
        window.addEventListener('orientationchange', $scope.doOnOrientationChange);
        window.addEventListener('resize', $scope.doResize);

        $scope.$on('$destroy', function () {
            window.removeEventListener('orientationchange', $scope.doOnOrientationChange);
            window.removeEventListener('resize', $scope.doResize);
            if ($scope.sly)
                $scope.sly.destroy();
            if ($scope.slyMatch)
                $scope.slyMatch.destroy();
            if ($scope.slyImage)
                $scope.slyImage.destroy();
        });
    }
})();