var companyname = 'hotbet777.com';
var LobbyUrl="https://demo.hotbet777.com/mobile/";
var apiURL = "https://demo.hotbet777.com/api/";
var siteURL = "https://demo.hotbet777.com/";
var infoDomain = "https://demo.hotbet777.com/mobile/";
var useLMT = false;
var LMTUrl = "https://cs.betradar.com/ls/widgets/?/runbet/";
var GwtWrUrl = 'https://demo.hotbet777.com/web/GwtWrapper.html';
var sblobbyurl='https://demo.morix.co';
var gwtimgpath= "https://demo.hotbet777.com/web/gwt/icons/";
var getgwtgameurl="https://demo.hotbet777.com/api/casino/GetDWAuthToken";

var favoritelist = [
];

var favoritegameidsMobile = [
 'ar','ko','war'
];
var favoritegameids=[

 ];
 var gamesettings = {
  gwt: true,
};

var defaultLang = 'de';
var defaultZone = 'Europe/Amsterdam';
var bettypesettings = [{name:'tip',type:1,selected:true,}];
var multibetSelection = false;
var netsports = [3, 5, 10, 16, 21, 22, 23, 34];
var othersports = [2];
var casinolink = "casino";
var showCategoryFlags = true;
var useAllLiveSports = true;
//var liveSportSliderMode = "forceCentered";
var liveSportSliderMode = "basic";
var showinfopages = true;
var useregistration = true;
var usecasino = true;
var usemorebets = true;
var homescreenappID = 'hotbet777.app';
var useaddtohomescreen = true;
var onlinepayment = true;
var defaultrememberme = true;
var usecasinobottom = true;
var navshortcutcount = 50;
var startpage = 'hbsport';
var header3 = false;
var showoutrightsingames = true;
var usefavorites = true;
var useticketconfirmation = true;
var navbetweentournaments = false;
var useownstakeinput = true;
var sliderUrl = "https://runbet.com/Content/Design7/Images/New/";
var bettypesettings = [];
bettypesettings.push({ name: 'tip', selected: true, main: true, netsport: true, othersport: true, bt: 8, gt: 1 });
bettypesettings.push({ name: 'restofmatch', selected: false, main: true, bt: 1, gt: 1, onlyballsport:true });
bettypesettings.push({ name: 'overunder', selected: false, main: true, netsport: true, othersport: true, bt: 2, gt: 1 });
bettypesettings.push({ name: 'nextgoal', selected: false, main: !usemorebets, bt: 3, gt: 1, onlyballsport: true });
bettypesettings.push({ name: 'setwinner', selected: false, main: true, netsport: true, onlynetsport: true, bt: 3, gt: 1 });
bettypesettings.push({ name: 'halftime', selected: false, main: true, othersport: true, onlyothersport: true, bt: 3, gt: 1 });
bettypesettings.push({ name: 'ht_tip', selected: false, bt: 8, gt: 2, onlyballsport: true });
bettypesettings.push({ name: 'ht_restofmatch', selected: false, bt: 1, gt: 2, onlyballsport: true });
bettypesettings.push({ name: 'ht_overunder', selected: false, bt: 2, gt: 2, onlyballsport: true });
bettypesettings.push({ name: 'ht_nextgoal', selected: false, bt: 3, gt: 2, onlyballsport: true });


function doAddToHomeScreen() {
    if (!useaddtohomescreen)
        return;
    addToHomescreen({ appID: homescreenappID, startDelay: 1, lifespan: 60 });
    var max = 3;
    var itv = setInterval(function () {
        if ($('.ath-action-icon').length > 0) {
            $("<style>")
                .prop("type", "text/css")
                .html(".ath-application-icon{position: absolute; left: -64px; background-color: #ffffff;} .ath-container.ath-icon:before {position: absolute !important; top: -24px !important; right: -24px !important; border-radius: 8px;}")
                .appendTo("head");
            clearInterval(itv);
        }
        else {
            max -= 1;
            if (max == 0) {
                clearInterval(itv);
            }
        }
    }, 2000);

}

function NewSalt() {
  var now = new Date();
  return Math.round(1e6 * Math.random()) + ':' + 1e6 * Math.random() + ':' + 1e6 * Math.random() + ':' + now.getMilliseconds() + ':' + now.getSeconds();
}


openHome = function () {
   

    $('#appMenu').attr('class', 'menu-container');
    $('#appContainer').attr('class', 'menu-overflow');
    setTimeout(function () {
        $('appHomeButton').off('click', openHome);
        $(document).on('click', closeMenu);
    }, 10);
}

closeMenu = function () {

    $('#appMenu').attr('class', 'menu-hidden');
    $('#appContainer').attr('class', 'menu-normal');
    setTimeout(function () {
        $(document).off('click', closeMenu);
        $('appHomeButton').on('click', openHome);
    },10);
};

function getParameterByName(name) //courtesy Artem
{
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}